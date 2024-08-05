import { Action } from './Action.js';

export class TransferAction extends Action {
    async execute(testManager, context) {
        const { amount, to } = testManager.replaceVariables(this.action.options, context);
        const from = this.getAccount(testManager, context);
        const tx = {
            from,
            to: to,
            value: testManager.web3.utils.toWei(amount.toString(), 'ether'),
            gas: 'auto',
        };

        await this.estimateGas(tx, testManager, context);
        const { receipt } = await this.sendTransaction(tx, testManager, context);

        return { result: null, receipt, tx };
    }
}
