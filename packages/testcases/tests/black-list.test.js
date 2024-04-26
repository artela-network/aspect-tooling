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

//Write the numeric value into the view to get its byte array, big-endian endian
function getUint8Array(len, setNum) {
    var buffer = new ArrayBuffer(len);  //specify the byte length
    setNum(new DataView(buffer));  //Depending on the type, different functions are called to write values
    return new Uint8Array(buffer); //create a byte array to fetch data from the cache
}
//Get an 8-bit signed integer byte array, big-endian endian
function getInt8Bytes(num) {
    return getUint8Array(1, function (view) { view.setInt8(0, num); })
}
//Get an 8-bit unsigned integer byte array with big-endian endianism
function getUint8Bytes(num) {
    return getUint8Array(1, function (view) { view.setUint8(0, num); })
}
//Get a 16-bit signed integer byte array with big-endian entitlement
function getInt16Bytes(num) {
    return getUint8Array(2, function (view) { view.setInt16(0, num); })
}

const aspect = await DeployAspect({
    wasmPath: "../build/black-list.wasm",
    joinPoints: ["PreContractCall"],

})

console.log("==deploy Aspect Result== ", aspect)
assert.ok(aspect.aspectAddress, "deploy Aspect fail")

const textEncoder = new TextEncoder();
const rawcall = await EntryPoint({
    aspectId: aspect.aspectAddress,
    operationData:  textEncoder.encode("+0x1167c2e50dFE34b9Ad593d2c6694731097147317,0x1167c2e50dFE34b9Ad593d2c6694731097147312")
})
const web3 = ConnectToANode();
console.log(rawcall)
const rest = web3.eth.abi.decodeParameter('string', rawcall);
console.log(rawcall, rest)
//assert.strictEqual(rest, "test")



const result = await DeployContract({
    abiPath: "../build/contract/Storage.abi", bytePath: "../build/contract/Storage.bin"
})
assert.ok(result.contractAddress, "Deploy Storage Contract fail");
console.log("==deploy  Storage Contract Result== ", result)


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

