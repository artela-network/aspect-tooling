import assert from "assert";
import { BindAspect, ContractCall, DeployAspect, DeployContract, SendTx } from "./bese-test.js";

const timeoutError = new Error(`Operation timed out`)
function newTimeoutPromise(timeoutMs) {
    return new Promise((resolve, reject) => {
        let timeoutId = setTimeout(() => {
            clearTimeout(timeoutId);
            reject(timeoutError);
        }, timeoutMs);
    })
}

const abiPath = "../build/contract/Storage.abi"

const sendTxTest = async (contract) => {
    try {
        const res = await Promise.race([
            newTimeoutPromise(30000),
            SendTx({
                contract,
                abiPath,
                method: "store",
                args: [100]
            })
        ])
        console.log("==== sendTx ===", res);
        return false
    } catch (err) {
        if (err !== timeoutError) {
            console.log(err)
        }
        return true
    }
}

const contractCallTest = async (contract) => {
    try {
        const res = await Promise.race([
            newTimeoutPromise(30000),
            ContractCall({
                contract,
                abiPath,
                method: "retrieve",
            })
        ])
        console.log("==== contractCall ===" + res);
        return false
    } catch (err) {
        if (err !== timeoutError) {
            console.log(err)
        }
        return true
    }
}

const deployAndBind = async (contractObj, unauthTest = false, joinPointForTest = '') => {
    const textEncoder = new TextEncoder()
    const aspect = await DeployAspect({
        wasmPath: "../build/context-permission-check.wasm",
        joinPoints: ["PreTxExecute", "PostTxExecute", "PreContractCall", "PostContractCall"],
        properties: [
            { 'key': 'ScheduleTo', 'value': contractObj.contractAddress },
            { 'key': 'Broker', 'value': contractObj.from },
            { 'key': 'binding', 'value': contractObj.contractAddress },
            { 'key': 'owner', 'value': contractObj.from },

            { 'key': 'unauthorized_test', 'value': textEncoder.encode(`${unauthTest}`) },
            { 'key': 'join_point_for_test', 'value': textEncoder.encode(joinPointForTest) }
        ],
    })
    assert.ok(aspect.aspectAddress, "Deploy aspect fail");

    const bindResult = await BindAspect({
        abiPath: "../build/contract/Storage.abi",
        contractAddress: contractObj.contractAddress,
        aspectId: aspect.aspectAddress
    })
    assert.ok(bindResult.status, 'Bind aspect fail')
}

const result = await DeployContract({
    abiPath: "../build/contract/Storage.abi", bytePath: "../build/contract/Storage.bin"
})
assert.ok(result.contractAddress, "Deploy Storage Contract fail");
console.log("==deploy  Storage Contract Result== ", result)

await deployAndBind(result)

assert.ok(!(await sendTxTest(result.contractAddress)), `[SendTx: normal test] Failed, key-value can't be accessed`)
console.log('[SendTx: normal test] Success')

assert.ok(!(await contractCallTest(result.contractAddress)), `[ContractCall: normal test] Failed, key-value can't be accessed`)
console.log('[ContractCall: normal test] Success')

await deployAndBind(result, true, `all`)

assert.ok(await sendTxTest(result.contractAddress), `[SendTx: unauthorized access test] Test failed, unauthorized key-value pair was accessed without permission`)
console.log('[SendTx: unauthorized access test] Success')

// assert.ok(await contractCallTest(result.contractAddress), '[ContractCall: unauthorized access test] Test failed, unauthorized key-value pair was accessed without permission')
// console.log('[ContractCall: unauthorized access test] Success')

// process.exit()