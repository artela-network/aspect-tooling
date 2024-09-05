import { Action } from './Action.js';

export class DeployMultiAspectsAction extends Action {
  async execute(testManager, context) {
    const { args, gas, count } = testManager.replaceVariables(this.action.options, context);
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

    let txs = [];
    for (let i = 0; i < count; i++) {
      const tx = {
        from,
        gas,
        data: deploy.encodeABI(),
        to: testManager.ARTELA_ADDRESS,
      };

      await this.estimateGas(tx, testManager, context);
      txs.push(tx);
    }

    const [receipts, failures] = await this.sendTransactions(from, txs, testManager, context, 20);
    const ids = [];
    for (const receipt of receipts) {
      ids.push(receipt.contractAddress);
    }
    return { result: { ids, failures }, receipt: null, tx: null };
  }
}
