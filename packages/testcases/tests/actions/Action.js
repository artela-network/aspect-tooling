import { expect } from 'chai';
import { Transaction as EthereumTx } from 'ethereumjs-tx';


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

  validate(result, receipt, tx, error, context, testManager) {
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

        const expectedValue = testManager.replaceVariables(condition, context);

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
        if (expectedValue.gt !== undefined) {
          if (process.env.SHOW_TX_DETAILS === 'true') {
            console.log(
              `🔍 Validating data: ${key}, condition: gt, expected: ${JSON.stringify(expectedValue.gt)}, actual: ${JSON.stringify(actualValue)}`,
            );
          }
          if (typeof expectedValue.gt === 'object') {
            expect(actualValue).to.be.above(expectedValue.gt);
          } else {
            expect(actualValue).to.be.gt(expectedValue.gt);
          }
          validated = true;
        }
        if (expectedValue.lt !== undefined) {
          if (process.env.SHOW_TX_DETAILS === 'true') {
            console.log(
              `🔍 Validating data: ${key}, condition: lt, expected: ${JSON.stringify(expectedValue.lt)}, actual: ${JSON.stringify(actualValue)}`,
            );
          }
          if (typeof expectedValue.lt === 'object') {
            expect(actualValue).to.be.below(expectedValue.lt);
          } else {
            expect(actualValue).to.be.lt(expectedValue.lt);
          }
          validated = true;
        }
        if (expectedValue.notEq !== undefined) {
          if (process.env.SHOW_TX_DETAILS === 'true') {
            console.log(
              `🔍 Validating data: ${key}, condition: notEq, expected: ${JSON.stringify(expectedValue.notEq)}, actual: ${JSON.stringify(actualValue)}`,
            );
          }
          if (typeof expectedValue.notEq === 'object') {
            expect(actualValue).to.not.deep.eq(expectedValue.notEq);
          } else {
            expect(actualValue).to.not.eq(expectedValue.notEq);
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
    if (!tx.gas || tx.gas === 'auto') {
      tx.gas = undefined;
      tx.gas = await testManager.web3.eth.estimateGas(tx);
    }

    if (process.env.SHOW_TX_DETAILS === 'true') {
      console.log('⛽️ Transaction Gas:', tx.gas);
    }

    return tx;
  }

  async sendTransaction(tx, testManager, context, notSign, notSend) {
    const account = testManager.web3.eth.accounts.wallet[tx.from];
    if (!account) {
      throw new Error(`Account ${tx.from} not found in web3 wallet`);
    }

    let rawTx, signedTx;
    if (!notSign) {
      signedTx = await account.signTransaction(tx);
      rawTx = signedTx.rawTransaction;
    } else {
      rawTx = '0x' + new EthereumTx(tx).serialize().toString('hex');
    }

    if (process.env.SHOW_TX_DETAILS === 'true') {
      console.log('📒 Transaction Details:', signedTx);
    }

    if (notSend) {
      return { signedTx }
    }

    const receipt = await testManager.web3.eth.sendSignedTransaction(rawTx);

    if (process.env.SHOW_TX_DETAILS === 'true') {
      console.log('🧾 Transaction Receipt:', receipt);
    }

    return { receipt };
  }

  async sendTransactions(from, txs, testManager, context, tps) {
    const account = testManager.web3.eth.accounts.wallet[from];
    if (!account) {
      throw new Error(`Account ${from} not found in web3 wallet`);
    }

    let nonce = await testManager.web3.atl.getTransactionCount(from);
    let fetch = new fetchBlock(testManager);

    let i = 0;
    for (let tx of txs) {
      const startTime = Date.now();
      tx.nonce = nonce++;
      const signedTx = await account.signTransaction(tx);

      if (process.env.SHOW_TX_DETAILS === 'true') {
        console.log('📒 Transaction Details:', signedTx);
      }

      fetch.fetchAdd(signedTx.transactionHash);
      if (process.env.SHOW_TX_DETAILS === 'true') {
        console.log("sending tx, index", i++, "total", txs.length, "hash", signedTx.transactionHash);
      }
      testManager.web3.eth.sendSignedTransaction(signedTx.rawTransaction);

      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, (1000 / tps) - elapsedTime);
      await new Promise(r => setTimeout(r, remainingTime));
    }
    const [receipts, failures] = await fetch.fetchCheck();
    return [receipts, [...failures]];
  }
}


class fetchBlock {
  constructor(testManager) {
    this.sentTransactionHashes = new Set();
    this.failureTransactionHashes = new Set();
    this.receipts = [];
    this.fetching = false;
    this.duration = 500;
    this.testManager = testManager;
  }

  fetchAdd(hash) {
    if (!this.fetching) {
      this.fetching = true;
      this.start();
    }
    this.sentTransactionHashes.add(hash);
  }

  fetchRemove(hash) {
    if (this.sentTransactionHashes.has(hash)) {
      this.sentTransactionHashes.delete(hash);
    }
  }

  async start() {
    try {
      let current = await this.testManager.web3.eth.getBlockNumber();

      while (this.fetching) {
        const latest = await this.testManager.web3.eth.getBlockNumber();
        if (latest == current) {
          await new Promise(r => setTimeout(r, this.duration));
          continue;
        }

        const block = await this.testManager.web3.eth.getBlock(current);
        console.log(`Block Number: ${block.number}, txs: ${block.transactions.length}`);
        for (const tx of block.transactions) {
          const receipt = await this.testManager.web3.eth.getTransactionReceipt(tx);
          if (receipt && receipt.status) {
            this.receipts.push(receipt);
            this.fetchRemove(tx);
          } else {
            this.failureTransactionHashes.add(tx);
          }
        }

        current++;
      }
    } catch (error) {
      console.error('Error fetching blocks:', error);
    }
  }

  async fetchCheck() {
    let i = 0;
    while (true) {
      const sendlen = this.sentTransactionHashes.size;
      const faillen = this.failureTransactionHashes.size;
      if (sendlen > faillen) {
        // if (i % 10 == 0) {
        // console.log(`waitting tx to finish: ${sendlen - faillen}`);
        // }
        i++;
        await new Promise(r => setTimeout(r, 100));
      } else {
        this.stop();
        if (faillen == 0) {
          this.sentTransactionHashes.clear();
          this.failureTransactionHashes.clear();
          // console.log(`all transaction success`);
          return [this.receipts, new Set()];
        } else {
          // console.log("some transaction failed", failureTransactionHashes);
          return [this.receipts, this.failureTransactionHashes];
        }
      }
    }
  }

  stop() {
    if (this.fetching) {
      this.fetching = false;
    }
  }
}
