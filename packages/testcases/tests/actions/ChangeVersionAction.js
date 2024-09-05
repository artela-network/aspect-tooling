import { Action } from './Action.js';

export class ChangeVersionAction extends Action {
  async execute(testManager, context) {
    const { account, aspect, version, gas } = testManager.replaceVariables(this.action.options, context);
    const from = this.getAccount(testManager, context);
    const aspectCore = new testManager.web3.atl.aspectCore();
    const changeVersion = aspectCore.methods.changeVersion(aspect, account, version);

    const tx = {
      gas,
      from,
      to: testManager.ARTELA_ADDRESS,
      data: changeVersion.encodeABI(),
    };

    await this.estimateGas(tx, testManager, context);
    const { receipt } = await this.sendTransaction(tx, testManager, context);
    return { result: null, receipt, tx };
  }
}
