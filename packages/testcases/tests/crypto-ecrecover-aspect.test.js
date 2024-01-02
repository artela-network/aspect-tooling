import {ConnectToANode, DeployAspect, EntryPoint} from "./bese-test.js";

import assert from "assert";
import fs from "fs";
import BigNumber from "bignumber.js";

function rmPrefix(data) {
    if (data.startsWith('0x')) {
        return data.substring(2, data.length);
    } else {
        return data;
    }
}

function getOriginalV(hexV, chainId_) {
    const v = new BigNumber(hexV, 16);
    const chainId = new BigNumber(chainId_);
    const chainIdMul = chainId.multipliedBy(2);

    const originalV = v.minus(chainIdMul).minus(8);

    const originalVHex = originalV.toString(16);

    return originalVHex;
}

function padStart(str, targetLength, padString) {
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

const aspect = await DeployAspect({
    wasmPath: "../build/crypto-ecrecover-aspect.wasm",
})

console.log("==deploy Aspect Result== ", aspect)
assert.ok(aspect.aspectAddress, "deploy Aspect fail")


const web3 = ConnectToANode();
let chainId = await web3.eth.getChainId();

const abiTxt = fs.readFileSync("../build/contract/Storage.abi", "utf-8").toString().trim();
const contractAbi = JSON.parse(abiTxt);

// instantiate an instance of demo contract
const contract = new web3.eth.Contract(contractAbi);

// deploy token contract
const pk = fs.readFileSync("../privateKey.txt", 'utf-8');
const account = web3.eth.accounts.privateKeyToAccount(pk.trim());
web3.eth.accounts.wallet.add(account.privateKey);

const encodeABI = contract.methods.store([100]).encodeABI();

const tokenTx = {
    from: account.address,
    data: encodeABI,
    to: aspect.aspectAddress,
    nonce: 1,
    gas:1000000,
}
const signedTx = await web3.eth.accounts.signTransaction(tokenTx, account.privateKey);

console.log("sign tx : ", signedTx);
// params encode rules:
//     20 bytes: from
//         eg. e2f8857467b61f2e4b1a614a0d560cd75c0c076f
//     32 bytes: r
//     32 bytes: s
//     1 bytes: v
const mainKey = rmPrefix(account.address);
const validationData = "0x"
    + mainKey
    + padStart(rmPrefix(signedTx.r), 64, "0")
    + padStart(rmPrefix(signedTx.s), 64, "0")
    + rmPrefix(getOriginalV(signedTx.v, chainId));

const rawcall = await EntryPoint({
    aspectId: aspect.aspectAddress,
    operationData: validationData
})

console.log(rawcall)