import { Action } from './Action.js';

export class QueryBasicAction extends Action {
    async execute(testManager, context) {
        const { queryAccount, queryContract } = testManager.replaceVariables(this.action.options, context);
        const from = this.getAccount(testManager, context);

        const nonceFrom = await testManager.web3.atl.getTransactionCount(from);
        const balanceFrom = await testManager.web3.atl.getBalance(from);
        const balance = await testManager.web3.atl.getBalance(queryAccount);

        return {
            result: {
                nonceFrom: "0x" + this.addLeadingZeroIfNeeded(nonceFrom.toString(16)),
                balanceFrom: "0x" + this.addLeadingZeroIfNeeded(BigInt(balanceFrom).toString(16)),
                sender: from,
                balance: balance,
            }
        };
    }

    addLeadingZeroIfNeeded(hexString) {
        if (hexString.length % 2 !== 0) {
            hexString = '0' + hexString;
        }
        return hexString;
    }
}
