import assert from "assert";
import yargs from "yargs";
import { BindAspect, ContractCall, DeployAspect, DeployContract, SendTx } from "./bese-test.js";

const argv = yargs().string('phase').string('ignoreKey').argv

let phase
switch (argv.phase) {
    case "verifyTx": phase = argv.phase; break
    case "preTxExecute": phase = argv.phase; break
    case "postTxExecute": phase = argv.phase; break
    case "postContractCall": phase = argv.phase; break
    case "preContractCall": phase = argv.phase; break
    default: phase = 'all'; break
}

let ignoreKey = ''
if (argv.ignoreKey != "undefined") {
    ignoreKey = argv.ignoreKey
}

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
        // if (err !== timeoutError) {
        //     console.log(err)
        // }
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
        // if (err !== timeoutError) {
        //     console.log(err)
        // }
        return true
    }
}

const deployAndBind = async (contractObj, ignoreKey = '') => {
    const textEncoder = new TextEncoder()
    const aspect = await DeployAspect({
        wasmPath: "../build/context-permission-check.wasm",
        joinPoints: ["PreTxExecute", "PostTxExecute", "PreContractCall", "PostContractCall"],
        properties: [{ 'key': 'ScheduleTo', 'value': contractObj.contractAddress },
        { 'key': 'Broker', 'value': contractObj.from },
        { 'key': 'binding', 'value': contractObj.contractAddress },
        { 'key': 'owner', 'value': contractObj.from },
        { 'key': 'ignoreKey', 'value': textEncoder.encode(ignoreKey) }],
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

await deployAndBind(result, `all|`)

assert.ok(!(await sendTxTest(result.contractAddress)), `[SendTx:  base test] Failed, key-value can't be accessed`)
console.log('[SendTx: base test] Success')

assert.ok(!(await contractCallTest(result.contractAddress)), `[ContractCall:  base test] Failed, key-value can't be accessed`)
console.log('[ContractCall: base test] Success')

await deployAndBind(result, `${phase}|${ignoreKey}`)

assert.ok(await sendTxTest(result.contractAddress), `[SendTx: permTest] Test failed, unauthorized key-value pair was accessed without permission`)
console.log('[SendTx: perm test] Success')

assert.ok(await contractCallTest(result.contractAddress), '[ContractCall: permTest] Test failed, unauthorized key-value pair was accessed without permission')
console.log('[ContractCall: perm test] Success')

process.exit()