import { Action } from './Action.js';

export class BindMultiAspectsAction extends Action {
    async execute(testManager, context) {
        const { account, aspects, priority, version, gas, count } = testManager.replaceVariables(this.action.options, context);
        const from = this.getAccount(testManager, context);

        const instance = new testManager.web3.eth.Contract([], account);

        if (aspects.length < count) {
            throw new Error("deployed aspect is not enough for binding");
        }

        let txs = [];
        for (let i = 0; i < count; i++) {
            const bind = instance.bind({ aspectId: aspects[i], priority, aspectVersion: version });

            const tx = {
                gas,
                from,
                to: testManager.ARTELA_ADDRESS,
                data: bind.encodeABI()
            };

            await this.estimateGas(tx, testManager, context);
            txs.push(tx);
        }
        const [receipts, failures] = await this.sendTransactions(from, txs, testManager, context);
        return { result: { receipts, failures }, receipt: null, tx: null };
    }
}
