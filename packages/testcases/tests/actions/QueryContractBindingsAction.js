import { Action } from './Action.js';

export class QueryContractBindingsAction extends Action {
    async execute(testManager, context) {
        const { contract } = testManager.replaceVariables(this.action.options, context);
        const from = this.getAccount(testManager, context);
        const aspectCore = new testManager.web3.atl.aspectCore();
        let bindingResult = await aspectCore.methods.aspectsOf(contract).call({ from })
        let aspects = [];
        for (const aspect of bindingResult) {
            aspects.push({
                aspectId: aspect.aspectId,
                priority: aspect.priority,
                version: aspect.version
            });
        }

        return { result: { aspects }, receipt: null, tx: null };
    }
}
