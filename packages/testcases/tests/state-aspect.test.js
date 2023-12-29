import {ConnectToANode, DeployAspect, EntryPoint} from "./bese-test.js";

import assert from "assert";

const aspect = await DeployAspect({
    wasmPath: "../build/state-aspect.wasm",
})

console.log("==deploy Aspect Result== ", aspect)
assert.ok(aspect.aspectAddress, "deploy Aspect fail")

for (let i = 0; i < 10; i++) {
    const rawcall = await EntryPoint({
        aspectId: aspect.aspectAddress,
        operationData: '0x1167c2e50dFE34b9Ad593d2c6694731097147317'
    })
    const web3 = ConnectToANode();

    const rest = web3.eth.abi.decodeParameter('string', rawcall);
    console.log( rest)

}
