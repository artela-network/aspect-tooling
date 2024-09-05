import { Action } from './Action.js';

export class CallOperationAction extends Action {
    async execute(testManager, context) {
        const { aspectID, operationData, isCall, gas, callData } = testManager.replaceVariables(
            this.action.options,
            context,
        );

        const data = testManager.replaceNestedVariables(operationData, context, '0x');

        const aspectInstance = new testManager.web3.atl.Aspect(aspectID);
        let operationEncoded;
        if (callData) {
            operationEncoded = callData;
        } else {
            operationEncoded = aspectInstance.operation(data).encodeABI();
        }

        const from = this.getAccount(testManager, context);

        if (isCall) {
            // Call Operation
            const result = await testManager.web3.eth.call({
                to: testManager.ARTELA_ADDRESS, // contract address
                data: operationEncoded
            });
            return { result: { ret: result } };
        } else {
            const tx = {
                from,
                to: testManager.ARTELA_ADDRESS,
                gas,
                data: operationEncoded,
            };

            await this.estimateGas(tx, testManager, context);

            try {
                const { receipt } = await this.sendTransaction(tx, testManager, context);
                return { result: null, receipt, tx };
            } catch (e) {
                const ret = await testManager.web3.eth.call({
                    from,
                    to: testManager.ARTELA_ADDRESS,
                    data: operationEncoded
                });
                throw new Error(ret);
            }
        }
    }

    extractAllPlaceholders(str) {
        const regex = /\$([a-zA-Z0-9_]+)/g;
        let matches;
        const results = [];

        while ((matches = regex.exec(str)) !== null) {
            results.push(matches[1]);
        }

        return results;
    }
}
