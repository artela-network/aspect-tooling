import assert from "assert";
import {BindAspect, ContractCall, DeployAspect, DeployContract, EntryPoint, SendTx} from "./bese-test.js";

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
        console.log(err)
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
        console.log(err)
        return true
    }
}
const result = await DeployContract({
    abiPath: "../build/contract/Storage.abi", bytePath: "../build/contract/Storage.bin"
})
assert.ok(result.contractAddress, "Deploy Storage Contract fail");
const aspect = await DeployAspect({
    wasmPath: "../build/context-permission-check.wasm",
    joinPoints: ["PreTxExecute", "PostTxExecute", "PreContractCall", "PostContractCall", "VerifyTx"],
})

const bindResult = await BindAspect({
    abiPath: "../build/contract/Storage.abi",
    contractAddress: result.contractAddress,
    aspectId: aspect.aspectAddress
})
assert.ok(bindResult.status, 'Bind aspect fail')

assert.ok(!(await sendTxTest(result.contractAddress)), `[SendTx: normal test] Failed, key-value can't be accessed`)

assert.ok(!(await contractCallTest(result.contractAddress)), `[ContractCall: normal test] Failed, key-value can't be accessed`)

const entryPointTest = async (contract, key) => {
    try {
        await EntryPoint({
            aspectId: contract,
            operationData: key,
        })
        console.log("==== EntryPoint ===" + key);
        return true
    } catch (err) {
        console.log("==== EntryPoint err===" + err)
        return false
    }
}
assert.ok(!(await entryPointTest(aspect.aspectAddress,"0x01")), `[entryPoint: normal test] Failed, key-value can't be accessed`)
