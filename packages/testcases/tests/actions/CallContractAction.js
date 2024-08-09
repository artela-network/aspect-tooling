import { Action } from './Action.js';
import Web3Utils from '@artela/web3-utils';
const numberToHex = Web3Utils.numberToHex;

export class CallContractAction extends Action {
  async execute(testManager, context) {
    const {
      contract, method, args, abi, isCall, gas, value,
      data, maxFeePerGasGwei, maxPriorityFeePerGasGwei, accessList,
      notSign, nonce, notSend
    } = testManager.replaceVariables(
      this.action.options,
      context,
    );

    // accessList is a formatted json string, replace the variable inline
    const access = testManager.replaceNestedVariables(accessList, context);

    // Get contract ABI
    const instance = new testManager.web3.eth.Contract(abi, contract);

    const from = this.getAccount(testManager, context);

    if (isCall) {
      // Call contract method
      const result = await instance.methods[method](...args).call({ from });
      return { result: { ret: result } };
    } else {
      let callData = data;
      if (!data || data.length == 0) {
        callData = instance.methods[method](...args).encodeABI()
      }
      // Send transaction

      let tx;
      if (!notSign) {
        tx = {
          from,
          gas,
          to: contract,
          data: callData,
        }

        if (nonce) {
          tx.nonce = parseFloat(nonce);
        }
      } else {
        const gasPrice = await testManager.web3.eth.getGasPrice();
        const chainId = await testManager.web3.eth.getChainId();

        tx = {
          from,
          gas: numberToHex(gas),
          to: contract,
          data: callData,
          gasPrice: numberToHex(gasPrice),
          chainId: numberToHex(chainId),
        }

        if (nonce) {
          tx.nonce = numberToHex(parseFloat(nonce));
        }
      }

      if (accessList && accessList.trim() != "") {
        tx.accessList = JSON.parse(access);
      }

      if (parseFloat(maxPriorityFeePerGasGwei) > 0 && parseFloat(maxFeePerGasGwei) > 0) {
        tx.maxFeePerGas = testManager.web3.utils.toWei(maxFeePerGasGwei, 'gwei');
        tx.maxPriorityFeePerGas = testManager.web3.utils.toWei(maxPriorityFeePerGasGwei, 'gwei');
      }

      if (parseFloat(value) > 0) {
        tx.value = testManager.web3.utils.toWei(value.toString(), 'ether');
      }

      await this.estimateGas(tx, testManager, context);

      try {
        const { signedTx, receipt } = await this.sendTransaction(tx, testManager, context, notSign, notSend);
        return { result: { signedTx }, receipt, tx };
      } catch (e) {
        console.log("sendTransaction error", e)
        const ret = await instance.methods[method](...args).call({ from, gas: tx.gas });
        throw new Error(ret);
      }
    }
  }
}
