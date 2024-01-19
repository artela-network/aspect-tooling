import { ConnectToANode, DeployAspect, EntryPoint } from "./bese-test.js";

import assert from "assert";

const aspect = await DeployAspect({
    wasmPath: "../build//crypto-hash-aspect.wasm",
})

console.log("==deploy Aspect Result== ", aspect)
assert.ok(aspect.aspectAddress, "deploy Aspect fail")

const textEncoder = new TextEncoder();
const rawcall = await EntryPoint({
    aspectId: aspect.aspectAddress,
    operationData: textEncoder.encode("helloWorld")
})
console.log(rawcall)
const web3 = ConnectToANode();
//
// const rest = web3.eth.abi.decodeParameter('string', rawcall);
// console.log(rawcall, rest)
