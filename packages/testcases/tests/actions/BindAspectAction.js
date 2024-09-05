import { Action } from './Action.js';

export class BindAspectAction extends Action {
    async execute(testManager, context) {
        const { account, aspect, priority, version, gas, isEOA } = testManager.replaceVariables(this.action.options, context);
        const from = this.getAccount(testManager, context);

        let encodedABI;
        if (isEOA) {
            const aspectCore = testManager.web3.atl.aspectCore();
            const eoaBinding = await aspectCore.methods.bind(aspect, priority, account, version);
            encodedABI = eoaBinding.encodeABI();
        } else {
            const instance = new testManager.web3.eth.Contract([], account);
            const bind = instance.bind({ aspectId: aspect, priority, aspectVersion: version });
            encodedABI = bind.encodeABI();
        }

        const tx = {
            gas,
            from,
            to: testManager.ARTELA_ADDRESS,
            data: encodedABI,
        };

        await this.estimateGas(tx, testManager, context);
        const { receipt } = await this.sendTransaction(tx, testManager, context);

        return { result: null, receipt, tx };
    }
}
