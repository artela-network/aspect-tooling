import { Action } from './Action.js';

export class UpgradeAspectAction extends Action {
  async execute(testManager, context) {
    const { aspect, args, gas } = testManager.replaceVariables(this.action.options, context);
    const from = this.getAccount(testManager, context);

    const instance = new testManager.web3.atl.Aspect(aspect);
    const upgrade = await instance.upgrade({
      data: args.code,
      joinPoints: args.joinPoints || [],
      properties: args.properties || [],
    });

    const tx = {
      from,
      gas,
      data: upgrade.encodeABI(),
      to: testManager.ARTELA_ADDRESS,
    };

    await this.estimateGas(tx, testManager, context);
    const { receipt } = await this.sendTransaction(tx, testManager, context);

    return { result: null, receipt, tx };
  }
}
