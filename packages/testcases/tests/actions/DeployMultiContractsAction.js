import { Action } from './Action.js';

export class DeployMultiContractsAction extends Action {
    async execute(testManager, context) {
        const { code, args, gas, abi, count } = testManager.replaceVariables(this.action.options, context);
        const from = this.getAccount(testManager, context);

        const contract = new testManager.web3.eth.Contract(abi);

        const deploy = contract.deploy({ data: code, arguments: args });

        let txs = [];
        for (let i = 0; i < count; i++) {
            const tx = {
                from,
                data: deploy.encodeABI(),
                gas,
            };

            await this.estimateGas(tx, testManager, context);
            txs.push(tx);
        }
        const [receipts, failures] = await this.sendTransactions(from, txs, testManager, context, 20);

        const addrs = [];
        for (const receipt of receipts) {
            addrs.push(receipt.contractAddress);
        }
        return { result: { addrs, failures }, receipt: null, tx: null };
    }
}
