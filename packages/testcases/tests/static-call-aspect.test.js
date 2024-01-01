import {
    BindAspect,
    ConnectToANode,
    ContractCall,
    DeployAspect,
    DeployContract,
    EntryPoint,
    SendTx
} from "./bese-test.js";
import assert from "assert";
import fs from "fs";

const storageContract = await DeployContract({
    abiPath: "../build/contract/Storage.abi", bytePath: "../build/contract/Storage.bin"
})
assert.ok(storageContract.contractAddress, "Deploy Storage Contract fail");
console.log("==deploy  Storage Contract Result== ", storageContract)

const targetContract = await DeployContract({
    abiPath: "../build/contract/ScheduleTarget.abi", bytePath: "../build/contract/ScheduleTarget.bin"
})
console.log("==deploy ScheduleTarget Contract Result== ", targetContract)

var web = ConnectToANode();
const abiTxt = fs.readFileSync("../build/contract/ScheduleTarget.abi", "utf-8").toString().trim();
const contractAbi = JSON.parse(abiTxt);
const tokenContract = new web.eth.Contract(contractAbi);

console.log("==deploy ScheduleTarget Contract methods== ", tokenContract.methods)
var encodeABI = tokenContract.methods.retrieve().encodeABI();

const sendResult = await SendTx({
    contract: targetContract.contractAddress,
    abiPath: "../build/contract/ScheduleTarget.abi",
    method: "store",
    args: [100]
});
console.log("==== ScheduleTarget store===", sendResult);


const aspect = await DeployAspect({
    wasmPath: "../build/static-call-aspect.wasm",
    joinPoints: ["PreTxExecute", "PostTxExecute", "PreContractCall", "PostContractCall","VerifyTx"],
    properties: [{'key': 'from', 'value': targetContract.from},
        {'key': 'to', 'value': targetContract.contractAddress},
        {'key': 'data', 'value': encodeABI}],
})
console.log("==deploy Aspect Result== ", aspect)
assert.ok(aspect.aspectAddress, "Deploy storage-aspect  fail");


//operation send and call
const rawcall = await EntryPoint({
    aspectId: aspect.aspectAddress,
    operationData: '0x1167c2e50dFE34b9Ad593d2c6694731097147317'
})


const bindResult = await BindAspect({
    abiPath: "../build/contract/Storage.abi",
    contractAddress: storageContract.contractAddress,
    aspectId: aspect.aspectAddress
})
console.log("==bind Aspect Result== ", bindResult)

const storeVal = await SendTx({
    contract: storageContract.contractAddress,
    abiPath: "../build/contract/Storage.abi",
    method: "store",
    args: [100]
});
console.log("==== storeVal===", storeVal);

const callVal = await ContractCall({
    contract: storageContract.contractAddress,
    abiPath: "../build/contract/Storage.abi",
    method: "retrieve"
});
console.log("==== reuslt===" + callVal);

assert.strictEqual(callVal, "100", "Contract Call storageContract fail")


const getValue = await ContractCall({
    contract: targetContract.contractAddress,
    abiPath: "../build/contract/ScheduleTarget.abi",
    method: "retrieve",
});

console.log("==== target  ===" + getValue);

