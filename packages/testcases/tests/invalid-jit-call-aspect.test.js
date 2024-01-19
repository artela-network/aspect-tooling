import assert from "assert";
import fs from "fs";
import {
    BindAspect,
    ConnectToANode,
    ContractCall,
    DeployAspect,
    DeployContract,
    SendTx,
    UpgradeAspect
} from "./bese-test.js";

async function deployAspect({
    logPrefix,
    aspectPath,
    targetPhase,
    jitContract,
    jitAbiData,
    toAddress = null,
}) {
    const textEncoder = new TextEncoder()
    const aspect = await DeployAspect({
        wasmPath: aspectPath,
        joinPoints: [
            "PreTxExecute",
            "PostTxExecute",
            "VerifyTx",
            "PreContractCall",
            "PostContractCall",
        ],
        properties: [{ 'key': 'from', 'value': jitContract.from },
        { 'key': 'to', 'value': toAddress === null ? jitContract.contractAddress : toAddress },
        { 'key': 'data', 'value': jitAbiData },
        { 'key': 'join_point', 'value': textEncoder.encode(targetPhase) }],
    })

    console.log(`==${logPrefix} deploy Aspect Result==`, aspect)
    assert.ok(aspect.aspectAddress, `${logPrefix} Deploy storage-aspect  fail`);
    return aspect
}

async function bindAspect({
    logPrefix,
    aspect,
    mainContract,
    mainAbiPath,
}) {
    const bindResult = await BindAspect({
        abiPath: mainAbiPath,
        contractAddress: mainContract.contractAddress,
        aspectId: aspect.aspectAddress
    })
    console.log(`==${logPrefix} bind Aspect Result==`, bindResult)
}

async function sendTx({
    logPrefix,
    contract,
    abiPath,
}) {
    const storeVal = await SendTx({
        contract: contract.contractAddress,
        abiPath: abiPath,
        method: "store",
        args: [100]
    });
    console.log(`====${logPrefix} storeVal===`, storeVal);
}

async function contractCall({
    logPrefix,
    contract,
    abiPath,
}) {
    const callVal = await ContractCall({
        contract: contract.contractAddress,
        abiPath: abiPath,
        method: "retrieve"
    });
    console.log(`====${logPrefix} result===`, callVal);
}

const aspectPath = "../build/invalid-jit-call-aspect.wasm"
const mainAbiPath = "../build/contract/Storage.abi"
const mainContractBinPath = "../build/contract/Storage.bin"

const jitAbiPath = "../build/contract/ScheduleTarget.abi"
const jitContractBinPath = "../build/contract/ScheduleTarget.bin"

const storageContract = await DeployContract({
    abiPath: mainAbiPath, bytePath: mainContractBinPath
})
assert.ok(storageContract.contractAddress, "Deploy Storage Contract fail");
console.log("==deploy  Storage Contract Result== ", storageContract)

const jitContract = await DeployContract({
    abiPath: jitAbiPath,
    bytePath: jitContractBinPath
})
console.log("==deploy ScheduleTarget Contract Result== ", jitContract)

var web = ConnectToANode();
const abiTxt = fs.readFileSync(jitAbiPath, "utf-8").toString().trim();
const contractAbi = JSON.parse(abiTxt);
const tokenContract = new web.eth.Contract(contractAbi);

console.log("==deploy ScheduleTarget Contract methods== ", tokenContract.methods)
const jitAbiData = tokenContract.methods.store([10]).encodeABI();


async function invalidJoinPointTest(targetPhase) {
    let matchExpectation = false
    const logPrefix = `[Invalid join point test: ${targetPhase}]`
    try {
        const aspect = await deployAspect({
            logPrefix: logPrefix,
            aspectPath: aspectPath,
            targetPhase: targetPhase,
            mainContract: storageContract,
            jitContract: jitContract,
            mainAbiPath: mainAbiPath,
            jitAbiPath: jitAbiPath,
            jitAbiData: jitAbiData,
        })

        await bindAspect({
            logPrefix: logPrefix,
            aspect: aspect,
            mainContract: storageContract,
            mainAbiPath: mainAbiPath,
        })

        await sendTx({
            logPrefix: logPrefix,
            contract: storageContract,
            abiPath: mainAbiPath
        })

        await contractCall({
            logPrefix: logPrefix,
            contract: storageContract,
            abiPath: mainAbiPath
        })

        await contractCall({
            logPrefix: logPrefix,
            contract: jitContract,
            abiPath: jitAbiPath
        })

        matchExpectation = false
    } catch (err) {
        console.log(`${logPrefix} ${err}`)
        matchExpectation = true
    }
    assert.ok(matchExpectation, `${logPrefix} Jit contract can be call illegally`)
}

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
                { 'key': 'from', 'value': jitContract.from },
                { 'key': 'to', 'value': toAddress === null ? jitContract.contractAddress : toAddress },
                { 'key': 'data', 'value': jitAbiData },
                { 'key': 'join_point', 'value': textEncoder.encode("PreContractCall") }
            ],
        })

        assert.ok(upgradeResult, "Upgrade jit-call-aspect fail");

        await bindAspect({
            logPrefix: logPrefix,
            aspect: aspect,
            mainContract: storageContract,
            mainAbiPath: mainAbiPath,
        })

        await sendTx({
            logPrefix: logPrefix,
            contract: storageContract,
            abiPath: mainAbiPath
        })

        await contractCall({
            logPrefix: logPrefix,
            contract: storageContract,
            abiPath: mainAbiPath
        })

        matchExpectation = false
    } catch (err) {
        console.log(`${logPrefix} ${err}`)
        matchExpectation = true
    }
    assert.ok(matchExpectation, `${logPrefix} An invalid to-address(${addrType}) can be called`)
}

await invalidJoinPointTest("preTxExecute")
await invalidJoinPointTest("postTxExecute")
await invalidJoinPointTest("verifyTx")

const aspect = await deployAspect({
    logPrefix: "operation",
    aspectPath: aspectPath,
    targetPhase: "operation",
    mainContract: storageContract,
    jitContract: jitContract,
    mainAbiPath: mainAbiPath,
    jitAbiPath: jitAbiPath,
    jitAbiData: jitAbiData
})

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
assert.ok(matchExpectation, `[Invalid join point test: operation] Jit contract can be call illegally`)

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
    toAddress: jitContract.from,
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
