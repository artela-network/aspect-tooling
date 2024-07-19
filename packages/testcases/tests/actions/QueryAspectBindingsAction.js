import { Action } from './Action.js';

export class QueryAspectBindingsAction extends Action {
    async execute(testManager, context) {
        const { aspect } = testManager.replaceVariables(this.action.options, context);

        const from = this.getAccount(testManager, context);
        const aspectCore = new testManager.web3.atl.aspectCore();
        let contracts = await aspectCore.methods.boundAddressesOf(aspect).call({ from })

        return { result : { contracts }, receipt: null, tx: null };
    }
}
