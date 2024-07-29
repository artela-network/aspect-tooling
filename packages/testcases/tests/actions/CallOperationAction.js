import { Action } from './Action.js';

export class CallOperationAction extends Action {
    async execute(testManager, context) {
        const { aspectID, operationData, isCall, gas } = testManager.replaceVariables(
            this.action.options,
            context,
        );

        const aspectInstance = new testManager.web3.atl.Aspect(aspectID);
        const operation = aspectInstance.operation(operationData);

        const from = this.getAccount(testManager, context);

        if (isCall) {
            // Call Operation
            const result = await testManager.web3.eth.call({
                to: ASPECT_ADDR, // contract address
                data: operation.encodeABI()
            });
            return { result: { ret: result } };
        } else {
            const tx = {
                from,
                to: testManager.ARTELA_ADDRESS,
                gas,
                data: operation.encodeABI(),
            };

            await this.estimateGas(tx, testManager, context);

            try {
                const { receipt } = await this.sendTransaction(tx, testManager, context);
                return { result: null, receipt, tx };
            } catch (e) {
                const ret = await testManager.web3.eth.call({
                    to: testManager.ARTELA_ADDRESS,
                    data: operation.encodeABI()
                });
                throw new Error(ret);
            }
        }
    }
}
