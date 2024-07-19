import { Action } from './Action.js';

export class AspectVersionAction extends Action {
    async execute(testManager, context) {
        const { aspect } = testManager.replaceVariables(this.action.options, context);
        const aspectCore = testManager.web3.atl.aspectCore();

        const from = this.getAccount(testManager, context);

        const versionResult = await aspectCore.methods.versionOf(aspect).call({ from });

        return { result: { version: versionResult } };
    }
}
