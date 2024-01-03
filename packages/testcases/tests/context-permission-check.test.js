import assert from "assert";
import { BindAspect, ContractCall, DeployAspect, DeployContract, SendTx } from "./bese-test.js";

function newTimeoutPromise(timeoutMs) {
    return new Promise((resolve, reject) => {
        let timeoutId = setTimeout(() => {
            clearTimeout(timeoutId);
            reject(new Error(`Operation timed out: ${timeoutMs}ms`));
        }, timeoutMs);
    })
}

const result = await DeployContract({
    abiPath: "../build/contract/Storage.abi", bytePath: "../build/contract/Storage.bin"
})
assert.ok(result.contractAddress, "Deploy Storage Contract fail");
console.log("==deploy  Storage Contract Result== ", result)

const textEncoder = new TextEncoder()

const aspect = await DeployAspect({
    wasmPath: "../build/context-permission-check.wasm",
    joinPoints: ["PreTxExecute", "PostTxExecute", "PreContractCall", "PostContractCall"],
    properties: [{ 'key': 'ScheduleTo', 'value': result.contractAddress },
    { 'key': 'Broker', 'value': result.from },
    { 'key': 'binding', 'value': result.contractAddress },
    { 'key': 'owner', 'value': result.from },
    { 'key': 'permission_fault_test', 'value': textEncoder.encode('false') }],
})
assert.ok(aspect.aspectAddress, "Deploy storage-aspect  fail");

console.log("==deploy Aspect Result== ", aspect)

const bindResult = await BindAspect({
    abiPath: "../build/contract/Storage.abi",
    contractAddress: result.contractAddress,
    aspectId: aspect.aspectAddress,
})
console.log("==bind Aspect Result== ", bindResult)

const storeVal = await SendTx({
    contract: result.contractAddress,
    abiPath: "../build/contract/Storage.abi",
    method: "store",
    args: [100]
});

console.log("==== storeVal===", storeVal);


const callVal = await ContractCall({
    contract: result.contractAddress,
    abiPath: "../build/contract/Storage.abi",
    method: "retrieve"
});
console.log("==== reuslt===" + callVal);
assert.strictEqual(callVal, "100", "Contract Call result fail")

const aspect2 = await DeployAspect({
    wasmPath: "../build/context-permission-check.wasm",
    joinPoints: ["PreTxExecute", "PostTxExecute", "PreContractCall", "PostContractCall"],
    properties: [{ 'key': 'ScheduleTo', 'value': result.contractAddress },
    { 'key': 'Broker', 'value': result.from },
    { 'key': 'binding', 'value': result.contractAddress },
    { 'key': 'owner', 'value': result.from },
    { 'key': 'permission_fault_test', 'value': textEncoder.encode('true') }],
})
assert.ok(aspect2.aspectAddress, "Deploy storage-aspect  fail");

const bindResult2 = await BindAspect({
    abiPath: "../build/contract/Storage.abi",
    contractAddress: result.contractAddress,
    aspectId: aspect2.aspectAddress,
})
console.log("==bind Aspect Result 2== ", bindResult2)

let permFaultTestSuccess = false
try {
    const storeVal2 = await Promise.race([
        newTimeoutPromise(3000),
        SendTx({
            contract: result.contractAddress,
            abiPath: "../build/contract/Storage.abi",
            method: "store",
            args: [100]
        })
    ])
    console.log("==== storeVal 2 ===", storeVal2);
} catch (err) {
    permFaultTestSuccess = true
}
assert.ok(permFaultTestSuccess, '[SendTx] Test failed, unauthorized key-value pair was accessed without permission')

permFaultTestSuccess = false
try {
    const callVal2 = await Promise.race([
        ContractCall({
            contract: result.contractAddress,
            abiPath: "../build/contract/Storage.abi",
            method: "retrieve",
        }),
        newTimeoutPromise(10000)
    ])
    console.log("==== reuslt 2 ===" + callVal2);
    assert.strictEqual(callVal2, "200", "Contract Call result fail")
} catch (err) {
    permFaultTestSuccess = true
}
assert.ok(permFaultTestSuccess, '[ContractCall] Test failed, unauthorized key-value pair was accessed without permission')
