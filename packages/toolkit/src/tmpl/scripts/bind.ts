export const  BindTmpl=`
"use strict"
const Web3 = require("@artela/web3");
const fs = require("fs");
var argv = require('yargs')
    .string('node')
    .string('contractAccount')
    .string('contractAddress')
    .string('aspectId')
    .argv;

async function f() {
    // init connection to Artela node
    const configJson = JSON.parse(fs.readFileSync('./project.config.json', "utf-8").toString());

    let node = (argv.node)?String(argv.node):configJson.node;
    if(!node){
        console.log("'node' cannot be empty, please set by the parameter or project.config.json")
        process.exit(0)
    }
    const web3 = new Web3(node);


    // init connection to Artela node

    let contractAccount =String(argv.contractAccount)
    if(!contractAccount){
        console.log("'contractAccount' cannot be empty, please set by the parameter ' --contractAccount 0xxxx'")
        process.exit(0)
    }

    let contractAddress =String(argv.contractAddress)
    if(!contractAddress){
        console.log("'contractAddress' cannot be empty, please set by the parameter ' --contractAddress 0xxxx'")
        process.exit(0)
    }

    let aspectId =String(argv.aspectId)
    if(!aspectId){
        console.log("'aspectId' cannot be empty, please set by the parameter' --aspectId 0xxxx'")
        process.exit(0)
    }
    let contract = new web3.atl.Contract([],
        contractAddress, {
            gasPrice: 1000000010, // Default gasPrice set by Geth
            gas: 4000000
        });
    let nonceVal = await web3.atl.getTransactionCount(contractAccount);

    await contract.bind({
        priority: 1,
        aspectId: aspectId,
        aspectVersion: 1,
    }).send({ from: contractAccount, nonce: nonceVal  })
        .on('receipt', function (receipt) {
            console.log("=============== bind aspect ===============")
            console.log(receipt)
        })
        .on('transactionHash', (txHash) => {
            console.log("contract binding tx hash: ", txHash);
        });
}
f().then();
`