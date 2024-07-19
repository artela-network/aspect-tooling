import { Action } from './Action.js';

export class UnbindAspectAction extends Action {
  async execute(testManager, context) {
    const { account, aspect, gas } = testManager.replaceVariables(this.action.options, context);
    const from = this.getAccount(testManager, context);
    const aspectCore = new testManager.web3.atl.aspectCore();
    const unbind = aspectCore.methods.unbind(aspect, account);

    const tx = {
      gas,
      from,
      to: testManager.ARTELA_ADDRESS,
      data: unbind.encodeABI(),
    };

    await this.estimateGas(tx, testManager, context);
    const { receipt } = await this.sendTransaction(tx, testManager, context);
    return { result: null, receipt, tx };
  }
}
