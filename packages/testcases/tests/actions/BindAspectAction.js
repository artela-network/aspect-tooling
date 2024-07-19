import { Action } from './Action.js';

export class BindAspectAction extends Action {
    async execute(testManager, context) {
        const { account, aspect, priority, version, gas } = testManager.replaceVariables(this.action.options, context);
        const from = this.getAccount(testManager, context);

        const instance = new testManager.web3.eth.Contract([], account);

        const bind = instance.bind({ aspectId: aspect, priority, aspectVersion: version });

        const tx = {
            gas,
            from,
            to: testManager.ARTELA_ADDRESS,
            data: bind.encodeABI(),
        };

        await this.estimateGas(tx, testManager, context);
        const { receipt } = await this.sendTransaction(tx, testManager, context);

        return { result: null, receipt, tx };
    }
}
