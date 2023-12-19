import {ConnectToANode, DeployAspect, EntryPoint} from "./bese-test.js";

import assert from "assert";

let aspect = await DeployAspect({
    wasmPath: "../build/operation-test.wasm",
})

console.log("==deploy Aspect Result== ", aspect)


let rawcall = await EntryPoint({
    aspectId: aspect.aspectAddress,
    operationData: '0x1167c2e50dFE34b9Ad593d2c6694731097147317'
})
const web3 = ConnectToANode();

const rest=web3.eth.abi.decodeParameter('string', rawcall);
console.log(rawcall)
console.log(rest)

assert.strictEqual(rest,"test")




