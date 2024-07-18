import { expect } from 'chai';

export class Action {
  constructor(action) {
    this.action = action;
  }

  getAccount(testManager, context) {
    const from = testManager.replaceVariables(
      this.action.account || testManager.account.address,
      context,
    );
    console.log(`  ⤷ 👛 Executing action with account ${from}`);
    return from;
  }

  async execute(testManager, context) {
    throw new Error('Execute method must be implemented');
  }

  validate(result, receipt, tx, error, context) {
    const replaceContextVariables = (obj, context) => {
      if (typeof obj === 'string' && obj.startsWith('$')) {
        const variableName = obj.substring(1);
        const parts = variableName.split('.');
        let value = context;
        parts.forEach(part => {
          value = value[part];
        });
        return value;
      } else if (Array.isArray(obj)) {
        return obj.map(item => replaceContextVariables(item, context));
      } else if (typeof obj === 'object' && obj !== null) {
        for (const key in obj) {
          obj[key] = replaceContextVariables(obj[key], context);
        }
      }
      return obj;
    };

    const validateField = (field, sources, context) => {
      Object.keys(field).forEach(key => {
        const condition = field[key];
        const parts = key.split('.');
        const sourceType = parts.shift();
        const sourcePath = parts.join('.');
        let actualValue;

        if (sourceType === 'result') {
          actualValue = sourcePath
            .split('.')
            .reduce((obj, part) => obj && obj[part], sources.result);
        } else if (sourceType === 'receipt') {
          actualValue = sourcePath
            .split('.')
            .reduce((obj, part) => obj && obj[part], sources.receipt);
        } else if (sourceType === 'tx') {
          actualValue = sourcePath.split('.').reduce((obj, part) => obj && obj[part], sources.tx);
        } else if (sourceType === 'error') {
          actualValue = error ? error.message : '';
        } else {
          throw new Error(`Unknown source type: ${sourceType}`);
        }

        const expectedValue = replaceContextVariables(condition, context);

        let validated = false;
        if (expectedValue.eq !== undefined) {
          if (process.env.SHOW_TX_DETAILS === 'true') {
            console.log(
              `🔍 Validating data: ${key}, condition: eq, expected: ${JSON.stringify(expectedValue.eq)}, actual: ${JSON.stringify(actualValue)}`,
            );
          }
          if (typeof expectedValue.eq === 'object') {
            expect(actualValue).to.deep.equal(expectedValue.eq);
          } else {
            expect(actualValue).to.eq(expectedValue.eq);
          }
          validated = true;
        }
        if (expectedValue.include !== undefined) {
          if (process.env.SHOW_TX_DETAILS === 'true') {
            console.log(
              `🔍 Validating data: ${key}, condition: include, expected: ${JSON.stringify(expectedValue.include)}, actual: ${JSON.stringify(actualValue)}`,
            );
          }
          if (typeof expectedValue.include === 'string') {
            expect(actualValue).to.include(expectedValue.include);
          } else if (Array.isArray(expectedValue.include)) {
            expectedValue.include.forEach(item => {
              expect(actualValue).to.deep.include(item);
            });
          }
          validated = true;
        }
        if (expectedValue.notInclude !== undefined) {
          if (process.env.SHOW_TX_DETAILS === 'true') {
            console.log(
              `🔍 Validating data: ${key}, condition: notInclude, expected: ${JSON.stringify(expectedValue.notInclude)}, actual: ${JSON.stringify(actualValue)}`,
            );
          }
          if (typeof expectedValue.notInclude === 'string') {
            expect(actualValue).to.not.include(expectedValue.notInclude);
          } else if (Array.isArray(expectedValue.notInclude)) {
            expectedValue.notInclude.forEach(item => {
              expect(actualValue).to.not.deep.include(item);
            });
          }
          validated = true;
        }

        if (!validated) {
          console.log('🔔 No validation rule recognized');
        }
      });
    };

    if (!this.action.expect) {
      this.action.expect = {};
    }
    if (!this.action.expect.error) {
      this.action.expect.error = { eq: '' };
    }

    if (this.action.expect) {
      validateField(this.action.expect, { result, receipt, tx, error }, context);
    }
  }

  async estimateGas(tx, testManager, context) {
    tx.from = testManager.replaceVariables(
      this.action.account || testManager.account.address,
      context,
    );
    if (!tx.gas || tx.gas === 'auto') {
      tx.gas = await testManager.web3.eth.estimateGas(tx);
    }
    return tx;
  }

  async estimateGas(tx, testManager, context) {
    if (!tx.gas || tx.gas === 'auto') {
      tx.gas = undefined;
      tx.gas = await testManager.web3.eth.estimateGas(tx);
    }

    if (process.env.SHOW_TX_DETAILS === 'true') {
      console.log('⛽️ Transaction Gas:', tx.gas);
    }

    return tx;
  }

  async sendTransaction(tx, testManager, context) {
    const account = testManager.web3.eth.accounts.wallet[tx.from];
    if (!account) {
      throw new Error(`Account ${tx.from} not found in web3 wallet`);
    }

    const signedTx = await account.signTransaction(tx);

    if (process.env.SHOW_TX_DETAILS === 'true') {
      console.log('📒 Transaction Details:', signedTx);
    }

    const receipt = await testManager.web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    if (process.env.SHOW_TX_DETAILS === 'true') {
      console.log('🧾 Transaction Receipt:', receipt);
    }

    return { tx: signedTx, receipt };
  }
}
