import {
    AspectsOf,
    BindAspect, BoundAddressesOf,
    ConnectToANode,
    DeployAspect,
    DeployContract,
    UnBindAspect,
} from "./bese-test.js";
import fs from "fs";

const web3Node = ConnectToANode();

// Deploy HoneyPot Contract
const honeyPotResult = await DeployContract({
    abiPath: "../build/contract/HoneyPot.abi", bytePath: "../build/contract/HoneyPot.bin"
})
console.log("==deploy HoneyPot Contract Result== ", honeyPotResult)



const aspect = await DeployAspect({
    wasmPath: "../build/verify-aspect.wasm",
    joinPoints: ["VerifyTx"],
    properties: [{'key': 'HoneyPotAddr', 'value': honeyPotResult.contractAddress},
        {'key': 'binding', 'value': honeyPotResult.contractAddress},
        {'key': 'verifyAccount', 'value': honeyPotResult.from}],
})

console.log("==deploy Aspect Result== ", aspect)

// const upgradeResult= await UpgradeAspect({
//     wasmPath: "../build/guard-by-count.wasm",
//     aspectId: aspect.aspectAddress,
//     skFile: "../aspect_accounts.txt",
//     properties: [{'key': 'owner', 'value': aspect.form}]
// })
// console.log("==deploy Aspect Result== ", upgradeResult)


const bindResult = await BindAspect({
    abiPath: "../build/contract/HoneyPot.abi",
    contractAddress: honeyPotResult.contractAddress,
    aspectId: aspect.aspectAddress
})
console.log("==bind Aspect Result== ", bindResult)

const bindEoaResult = await BindAspect({
    abiPath: "../build/contract/HoneyPot.abi",
    contractAddress: honeyPotResult.from,
    aspectId: aspect.aspectAddress
})
console.log("==bind Aspect Result== ", bindEoaResult)

await new Promise(r => setTimeout(r, 9000));

const aspectof =await AspectsOf({contract:honeyPotResult.contractAddress});
console.log("==bind aspectof== ", aspectof)


const aspectAddrof =await BoundAddressesOf({aspectId:aspect.aspectAddress});
console.log("==bind BoundAddressesOf Result== ", aspectAddrof)



const unbindResult = await UnBindAspect({
    abiPath: "../build/contract/HoneyPot.abi",
    contract: honeyPotResult.from,
    aspectId: aspect.aspectAddress
})
console.log("==unbind Aspect Result== ", unbindResult)
await new Promise(r => setTimeout(r, 5000));

const aspectAddr =await BoundAddressesOf({aspectId:aspect.aspectAddress});
console.log("==get BoundAddressesOf Result== ", aspectAddr)


