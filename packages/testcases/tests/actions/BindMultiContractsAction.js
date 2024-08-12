import { Action } from './Action.js';

export class BindMultiContractsAction extends Action {
    async execute(testManager, context) {
        const { accounts, aspect, priority, version, gas, count } = testManager.replaceVariables(this.action.options, context);
        const from = this.getAccount(testManager, context);

        if (accounts.length < count) {
            throw new Error("deployed contracts are not enough for binding, expect " + count.toString() + ", got " + accounts.length.toString());
        }

        let txs = [];
        for (let i = 0; i < count; i++) {
            const instance = new testManager.web3.eth.Contract([], accounts[i]);

            const bind = instance.bind({ aspectId: aspect, priority, aspectVersion: version });

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
