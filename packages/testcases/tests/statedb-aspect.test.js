import {BindAspect, ConnectToANode, ContractCall, DeployAspect, DeployContract, SendTx} from "./bese-test.js";
import assert from "assert";

const result = await DeployContract({
    abiPath: "../build/contract/Storage.abi", bytePath: "../build/contract/Storage.bin"
})
assert.ok(result.contractAddress, "Deploy Storage Contract fail");
console.log("==deploy  Storage Contract Result== ", result)

const store = await SendTx({
    contract: result.contractAddress,
    abiPath: "../build/contract/Storage.abi",
    method: "store",
    args: [100]
});
console.log("==== SendTx store 100===", store);

var web3 = ConnectToANode();
// 计算 myPerson 结构体的状态键
const stateKey = web3.utils.soliditySha3(
    { t: 'address', v: result.contractAddress},  // 合约地址
    { t: 'string', v: 'number' }
);

console.log(`State key for number: ${stateKey}`);


const aspect = await DeployAspect({
    wasmPath: "../build/statedb-aspect.wasm",
    joinPoints: ["PreTxExecute", "PostTxExecute", "PreContractCall", "PostContractCall","VerifyTx"],
    properties: [{'key': 'sender', 'value': result.from},
        {'key': 'contract', 'value': result.contractAddress},
        {'key': 'txHash', 'value': store.transactionHash},
        {'key': 'hashKey', 'value': 0x1}],
})
assert.ok(aspect.aspectAddress, "Deploy storage-aspect  fail");

console.log("==deploy Aspect Result== ", aspect)

const bindResult = await BindAspect({
    abiPath: "../build/contract/Storage.abi",
    contractAddress: result.contractAddress,
    aspectId: aspect.aspectAddress
})
console.log("==bind Aspect Result== ", bindResult)

const storeVal = await SendTx({
    contract: result.contractAddress,
    abiPath: "../build/contract/Storage.abi",
    method: "store",
    args: [100]
});
console.log("==== storeVal===", storeVal);

