import { Action } from './Action.js';

export class CallContractAction extends Action {
  async execute(testManager, context) {
    const { contract, method, args, abi, isCall, gas } = testManager.replaceVariables(
      this.action.options,
      context,
    );

    // Get contract ABI
    const instance = new testManager.web3.eth.Contract(abi, contract);

    const from = this.getAccount(testManager, context);

    if (isCall) {
      // Call contract method
      const result = await instance.methods[method](...args).call({ from });
      return { result: { ret: result } };
    } else {
      // Send transaction
      const tx = {
        from,
        gas,
        to: contract,
        data: instance.methods[method](...args).encodeABI(),
      };

      await this.estimateGas(tx, testManager, context);

      try {
        const { receipt } = await this.sendTransaction(tx, testManager, context);
        return { result: null, receipt, tx };
      } catch (e) {
        const ret = await instance.methods[method](...args).call({ from, gas: tx.gas });
        throw new Error(ret);
      }
    }
  }
}
