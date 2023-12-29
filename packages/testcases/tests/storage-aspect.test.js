import {BindAspect, ContractCall, DeployAspect, DeployContract, SendTx} from "./bese-test.js";
import assert from "assert";

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


const aspect = await DeployAspect({
    wasmPath: "../build/storage-aspect.wasm",
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

const getValue = await ContractCall({
    contract: result.contractAddress,
    abiPath: "../build/contract/Storage.abi",
    method: "getAspectContext",
    args: [aspect.aspectAddress, "aspectSetKey"]
});

console.log("==== getAspectContext from aspect preTxExecute set  ===" + getValue);
assert.strictEqual(getValue, "HelloWord", "getAspectContext from aspect preTxExecute set fail")


const setValue = await ContractCall({
    contract: result.contractAddress,
    abiPath: "../build/contract/Storage.abi",
    method: "setAspectContext",
    args: ["contractSetKey", "HelloAspect"]
});
console.log("==== setAspectContext for aspect postTxExecute  ===" + setValue);
assert.strictEqual(setValue, true, "setAspectContext from aspect postTxExecute set fail")

