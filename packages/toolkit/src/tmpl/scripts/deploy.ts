export const  DeployTmpl=`
"use strict"

///
/// Here is a test scenario where a reentrancy attack is intercepted by an aspect
///

//todo modify it
const Web3 = require("@artela/web3");
const fs = require("fs");


const attackBin = fs.readFileSync('./build/contract/Attack.bin', "utf-8");
const attackTarget = fs.readFileSync('./build/contract/Attack.abi', "utf-8")
const attackAbi = JSON.parse(attackTarget);
const attackOptions = {
    data: attackBin,
    gasPrice: 1000000010, // Default gasPrice set by Geth
    gas: 4000000
};

const HoneyPotBin = fs.readFileSync('./build/contract/contracts_HoneyPot_sol_HoneyPot.bin', "utf-8");
const HoneyPotTarget = fs.readFileSync('./build/contract/contracts_HoneyPot_sol_HoneyPot.abi', "utf-8")
const HoneyPotAbi = JSON.parse(HoneyPotTarget);
const honeypotOptions = {
    data: HoneyPotBin,
    gasPrice: 1000000010, // Default gasPrice set by Geth
    gas: 3000000
};


async function f() {
    // init connection to Artela node

    const web3 = new Web3("http://3.89.248.208:8545");

    // retrieve accounts
    let accounts = await web3.atl.getAccounts();

    // retrieve current nonce
    let honeypotDeployer = accounts[0]
    let honeyPotNonceVal = await web3.atl.getTransactionCount(honeypotDeployer);


    // Step1: deploy honeypot contract to artela
    //
    // HoneyPot is an asset management contract that keeps track of the assets owned by users of HoneyPot. 
    // The total recorded amount of these assets is mapped to the native assets held in the contract's account on the blockchain.
    //
    // Contract at: reentrance/contracts/HoneyPot.sol
    let honeyPotContract = new web3.atl.Contract(HoneyPotAbi,
        web3.utils.aspectCoreAddr, honeypotOptions);
    let token_instance = honeyPotContract.deploy().send({ from: honeypotDeployer, nonce: honeyPotNonceVal });
    let honeypotAddress = "";
    honeyPotContract = await token_instance.on('receipt', function (receipt) {
        console.log("=============== deployed contract ===============");
        console.log("contract address: " + receipt.contractAddress);
        console.log(receipt);
        honeypotAddress = receipt.contractAddress
    }).on('transactionHash', (txHash) => {
        console.log("deploy contract tx hash: ", txHash);
    });
    console.log("== HoneyPot_address ==", honeypotAddress)
    console.log("== HoneyPot_account ==", honeypotDeployer)


    // Step2: deploy attack contract to artela
    //
    // The "attach" contract is one of the users of HoneyPot and defines the "deposit" and "attach" (withdraw) methods.
    // It use the contract call method to invoke the "deposit" and "withdraw" functions from the HoneyPot contract.
    //
    // Contract at: reentrance/contracts/Attack.sol
    let attackDeployer = accounts[1]
    let attackNonceVal = await web3.atl.getTransactionCount(attackDeployer);

    let attackContract = new web3.atl.Contract(attackAbi,
        web3.utils.aspectCoreAddr, attackOptions);
    let attack_instance = attackContract.deploy({ "arguments": [honeypotAddress] }).send({
        from: attackDeployer,
        nonce: attackNonceVal
    });
    let attackAddress = "";
    attackContract = await attack_instance.on('receipt', function (receipt) {
        console.log("=============== deployed attack contract ===============");
        console.log("contract attack address: " + receipt.contractAddress);
        console.log(receipt);
        attackAddress = receipt.contractAddress
    }).on('transactionHash', (txHash) => {
        console.log("deploy attack contract tx hash: ", txHash);
    });

    console.log("== attack_contract ==", attackAddress)
    console.log("== attack_account ==", attackDeployer)

    // Step3: admin deposit 100 eth to honeypot
    //
    // The current recorded balance of HoneyPot is 100 ETH, and the on-chain balance of HoneyPot contract is also 100 ETH.
    await honeyPotContract.methods.deposit()
        .send({ from: honeypotDeployer, nonce: honeyPotNonceVal + 1, value: web3.utils.toWei('100', 'ether') })
        .on('receipt', (receipt) => {
            console.log("=============== Admin Deposit 100 ether ===============")
            console.log(receipt);
        })
        .on('transactionHash', (txHash) => {
            console.log("Call contract tx hash: ", txHash);
        });


    // Step4. HoneyPot user "attach" deposit 10 eth to honeyPot.
    //
    // The recorded balance of HoneyPot has now increased to 110 ETH,
    // and the on-chain balance of HonePot contract has also increased to 110 ETH.
    await attackContract.methods.deposit()
        .send({ from: accounts[1], nonce: attackNonceVal + 1, value: web3.utils.toWei('10', 'ether') })
        .on('receipt', (receipt) => {
            console.log("=============== Hacker Deposit 1 ether ===============")
            console.log(receipt);
        })
        .on('transactionHash', (txHash) => {
            console.log("Call contract tx hash: ", txHash);
        });


    // Step5: deploy GuardAspect
    //
    // Deploy an aspect onto the blockchain with the functionality of
    // checking balances and intercepting transactions according to predefined rules.
    //
    // Aspect at: 
    // - reentrance/assembly/aspect/guard_by_trace_aspect.ts
    let AspectDeployer = accounts[2]
    let nonceValAspectDeployer = await web3.atl.getTransactionCount(AspectDeployer);

    let aspectCode = fs.readFileSync('./build/release.wasm', {
        encoding: "hex"
    });
    let aspect = new web3.atl.Aspect(
        web3.utils.aspectCoreAddr, {
        gasPrice: 1000000010, // Default gasPrice set by Geth
        gas: 4000000
    });
    let instance = aspect.deploy({
        data: '0x' + aspectCode,
        properties: [{ 'key': 'HoneyPotAddr', 'value': honeypotAddress }, {
            'key': 'binding',
            'value': honeypotAddress
        }, { 'key': 'owner', 'value': AspectDeployer }]
    }).send({ from: AspectDeployer, nonce: nonceValAspectDeployer });

    let aspectRt = await instance.on('receipt', (receipt) => {
        console.log("=============== deployed aspect ===============");
        console.log("aspect address: " + aspect.options.address);
        console.log(receipt);
    }).on('transactionHash', (txHash) => {
        console.log("deploy aspect tx hash: ", txHash);
    });
    await new Promise(r => setTimeout(r, 5000));

    let aspectId = aspectRt.options.address

    // Step6: bind honeyPotContract with the GuardAspect aspect
    //
    // Bind the HoneyPot asset management contract, deployed in Step1 (the contract being attacked),
    // to the security check contract deployed in Step5 on the blockchain.
    await honeyPotContract.bind({
        priority: 1,
        aspectId: aspectId,
        aspectVersion: 1,
    }).send({ from: honeypotDeployer, nonce: honeyPotNonceVal + 2 })
        .on('receipt', function (receipt) {
            console.log("=============== bind aspect ===============")
            console.log(receipt)
        })
        .on('transactionHash', (txHash) => {
            console.log("contract binding tx hash: ", txHash);
        });

    // wait for block committing
    await new Promise(r => setTimeout(r, 5000));

    // Step7. call "Attach" contract method "attack"
    //
    // The logic within the attach function will be triggered.
    // Utilizing the code from the HoneyPot contract,
    // an attempt is made to bypass the balance restriction and perform a withdrawal activity.
    try {
        await attackContract.methods.attack()
            .send({ from: accounts[1], nonce: attackNonceVal + 2 })
            .on('receipt', (receipt) => {
                console.log("=============== Hacker Withdraw 10 ether ===============")
                console.log(receipt);
            })
            .on('transactionHash', (txHash) => {
                console.log("Call contract tx hash: ", txHash);
            });
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
    const balance = await web3.atl.getBalance(honeypotAddress);
    const attackBalance = await web3.atl.getBalance(attackAddress);
    console.log("==== honeyPotContract  balance info===" + web3.utils.fromWei(balance, 'ether') + ' ETH')
    console.log("==== attackAddress  balance info===" + web3.utils.fromWei(attackBalance, 'ether') + ' ETH')

}

f().then();
`