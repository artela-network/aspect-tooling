import assert from "assert";
import { TextEncoder } from "util";
import { BindAspect, ContractCall, DeployAspect, DeployContract, SendTx, UpgradeAspect, VersionOf } from "./bese-test.js";

async function sendAndCall(result) {
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
}

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
    wasmPath: "../build/upgrade-test-aspect.wasm",
    joinPoints: ["PreTxExecute", "PostTxExecute"],
    properties: [{ 'key': 'ScheduleTo', 'value': result.contractAddress },
    { 'key': 'Broker', 'value': result.from },
    { 'key': 'binding', 'value': result.contractAddress },
    { 'key': 'owner', 'value': result.from },
    { 'key': 'key_for_string', 'value': textEncoder.encode('test value') }],
})
assert.ok(aspect.aspectAddress, "Deploy storage-aspect  fail");

console.log("==deploy Aspect Result== ", aspect)

const bindResult = await BindAspect({
    abiPath: "../build/contract/Storage.abi",
    contractAddress: result.contractAddress,
    aspectId: aspect.aspectAddress
})
console.log("==bind Aspect Result== ", bindResult)

const ver1 = await VersionOf(
    { aspectId: aspect.aspectAddress }
)

await sendAndCall(result)

console.log('=== Aspect version === ', ver1)

// --------------------
const upgradeResult = await UpgradeAspect({
    wasmPath: "../build/type-check-aspect.wasm",
    aspectId: aspect.aspectAddress,
    properties: [{ 'key': 'key_for_string', 'value': textEncoder.encode('test value1') }],
})
console.log("== Upgrade Aspect Result == ", upgradeResult)

const bindResult2 = await BindAspect({
    abiPath: "../build/contract/Storage.abi",
    contractAddress: result.contractAddress,
    aspectId: aspect.aspectAddress
})
console.log("==bind Aspect Result== ", bindResult2)

await sendAndCall(result)

const ver2 = await VersionOf({ aspectId: aspect.aspectAddress })

console.log(`====== Aspect version ====== ${ver2}`)
assert.ok(parseInt(ver1) + 1 == parseInt(ver2), 'Upgrade Aspect Fail')

console.log('Upgrade test passed!')