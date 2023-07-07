export const  RunTmpl=`
"use strict"

/**
 * This is a sample script shows:
 * 1. How to deploy a smart contract to Artela
 * 2. How to deploy an Aspect to Artela
 * 3. How to bind a smart contract with Aspect
 * 4. Execute a smart contract call with extra processing by Aspect
 */

const Web3 = require("@artela/web3");
const fs = require("fs");
const nodeUrl = "http://127.0.0.1:8545"; // <-- change this to Artela TestNet node or your own node

async function f() {
    // Step0: prepare environment
    // load compiled smart contract data and its ABI
    const counterByteCode = fs.readFileSync('./build/contract/Counter.bin', "utf-8");
    const counterAbiJson = fs.readFileSync('./build/contract/Counter.abi', "utf-8")
    const counterAbi = JSON.parse(counterAbiJson);
    const defaultOptions = {
        gasPrice: '1000000000',
        gas: 4000000
    };

    // init connection to Artela test net node
    const web3 = new Web3(nodeUrl);

    // retrieve accounts
    let accounts = await web3.atl.getAccounts();

    // retrieve current nonce
    let sender = accounts[0]
    let nonce = await web3.atl.getTransactionCount(sender);

    // Step1: deploy counter contract
    let counterContract = new web3.atl.Contract(counterAbi);
    let tx = counterContract.deploy({data: counterByteCode}).send(
        { from: sender, nonce: nonce++, ...defaultOptions});
    let counterAddress;
    counterContract = await tx.on('receipt', function (receipt) {
        console.log("=============== deployed contract ===============");
        console.log("contract address: " + receipt.contractAddress);
        console.log(receipt);
        counterAddress = receipt.contractAddress
    }).on('transactionHash', (txHash) => {
        console.log("deploy contract tx hash: ", txHash);
    });

    // Step2: deploy Aspect
    let aspectCode = fs.readFileSync('./build/release.wasm', {
        encoding: "hex"
    });
    let aspect = new web3.atl.Aspect();
    tx = aspect.deploy({ data: '0x' + aspectCode, properties: [] })
                         .send({ from: sender, nonce: nonce++, ...defaultOptions });

    let aspectInstance = await tx.on('receipt', (receipt) => {
        console.log("=============== deployed aspect ===============");
        console.log(receipt);
    }).on('transactionHash', (txHash) => {
        console.log("deploy aspect tx hash: ", txHash);
    });

    let aspectId = aspectInstance.options.address;
    console.log("aspect id: " + aspectId);

    // Step3: bind smart contract with Aspect
    await counterContract.bind({
        priority: 1,
        aspectId: aspectId,
        aspectVersion: 1,
    }).send({ from: sender, nonce: nonce++ })
        .on('receipt', function (receipt) {
            console.log("=============== bind aspect ===============")
            console.log(receipt)
        })
        .on('transactionHash', (txHash) => {
            console.log("contract binding tx hash: ", txHash);
        });

    // Step4. invoke Counter.count with an odd number
    try {
        await counterContract.methods.count(3)
            .send({ from: sender, nonce: nonce++, ...defaultOptions })
            .on('receipt', (receipt) => {
               console.log(receipt);
            })
            .on('transactionHash', (txHash) => {
                console.log("Call contract tx hash: ", txHash);
            });
    } catch (err) {
        console.log(err);
    }
    
    // Step5. invoke Counter.count with an even number
    try {
        await counterContract.methods.count(4)
            .send({ from: sender, nonce: nonce++, ...defaultOptions })
            .on('receipt', (receipt) => {
               console.log(receipt);
            })
            .on('transactionHash', (txHash) => {
                console.log("Call contract tx hash: ", txHash);
            });
    } catch (err) {
        console.log(err);
    }
}

f().then();
`