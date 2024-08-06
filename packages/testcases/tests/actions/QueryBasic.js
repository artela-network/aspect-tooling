import { Action } from './Action.js';

export class QueryBasicAction extends Action {
    async execute(testManager, context) {
        const { accountQ, contractQ } = testManager.replaceVariables(this.action.options, context);
        const from = this.getAccount(testManager, context);

        const nonce = await testManager.web3.atl.getTransactionCount(from);
        const balance = await testManager.web3.atl.getBalance(from);

        return { result: { nonce: "0x" + this.addLeadingZeroIfNeeded(nonce.toString(16)), balance: "0x" + this.addLeadingZeroIfNeeded(BigInt(balance).toString(16)), sender: from } };
    }

    addLeadingZeroIfNeeded(hexString) {
        if (hexString.length % 2 !== 0) {
            hexString = '0' + hexString;
        }
        return hexString;
    }
}
