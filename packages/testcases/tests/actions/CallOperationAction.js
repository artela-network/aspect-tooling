import { Action } from './Action.js';

export class CallOperationAction extends Action {
    async execute(testManager, context) {
        const { aspectID, operationData, isCall, gas } = testManager.replaceVariables(
            this.action.options,
            context,
        );

        const regex = /\$[a-zA-Z0-9_]+/g;
        const data = operationData.replace(regex, (match) => {
            const key = match.slice(1);
            const value = testManager.replaceVariables(
                '$' + key,
                context,
            );
            if (value.startsWith('0x')) {
                return value.slice(2);
            }
            return value;
        });

        const aspectInstance = new testManager.web3.atl.Aspect(aspectID);
        const operation = aspectInstance.operation(data);

        const from = this.getAccount(testManager, context);

        if (isCall) {
            // Call Operation
            const result = await testManager.web3.eth.call({
                to: testManager.ARTELA_ADDRESS, // contract address
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
