import assert from "assert";
import { TextEncoder } from "util";
import { BindAspect, ContractCall, DeployAspect, DeployContract, SendTx } from "./bese-test.js";

// const result = await DeployContract({
//     abiPath: "../build/contract/DepositEvent.abi", bytePath: "../build/contract/DepositEvent.bin"
// })
// assert.ok(result.contractAddress, "Deploy Storage Contract fail");
// console.log("==deploy  Storage Contract Result== ", result)
//


const storeVal = await SendTx({
    contract: "0xc7f8eb493939d2f14c136efcc359bd23e1a0f8ee",
    abiPath: "../build/contract/DepositEvent.abi",
    method: "deposit",
    args: ['0x01']
});

 console.log("==== storeVal===", storeVal);
//
//
// const callVal = await ContractCall({
//     contract: result.contractAddress,
//     abiPath: "../build/contract/Storage.abi",
//     method: "retrieve"
// });
// console.log("==== reuslt===" + callVal);
// assert.strictEqual(callVal, "100", "Contract Call result fail")