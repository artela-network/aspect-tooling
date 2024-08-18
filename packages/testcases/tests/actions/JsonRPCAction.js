import { Action } from './Action.js';
import fetch from 'node-fetch';
import Web3Utils from '@artela/web3-utils';
const numberToHex = Web3Utils.numberToHex;
const hexToNumber = Web3Utils.hexToNumber;

export class JsonRPCAction extends Action {
    async execute1(testManager, context) {
        const { method, params } = testManager.replaceVariables(this.action.options, context);
        const from = this.getAccount(testManager, context);
        const methodParts = method.split('_');

        let rpcMethod = testManager.web3;
        for (const part of methodParts) {
            rpcMethod = rpcMethod[part];
        }

        let data = [];
        if (params && params.length > 0) {
            data = testManager.replaceNestedVariables(params, context);
        }

        const ret = await rpcMethod(...data);
        return {
            result: { ret }
        };
    }

    async execute(testManager, context) {
        const { method, params } = testManager.replaceVariables(this.action.options, context);

        let data = [];
        if (params && params.length > 0) {
            data = testManager.replaceNestedVariables(params, context);

            data = data.map(item => {
                if (typeof item === 'string' && item.startsWith('numberToHex(') && item.endsWith(')')) {
                    const numberStr = item.slice('numberToHex('.length, -1);
                    const number = parseInt(numberStr, 10);

                    return numberToHex(number);
                } else if (typeof item === 'string' && item.startsWith('hexToNumber(') && item.endsWith(')')) {
                    const hexStr = item.slice('numberToHex('.length, -1);

                    return hexToNumber(hexStr);
                }
                return item;
            });
        }

        const payload = {
            jsonrpc: '2.0',
            method: method,
            params: data,
            id: new Date().getTime()
        };


        console.log("calling payload: ", payload)

        try {
            const rpcUrl = testManager.nodeUrl;
            const response = await fetch(rpcUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (data.error) {
                throw new Error(data.error.message);
            }

            return { result: { ret: data.result } };
        } catch (error) {
            console.error('RPC Error:', error);
            throw error;
        }
    }
}
