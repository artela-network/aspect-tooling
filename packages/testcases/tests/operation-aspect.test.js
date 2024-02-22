import {ConnectToANode, DeployAspect, EntryPoint} from "./bese-test.js";

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
    wasmPath: "../build/operation-aspect.wasm",
    properties: [{'key': 'num', 'value':getInt16Bytes(100)} ],

})

console.log("==deploy Aspect Result== ", aspect)
assert.ok(aspect.aspectAddress, "deploy Aspect fail")


const rawcall = await EntryPoint({
    aspectId: aspect.aspectAddress,
    operationData: '0x1167c2e50dFE34b9Ad593d2c6694731097147317'
})
const web3 = ConnectToANode();
console.log(rawcall)
const rest = web3.eth.abi.decodeParameter('string', rawcall);
console.log(rawcall, rest)
assert.strictEqual(rest, "test")
