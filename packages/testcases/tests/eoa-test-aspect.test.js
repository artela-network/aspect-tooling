import assert from 'assert';
import {
    AspectsOf,
    BindAspect,
    BoundAddressesOf,
    ConnectToANode,
    DeployAspect,
    DeployContract,
    UnBindAspect
} from "./bese-test.js";

const web3Node = ConnectToANode();

const contractPathPrefix = "../build/contract/HoneyPot"
const wasmPath = "../build/verify-aspect.wasm"

// Deploy HoneyPot Contract
const honeyPotResult = await DeployContract({
    abiPath: `${contractPathPrefix}.abi`, bytePath: `${contractPathPrefix}.bin`
})
console.log("==deploy HoneyPot Contract Result== ", honeyPotResult)


const aspect = await DeployAspect({
    wasmPath: wasmPath,
    joinPoints: ["VerifyTx"],
    properties: [{ 'key': 'HoneyPotAddr', 'value': honeyPotResult.contractAddress },
    { 'key': 'binding', 'value': honeyPotResult.contractAddress },
    { 'key': 'verifyAccount', 'value': honeyPotResult.from }],
})

console.log("==deploy Aspect Result== ", aspect)

const bindResult = await BindAspect({
    abiPath: `${contractPathPrefix}.abi`,
    contractAddress: honeyPotResult.contractAddress,
    aspectId: aspect.aspectAddress,
})
console.log("==bind Aspect Result== ", bindResult)

const bindEoaResult = await BindAspect({
    abiPath: `${contractPathPrefix}.abi`,
    contractAddress: honeyPotResult.from,
    aspectId: aspect.aspectAddress,
})
console.log("==After binding to an EOA address== ", bindEoaResult)

await new Promise(r => setTimeout(r, 9000));

const eoaAddressLowerCase = honeyPotResult.from.toLowerCase()
const contractAddressLowerCase = honeyPotResult.contractAddress.toLowerCase()
const aspectAddressLowerCase = aspect.aspectAddress.toLowerCase()

const aspectof = await AspectsOf({ contract: honeyPotResult.from });
assert.ok(
    aspectof.map(it => it.aspectId.toLowerCase()).includes(aspectAddressLowerCase),
    'Failed to bind the aspect to the EOA.'
)

const boundAddressesOfResult = (await BoundAddressesOf({ aspectId: aspect.aspectAddress }))
    .map(v => v.toLowerCase())

assert.ok(
    boundAddressesOfResult.includes(eoaAddressLowerCase) &&
    boundAddressesOfResult.includes(contractAddressLowerCase),
    'Error: Aspect should be bound to both contract and EOA'
)

const unbindEoaResult = await UnBindAspect({
    abiPath: `${contractPathPrefix}.abi`,
    contract: honeyPotResult.from,
    aspectId: aspect.aspectAddress,
})

assert.ok(unbindEoaResult, 'Failed to unbind EOA')

const aspectof2 = await AspectsOf({ contract: honeyPotResult.from })
assert.ok(
    !aspectof2.map(it => it.aspectId.toLowerCase()).includes(aspectAddressLowerCase),
    'Failed to unbind the aspect from the EOA.'
)

const boundAddressesOfResult2 = (await BoundAddressesOf({ aspectId: aspect.aspectAddress }))
    .map(v => v.toLowerCase())
assert.ok(
    !boundAddressesOfResult2.includes(eoaAddressLowerCase),
    'Error: Aspect shouldn\'t be bound to EOA after unbinding'
)

console.log('All test cases passed!')