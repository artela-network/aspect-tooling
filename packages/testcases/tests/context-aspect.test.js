import {BindAspect, ContractCall, DeployAspect, DeployContract, SendTx} from "./bese-test.js";
import assert from "assert";

const result = await DeployContract({
    abiPath: "../build/contract/Storage.abi", bytePath: "../build/contract/Storage.bin"
})
assert.ok(result.contractAddress, "Deploy Storage Contract fail");
console.log("==deploy  Storage Contract Result== ", result)


const aspect = await DeployAspect({
    wasmPath: "../build/context-aspect.wasm",
    joinPoints: ["PreTxExecute", "PostTxExecute", "PreContractCall", "PostContractCall"],
    properties: [{'key': 'ScheduleTo', 'value': result.contractAddress},
        {'key': 'Broker', 'value': result.from},
        {'key': 'binding', 'value': result.contractAddress},
        {'key': 'owner', 'value': result.from}],
})
assert.ok(aspect.aspectAddress, "Deploy storage-aspect  fail");

console.log("==deploy Aspect Result== ", aspect)

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
