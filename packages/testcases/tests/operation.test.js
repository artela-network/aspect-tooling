import {ConnectToANode, DeployAspect, EntryPoint} from "./bese-test.js";

import assert from "assert";

//Write the numeric value into the view to get its byte array, big-endian endian

const aspect = await DeployAspect({
    wasmPath: "../build/operation-test.wasm",
})

console.log("==deploy Aspect Result== ", aspect)
assert.ok(aspect.aspectAddress, "deploy Aspect fail")


const rawcall = await EntryPoint({
    aspectId: aspect.aspectAddress,
    operationData: '0x100100001'
})
const web3 = ConnectToANode();
console.log(rawcall)
const rest = web3.eth.abi.decodeParameter('string', rawcall);
console.log(rawcall, rest)
assert.strictEqual(rest, "test")
