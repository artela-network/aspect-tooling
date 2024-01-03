import {
    AspectsOf,
    BindAspect, BoundAddressesOf,
    ConnectToANode,
    DeployAspect,
    DeployContract,
    UnBindAspect,
    UpgradeAspect,
} from "./bese-test.js";

const web3Node = ConnectToANode();

// Deploy HoneyPot Contract
const honeyPotResult = await DeployContract({
    abiPath: "../build/contract/HoneyPot.abi", bytePath: "../build/contract/HoneyPot.bin"
})
console.log("==deploy HoneyPot Contract Result== ", honeyPotResult)


const aspect = await DeployAspect({
    wasmPath: "../build/eoa-check.wasm",
    joinPoints: ["VerifyTx"],
    properties: [{'key': 'HoneyPotAddr', 'value': honeyPotResult.contractAddress},
        {'key': 'binding', 'value': honeyPotResult.contractAddress},
        {'key': 'verifyAccount', 'value': honeyPotResult.from}],
})

console.log("==deploy Aspect Result== ", aspect)

const bindResult = await BindAspect({
    abiPath: "../build/contract/HoneyPot.abi",
    contractAddress: honeyPotResult.contractAddress,
    aspectId: aspect.aspectAddress,
})
console.log("==bind Aspect Result== ", bindResult)

const upgradeResult= await UpgradeAspect({
    wasmPath: "../build/eoa-check.wasm",
    aspectId: aspect.aspectAddress,
    skFile: "../aspect-account.txt",
})
console.log("==deploy Aspect Result== ", upgradeResult)

const bindEoaResult = await BindAspect({
    abiPath: "../build/contract/HoneyPot.abi",
    contractAddress: honeyPotResult.from,
    aspectId: aspect.aspectAddress,
})
console.log("==bind Aspect Result2== ", bindEoaResult)

await new Promise(r => setTimeout(r, 9000));

const aspectof = await AspectsOf({contract: honeyPotResult.contractAddress});
console.log("==bind aspectof== ", aspectof)


const aspectAddrof = await BoundAddressesOf({aspectId: aspect.aspectAddress});
console.log("==bind BoundAddressesOf Result== ", aspectAddrof)


const unbindResult = await UnBindAspect({
    abiPath: "../build/contract/HoneyPot.abi",
    contract: honeyPotResult.from,
    aspectId: aspect.aspectAddress
})
console.log("==unbind Aspect Result== ", unbindResult)
await new Promise(r => setTimeout(r, 5000));

const aspectAddr = await BoundAddressesOf({aspectId: aspect.aspectAddress});
console.log("==get BoundAddressesOf Result== ", aspectAddr)


