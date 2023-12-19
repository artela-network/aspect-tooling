import {BindAspect, ContractCall, DeployAspect, DeployContract, SendTx} from "./bese-test.js";


let result=await DeployContract({
    abiPath:"../build/contract/Storage.abi", bytePath:"../build/contract/Storage.bin"
})

console.log("==deploy  Storage Contract Result== ", result)
//
// let dcResult = await DeployContract({
//     abiPath: "../build/contract/ScheduleTarget.abi", bytePath: "../build/contract/ScheduleTarget.bin"
// })
//
// console.log("==deploy ScheduleTarget Contract Result== ", dcResult)


let aspect = await DeployAspect({
    wasmPath: "../build/storage-aspect.wasm",
    joinPoints: [  "PreTxExecute", "PostTxExecute"],
    properties: [{'key': 'ScheduleTo', 'value': result.contractAddress},
        {'key': 'Broker', 'value': result.from},
        {'key': 'binding', 'value': result.contractAddress},
        {'key': 'owner', 'value': result.from}],
})

console.log("==deploy Aspect Result== ", aspect)

let bindResult = await BindAspect({
    abiPath: "../build/contract/Storage.abi",
    contractAddress: result.contractAddress,
    aspectId: aspect.aspectAddress
})
console.log("==bind Aspect Result== ", bindResult)

let storeVal = await SendTx({
    contract: result.contractAddress,
    abiPath: "../build/contract/Storage.abi",
    method: "store",
    args: [100]
});

console.log("==== storeVal===", storeVal);


let callVal = await ContractCall({contract:result.contractAddress,
    abiPath: "../build/contract/Storage.abi",
    method:"retrieve"
});
console.log("==== reuslt===" + callVal);

let getValue = await ContractCall({contract:result.contractAddress,
    abiPath: "../build/contract/Storage.abi",
    method:"getAspectContext",
    args:[aspect.aspectAddress, "aspectSetKey"]
});

console.log("==== getAspectContext from aspect preTxExecute set  ===" + getValue);


let setValue = await ContractCall({contract:result.contractAddress,
    abiPath: "../build/contract/Storage.abi",
    method:"setAspectContext",
    args:["contractSetKey", "HelloAspect"]
});
console.log("==== setAspectContext for aspect postTxExecute  ===" + setValue);



