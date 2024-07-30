import assert from "assert";
import { TextEncoder } from "util";
import { BindAspect, ContractCall, DeployAspect, DeployContract, SendTx } from "./bese-test.js";

const result = await DeployContract({
    abiPath: "../build/contract/Storage.abi", bytePath: "../build/contract/Storage.bin"
})
assert.ok(result.contractAddress, "Deploy Storage Contract fail");
console.log("==deploy  Storage Contract Result== ", result)
//
// let dcResult = await DeployContract({
//     abiPath: "../build/contract/ScheduleTarget.abi", bytePath: "../build/contract/ScheduleTarget.bin"
// })
//
// console.log("==deploy ScheduleTarget Contract Result== ", dcResult)

const textEncoder = new TextEncoder()
const aspect = await DeployAspect({
    wasmPath: "../build/type-check-aspect.wasm",
    joinPoints: ["PreTxExecute", "PostTxExecute"],
    properties: [{ 'key': 'ScheduleTo', 'value': result.contractAddress },
    { 'key': 'Broker', 'value': result.from },
    { 'key': 'binding', 'value': result.contractAddress },
    { 'key': 'owner', 'value': result.from },
    { 'key': 'key_for_string', 'value': textEncoder.encode('test value') }],
})
assert.ok(aspect.aspectAddress, "Deploy storage-aspect  fail");

console.log("==deploy Aspect Result== ", aspect)
//
const bindResult = await BindAspect({
    abiPath: "../build/contract/Storage.abi",
    contractAddress: result.contractAddress,
    aspectId: aspect.aspectAddress
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