import { Action } from './Action.js';

export class DeployContractAction extends Action {
    async execute(testManager, context) {
        const { code, args, gas, abi } = testManager.replaceVariables(this.action.options, context);
        const from = this.getAccount(testManager, context);

        const contract = new testManager.web3.eth.Contract(abi);

        const deploy = contract.deploy({ data: code, arguments: args });

        const tx = {
            from,
            data: deploy.encodeABI(),
            gas,
        };

        await this.estimateGas(tx, testManager, context);
        const { receipt } = await this.sendTransaction(tx, testManager, context);

        return { result: { contractAddress: receipt.contractAddress }, receipt, tx };
    }
}
