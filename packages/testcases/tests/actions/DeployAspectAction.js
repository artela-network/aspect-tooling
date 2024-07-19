import { Action } from './Action.js';

export class DeployAspectAction extends Action {
  async execute(testManager, context) {
    const { args, gas } = testManager.replaceVariables(this.action.options, context);
    const from = this.getAccount(testManager, context);

    const aspect = new testManager.web3.atl.Aspect();
    const deploy = await aspect.deploy({
      data: args.code,
      paymaster: args.paymaster || from,
      initData: args.initData || '0x',
      proof: args.proof || '0x',
      joinPoints: args.joinPoints || [],
      properties: args.properties || [],
    });

    const tx = {
      from,
      gas,
      data: deploy.encodeABI(),
      to: testManager.ARTELA_ADDRESS,
    };

    await this.estimateGas(tx, testManager, context);
    const { receipt } = await this.sendTransaction(tx, testManager, context);

    return { result: { aspectId: receipt.aspectAddress }, receipt, tx };
  }
}
