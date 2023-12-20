import {
    BindAspect,
    ConnectToANode,
    DeployAspect,
    DeployContract,
    SendTx,
    UpgradeAspect
} from "./bese-test.js";
import fs from "fs";
import assert from "assert";

const web3Node = ConnectToANode();

// Deploy HoneyPot Contract
const honeyPotResult = await DeployContract({
    abiPath: "../build/contract/HoneyPot.abi", bytePath: "../build/contract/HoneyPot.bin"
})
console.log("==deploy HoneyPot Contract Result== ", honeyPotResult)
assert.ok(honeyPotResult.contractAddress,"deploy HoneyPot contract fail")

// Deploy HoneyPot Contract
const storeVal = await SendTx({
    contract: honeyPotResult.contractAddress,
    abiPath: "../build/contract/HoneyPot.abi",
    method: "deposit",
    value: web3Node.utils.toWei('1', 'ether')
});
console.log("==== HoneyPot ===", storeVal);
const balance = await web3Node.atl.getBalance(honeyPotResult.contractAddress);
console.log("==== HoneyPot balance ===", balance);
assert.strictEqual(balance,'1000000000000000000',"honeyPot balance not as expected");

const attackResult = await DeployContract({
    abiPath: "../build/contract/Attack.abi",
    bytePath: "../build/contract/Attack.bin",
    skFile: '../attack_accounts.txt',
    args: [honeyPotResult.contractAddress]
})

console.log("==deploy Attack Contract Result== ", attackResult)
assert.ok(attackResult.contractAddress,"Attack Contract deploy fail");

const attackTx = await SendTx({
    contract: attackResult.contractAddress,
    abiPath: "../build/contract/Attack.abi",
    method: "deposit",
    skFile: '../attack_accounts.txt',
    value: web3Node.utils.toWei('1', 'ether')
});
console.log("==== attackTx ===", attackTx);

const attackBalance = await web3Node.atl.getBalance(attackResult.contractAddress);
console.log("==== HoneyPot balance ===", attackBalance);
assert.strictEqual(balance,'0',"Attack balance not as expected");


const pk = fs.readFileSync( "../aspect_accounts.txt", 'utf-8');
const aspectAccount = web3Node.eth.accounts.privateKeyToAccount(pk.trim());
web3Node.eth.accounts.wallet.add(aspectAccount.privateKey);

const aspect = await DeployAspect({
    wasmPath: "../build/guard-by-trace.wasm",
    skFile: "../aspect_accounts.txt",
    joinPoints: ["PreContractCall", "PostContractCall"],
    properties: [{'key': 'HoneyPotAddr', 'value': honeyPotResult.contractAddress}, {
        'key': 'binding',
        'value': honeyPotResult.contractAddress,},{'key': 'owner', 'value': aspectAccount.address}],
})

console.log("==deploy Aspect Result== ", aspect)
assert.ok(aspect.aspectAddress,"guard-by-trace Aspect deploy fail");


const upgradeResult= await UpgradeAspect({
    wasmPath: "../build/guard-by-count.wasm",
    aspectId: aspect.aspectAddress,
    skFile: "../aspect_accounts.txt",
    properties: [{'key': 'owner', 'value': aspect.form}]
})
console.log("==deploy Aspect Result== ", upgradeResult)


const bindResult = await BindAspect({
    abiPath: "../build/contract/HoneyPot.abi",
    contractAddress: honeyPotResult.contractAddress,
    aspectId: aspect.aspectAddress
})
console.log("==bind Aspect Result== ", bindResult)


try {
    const attackSendTx = await SendTx({
        contract: honeyPotResult.contractAddress,
        skFile:"../attack_accounts.txt",
        abiPath: "../build/contract/Attack.abi",
        method: "attack",
    });
    console.log("==attack Result== ", attackSendTx)

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
const honeyPotBalance = await web3Node.atl.getBalance(honeyPotResult.contractAddress);
const attackNewBalance = await web3Node.atl.getBalance(attackResult.contractAddress);
assert.strictEqual(honeyPotBalance,'2000000000000000000',"honeyPotBalance  not as expected")
assert.strictEqual(attackNewBalance,'0',"Attack balance not as expected")
console.log("==== honeyPotContract  balance info===" + web3Node.utils.fromWei(honeyPotBalance, 'ether') + ' ETH')
console.log("==== attackAddress  balance info===" + web3Node.utils.fromWei(attackNewBalance, 'ether') + ' ETH')



