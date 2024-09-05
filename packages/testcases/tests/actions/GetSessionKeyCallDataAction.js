import { Action } from './Action.js';
import { BigNumber } from 'bignumber.js';

export class GetSessionKeyCallDataAction extends Action {
    async execute(testManager, context) {
        const { sKeyAddress, abi, contract, method, args, aspectID, signedTx, operation } = testManager.replaceVariables(this.action.options, context);

        const from = this.getAccount(testManager, context);

        const sKey = this.rmPrefix(sKeyAddress);
        const sKeyContract = this.rmPrefix(contract);

        const instance = new testManager.web3.eth.Contract(abi, contract);
        const contractCall = instance.methods[method](...args);
        const contractCallData = contractCall.encodeABI();
        const contractCallMethod = this.rmPrefix(contractCallData).substring(0, 8);

        if (operation == "reg") {
            const currentBlockHeight = await testManager.web3.eth.getBlockNumber();
            const expireBlockHeight = currentBlockHeight + 100; // ~10s

            const op =
                "0x0001"
                + sKey
                + sKeyContract
                + "0001" + contractCallMethod
                + this.rmPrefix(testManager.web3.eth.abi.encodeParameter('uint256', expireBlockHeight)).slice(48, 64);

            const aspectInstance = new testManager.web3.atl.Aspect(aspectID);
            const sessionKeyRegData = aspectInstance.operation(op).encodeABI();

            return {
                result: { sessionKeyRegData: sessionKeyRegData }
            };
        } else if (operation == "call") {
            const chainID = await testManager.web3.eth.getChainId();
            let validationData = "0x"
                + this.rmPrefix(from)
                + this.padStart(this.rmPrefix(signedTx.r), 64, "0")
                + this.padStart(this.rmPrefix(signedTx.s), 64, "0")
                + this.rmPrefix(this.getOriginalV(signedTx.v, chainID));

            console.log("validationData : ", validationData);
            console.log("contractCallData : ", contractCallData);
            let encodedData = testManager.web3.eth.abi.encodeParameters(['bytes', 'bytes'],
                [validationData, contractCallData]);

            // new calldata: magic prefix + checksum(encodedData) + encodedData(validation data + raw calldata)
            // 0xCAFECAFE is a magic prefix,
            encodedData = '0xCAFECAFE' + testManager.web3.utils.keccak256(encodedData).slice(2, 10) + encodedData.slice(2);
            console.log("encodedData : ", encodedData);

            return {
                result: { callData: encodedData }
            };
        }
    }

    rmPrefix(data) {
        if (data.startsWith('0x')) {
            return data.substring(2, data.length);
        } else {
            return data;
        }
    }

    padStart(str, targetLength, padString) {
        targetLength = Math.max(targetLength, str.length);
        padString = String(padString || ' ');

        if (str.length >= targetLength) {
            return str;
        } else {
            targetLength = targetLength - str.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength / padString.length);
            }
            return padString.slice(0, targetLength) + str;
        }
    }

    getOriginalV(hexV, chainId_) {
        const v = new BigNumber(hexV, 16);
        const chainId = new BigNumber(chainId_);
        const chainIdMul = chainId.multipliedBy(2);

        const originalV = v.minus(chainIdMul).minus(8);

        const originalVHex = originalV.toString(16);

        return originalVHex;
    }
}
