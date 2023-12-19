import {
    BindAspect,
    ConnectToANode,
    ContractCall,
    DeployAspect,
    DeployContract,
    SendTx,
    UpgradeAspect
} from "./bese-test.js";
import {Web3} from "@artela/web3";

const web3Node = ConnectToANode();

// Deploy HoneyPot Contract
let honeyPotResult = await DeployContract({
    abiPath: "../build/contract/HoneyPot.abi", bytePath: "../build/contract/HoneyPot.bin"
})
console.log("==deploy HoneyPot Contract Result== ", honeyPotResult)

// Deploy HoneyPot Contract
let storeVal = await SendTx({
    contract: honeyPotResult.contractAddress,
    abiPath: "../build/contract/HoneyPot.abi",
    method: "deposit",
    value: web3Node.utils.toWei('1', 'ether')
});
console.log("==== HoneyPot ===", storeVal);
const balance = await web3Node.atl.getBalance(honeyPotResult.contractAddress);
console.log("==== HoneyPot balance ===", balance);



let attackResult = await DeployContract({
    abiPath: "../build/contract/Attack.abi",
    bytePath: "../build/contract/Attack.bin",
    skFile: '../attack_accounts.txt',
    args: [honeyPotResult.contractAddress]
})

console.log("==deploy Attack Contract Result== ", attackResult)

let attackTx = await SendTx({
    contract: attackResult.contractAddress,
    abiPath: "../build/contract/Attack.abi",
    method: "deposit",
    value: Web3.utils.toWei('0.1', 'ether')
});
console.log("==== attackTx ===", attackTx);

const attackBalance = await web3Node.atl.getBalance(attackResult.contractAddress);
console.log("==== HoneyPot balance ===", attackBalance);


let aspect = await DeployAspect({
    wasmPath: "../build/guard-by-count.wasm",
    skFile: "../aspect_accounts.txt",
    joinPoints: ["PreContractCall", "PostContractCall"],
    properties: [{'key': 'HoneyPotAddr', 'value': honeyPotResult.contractAddress}, {
        'key': 'binding',
        'value': honeyPotResult.contractAddress
    },],
})
console.log("==deploy Aspect Result== ", aspect)

const upgradeResult= await UpgradeAspect({
    aspectId: aspect.aspectAddress,
    skFile: "../aspect_accounts.txt",
    properties: [{'key': 'owner', 'value': aspect.form}]
})
console.log("==deploy Aspect Result== ", upgradeResult)


let bindResult = await BindAspect({
    abiPath: "../build/contract/HoneyPot.abi",
    contractAddress: honeyPotResult.contractAddress,
    aspectId: aspect.aspectAddress
})
console.log("==bind Aspect Result== ", bindResult)




try {
    let attackTx = await SendTx({
        contract: honeyPotResult.contractAddress,
        abiPath: "../build/contract/Attack.abi",
        method: "attack",
    });
    console.log("==attack Result== ", attackTx)

} catch (err) {
    console.log(err);
}

// Step8. check the balance of HoneyPot
//
// Here, the balance of HoneyPot is expected to remain at 100 ETH,
// Because the attached user has already withdrawn the 10 ETH they deposited.
// The balance of Attach is expect to 10 ETH.
//
// Actually, the balance of HoneyPot is remain at 110 ETH and
// not be withdrawn by the attacking contract because the transaction has been intercepted by the GuardAspect.
// The balance of Attach to remain at 0 ETH.
const balance = await web3Node.atl.getBalance(HoneyPotR);
const attackBalance = await web3Node.atl.getBalance(attackAddress);
console.log("==== honeyPotContract  balance info===" + web3.utils.fromWei(balance, 'ether') + ' ETH')
console.log("==== attackAddress  balance info===" + web3.utils.fromWei(attackBalance, 'ether') + ' ETH')





let callVal = await ContractCall({
    contract: honeyPotResult.contractAddress,
    abiPath: "../build/contract/Storage.abi",
    method: "retrieve"
});
console.log("==== reuslt===" + callVal);

let getValue = await ContractCall({
    contract: honeyPotResult.contractAddress,
    abiPath: "../build/contract/Storage.abi",
    method: "getAspectContext",
    args: [aspect.aspectAddress, "aspectSetKey"]
});

console.log("==== getAspectContext from aspect preTxExecute set  ===" + getValue);


let setValue = await ContractCall({
    contract: honeyPotResult.contractAddress,
    abiPath: "../build/contract/Storage.abi",
    method: "setAspectContext",
    args: ["contractSetKey", "HelloAspect"]
});
console.log("==== setAspectContext for aspect postTxExecute  ===" + setValue);



