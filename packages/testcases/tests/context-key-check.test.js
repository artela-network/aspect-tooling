import assert from "assert";
import {
    BindAspect, BoundAddressesOf,
    ContractCall,
    DeployAspect,
    DeployContract, EntryPoint,
    SendTx, SendUnsignedTx
} from "./bese-test.js";

const timeoutError = new Error(`Operation timed out`)


const abiPath = "../build/contract/Context.abi"

const SendUnsignedTxTest = async (contractAddr, key) => {
    try {
        const res = await SendUnsignedTx({
            contract: contractAddr, abiPath, method: "get", args: [key]
        })
        console.log("==== send Unsigned Tx ===", key, res);
        return true
    } catch (err) {
        console.log("==== send Unsigned Tx err ===" + err)
        return false
    }
}

const sendTxTest = async (contractAddr, key) => {
    try {
        const res = await SendTx({
            contract: contractAddr, abiPath, method: "get", args: [key]
        })
        console.log("==== sendTx ===", key, res);
        return true
    } catch (err) {
        console.log("==== sendTx err ===" + err)
        return false
    }
}

const contractCallTest = async (contract, key) => {
    try {
        const res = await ContractCall({
            contract, abiPath, method: "get", args: [key],
        })
        console.log("==== contractCall ===" + key);
        return true
    } catch (err) {
        console.log("==== contractCall err===" + err)
        return false
    }
}

const entryPointTest = async (contract, key) => {
    try {
        await EntryPoint({
            aspectId: contract,
            operationData: key,
        })
        console.log("==== EntryPoint ===" + key);
        return true
    } catch (err) {
        if (err !== timeoutError) {
            console.log("==== contractCall err===" + err)
        }
        return false
    }
}


let result = await DeployContract({
    abiPath: "../build/contract/Context.abi", bytePath: "../build/contract/Context.bin"
})
assert.ok(result.contractAddress, "Deploy Storage Contract fail");

/// Verify check start----------------------------------------------------------------

console.log('======================== Verify Tx Check ========================')

const VerifyCheck = async (contractObj, joinPoint, key) => {
    const result = await SendUnsignedTxTest(contractObj.contractAddress, key)
    assert.ok(!result, `[SendTx: unauthorized access test] Test failed, unauthorized key-value pair was accessed without permission`)
}

const VerifyCheckResult = {
    "joinPoint": "VerifyTx",
    "accessLimitKeys": ["block.header.parentHash", "block.header.miner", "block.header.transactionsRoot", "block.header.timestamp", "tx.chainId", "tx.bytes", "tx.hash", "tx.sig.v", "tx.sig.r", "tx.sig.s", "tx.from", "tx.index", "msg.from", "msg.to", "msg.value", "msg.gas", "msg.input", "msg.index", "msg.result.ret", "msg.result.gasUsed", "msg.result.error", "receipt.status", "receipt.logs", "receipt.gasUsed", "receipt.cumulativeGasUsed", "receipt.bloom"]
}

const aspect = await DeployAspect({
    wasmPath: "../build/context-key-check.wasm", joinPoints: ['VerifyTx'],properties: [
    { 'key': 'Broker', 'value': result.from }],
})
const bindResult = await BindAspect({
    abiPath, contractAddress: result.contractAddress, aspectId: aspect.aspectAddress
})

// bind eoa
const bindResult2 = await BindAspect({
    abiPath, contractAddress: result.from, aspectId: aspect.aspectAddress
})

const boundAddrs = await BoundAddressesOf({aspectId: aspect.aspectAddress})
console.log("==== boundAddrs ===", boundAddrs)
assert.ok(bindResult.status, 'Bind aspect fail')
assert.ok(bindResult2.status, 'Bind aspect fail')

for (var i in VerifyCheckResult.accessLimitKeys) {
    await VerifyCheck(result, VerifyCheckResult.joinPoint, VerifyCheckResult.accessLimitKeys[i])
}
/// Verify check end----------------------------------------------------------------


/// operation check start----------------------------------------------------------------

console.log('======================== Operation Check ========================')

const operationKeys = {
    "joinPoint": "Operation",
    "accessLimitKeys": ["msg.index", "msg.result.ret", "msg.result.gasUsed", "msg.result.error", "receipt.status", "receipt.logs", "receipt.gasUsed", "receipt.cumulativeGasUsed", "receipt.bloom"]
}

function stringToHex(inputString) {
    let hexString = '';
    for (let i = 0; i < inputString.length; i++) {
        const hex = inputString.charCodeAt(i).toString(16);
        hexString += hex.length === 1 ? '0' + hex : hex;
    }
    return hexString;
}

const OperationCheck = async (contractObj, key) => {

    const transactionReceipt = await DeployAspect({
        wasmPath: "../build/context-key-check.wasm"
    })
    const po=await entryPointTest(transactionReceipt.aspectAddress, key)
    assert.ok(!po, `[EntryPointTest] Test failed, key ${key}`)
}
for (var k in operationKeys.accessLimitKeys) {
    const key = stringToHex(operationKeys.accessLimitKeys[k]);
    await OperationCheck(result, '0x' + key)
}
/// operation check end----------------------------------------------------------------

const json = [{
    "joinPoint": "preTxExecute",
    "accessLimitKeys": ["msg.from", "msg.to", "msg.value", "msg.gas", "msg.input", "msg.index", "msg.result.ret", "msg.result.gasUsed", "msg.result.error", "receipt.status", "receipt.logs", "receipt.gasUsed", "receipt.cumulativeGasUsed", "receipt.bloom"]
}, {
    "joinPoint": "postTxExecute",
    "accessLimitKeys": ["msg.from", "msg.to", "msg.value", "msg.gas", "msg.input", "msg.index", "msg.result.ret", "msg.result.gasUsed", "msg.result.error"]
}, {
    "joinPoint": "postContractCall",
    "accessLimitKeys": ["receipt.status", "receipt.logs", "receipt.gasUsed", "receipt.cumulativeGasUsed", "receipt.bloom"]
}, {
    "joinPoint": "preContractCall",
    "accessLimitKeys": ["msg.result.ret", "msg.result.gasUsed", "msg.result.error", "receipt.status", "receipt.logs", "receipt.gasUsed", "receipt.cumulativeGasUsed", "receipt.bloom"]
}];

const JoinPointCheck = async (contractObj, key) => {
    assert.ok(!await sendTxTest(contractObj.contractAddress, key), `[SendTx: unauthorized access test] Test failed, unauthorized key-value pair was accessed without permission`)
    assert.ok(!await contractCallTest(contractObj.contractAddress, key), `[CallTx: unauthorized access test] Test failed, unauthorized key-value pair was accessed without permission`)
}


for (var p in json) {
    console.log(`======================== ${json[p].joinPoint} Check ========================`)
    result = await DeployContract({
        abiPath: "../build/contract/Context.abi", bytePath: "../build/contract/Context.bin"
    })
    assert.ok(result.contractAddress, "Deploy Storage Contract fail");
    const aspect = await DeployAspect({
        wasmPath: "../build/context-key-check.wasm", joinPoints: [json[p].joinPoint]
    })

    const bindResult = await BindAspect({
        abiPath, contractAddress: result.contractAddress, aspectId: aspect.aspectAddress
    })

    assert.ok(bindResult.status, 'Bind aspect fail')

    for (var q in json[p].accessLimitKeys) {
        await JoinPointCheck(result, json[p].accessLimitKeys[q])
    }
}
