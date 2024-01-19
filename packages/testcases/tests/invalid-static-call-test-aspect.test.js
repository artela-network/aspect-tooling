import assert from "assert";
import fs from "fs";
import {
    ConnectToANode,
    DeployAspect,
    DeployContract,
    EntryPoint,
    SendTx,
    UpgradeAspect,
} from "./bese-test.js";

const aspectPath = "../build/static-call-aspect.wasm"
const storageContract = await DeployContract({
    abiPath: "../build/contract/Storage.abi", bytePath: "../build/contract/Storage.bin"
})
assert.ok(storageContract.contractAddress, "Deploy Storage Contract fail");
console.log("==deploy  Storage Contract Result== ", storageContract)

async function deployContract(pathPrefix) {
    const deployResult = await DeployContract({
        abiPath: `${pathPrefix}.abi`, bytePath: `${pathPrefix}.bin`
    })
    console.log("==deploy Contract Result== ", deployResult)

    var web = ConnectToANode();

    const abiTxt = fs.readFileSync(`${pathPrefix}.abi`, "utf-8").toString().trim();
    const contractAbi = JSON.parse(abiTxt);
    const contractObj = new web.eth.Contract(contractAbi);

    console.log("==deploy ScheduleTarget Contract methods== ", contractObj.methods)
    var contractMethods = contractObj.methods
    // var encodeABI = contractObj.methods.retrieve().encodeABI();
    return [deployResult, contractMethods]
}

const [targetContract1, contractMethods1] = await deployContract('../build/contract/ScheduleTarget')
const [targetContract2, contractMethods2] = await deployContract('../build/contract/ScheduleTarget2')

async function invalidAddressTest({
    aspect,
    addrType,
    toAddress = null,
}) {
    let matchExpectation = false
    const logPrefix = `[Invalid address test: ${addrType}]`

    try {
        const upgradeResult = await UpgradeAspect({
            aspectId: aspect.aspectAddress,
            wasmPath: aspectPath,
            properties: [
                { 'key': 'from', 'value': targetContract1.from },
                { 'key': 'to', 'value': toAddress === null ? targetContract1.contractAddress : toAddress },
                { 'key': 'data', 'value': contractMethods1.retrieve().encodeABI() }
            ],
        })

        assert.ok(upgradeResult, "Upgrade static-call-aspect fail");

        const rawcall = await EntryPoint({
            aspectId: aspect.aspectAddress,
            operationData: '0x1167c2e50dFE34b9Ad593d2c6694731097147317'
        })

        matchExpectation = false
    } catch (err) {
        console.log(`${logPrefix} ${err}`)
        matchExpectation = true
    }
    assert.ok(matchExpectation, `${logPrefix} An invalid to-address(${addrType}) can be called`)
}

const sendResult = await SendTx({
    contract: targetContract1.contractAddress,
    abiPath: "../build/contract/ScheduleTarget.abi",
    method: "store",
    args: [100]
});
console.log("==== ScheduleTarget store===", sendResult);

// Test for non-existent method.
const aspect = await DeployAspect({
    wasmPath: aspectPath,
    joinPoints: ["PreTxExecute", "PostTxExecute", "PreContractCall", "PostContractCall", "VerifyTx"],
    properties: [{ 'key': 'from', 'value': targetContract1.from },
    { 'key': 'to', 'value': targetContract1.contractAddress },
    { 'key': 'data', 'value': contractMethods2.retrieve2().encodeABI() }],
})
console.log("==deploy Aspect Result== ", aspect)
assert.ok(aspect.aspectAddress, "Deploy storage-aspect  fail");

let matchExpectation = false
try {
    const rawcall = await EntryPoint({
        aspectId: aspect.aspectAddress,
        operationData: '0x1167c2e50dFE34b9Ad593d2c6694731097147317'
    })
    matchExpectation = false
} catch (err) {
    matchExpectation = true
}
assert.ok(matchExpectation, 'A non-existent contract method was successfully called')


const textEncoder = new TextEncoder()
const web3 = ConnectToANode()
const aspectCore = web3.atl.aspectCore()

await invalidAddressTest({
    aspect: aspect,
    addrType: "Non-existent address",
    toAddress: textEncoder.encode('abcdefg'),
})
await invalidAddressTest({
    aspect: aspect,
    addrType: "EOA account address",
    toAddress: targetContract1.from,
})
await invalidAddressTest({
    aspect: aspect,
    addrType: "System contract address",
    toAddress: aspectCore.options.address,
})
await invalidAddressTest({
    aspect,
    addrType: "Aspect address",
    toAddress: aspect.aspectAddress,
})


console.log("All test cases passed!")