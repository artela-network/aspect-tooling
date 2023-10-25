export const BindTmpl = `

"use strict"
const Web3 = require("@artela/web3");
const fs = require("fs");
var argv = require('yargs')
    .string('node')
    .string('sender')
    .string('contract')
    .string('aspectId')
    .string('gasPrice')
    .string('gas')
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


    let contractAccount =String(argv.sender)
    if(!contractAccount || contractAccount==='undefined'){
        console.log("'sender' cannot be empty, please set by the parameter ' --sender 0xxxx'")
        process.exit(0)
    }

    let contractAddress =String(argv.contract)
    if(!contractAddress || contractAddress==='undefined'){
        console.log("'contractAddress' cannot be empty, please set by the parameter ' --contract 0xxxx'")
        process.exit(0)
    }

    let aspectId =String(argv.aspectId)
    if(!aspectId || aspectId==='undefined'){
        console.log("'aspectId' cannot be empty, please set by the parameter' --aspectId 0xxxx'")
        process.exit(0)
    }
    const contractOptions = {
        gasPrice:  '1000000010',
        gas:  4000000
    };
    // --gasPrice 2000000000
    if(argv.gasPrice && argv.gasPrice!=='undefined') {
        contractOptions.gasPrice=argv.gasPrice;
    }
    // --gas 2000000
    if(argv.gas && argv.gas!=='undefined') {
        contractOptions.gas=parseInt(argv.gas);
    }

    let contract = new Web3.eth.Contract([],
        contractAddress, contractOptions);
    let nonceVal = await Web3.eth.getTransactionCount(contractAccount);

    await contract.bind({
        priority: 1,
        aspectId: aspectId,
        aspectVersion: 1,
    }).send({ from: contractAccount, nonce: nonceVal  , ...contractOptions})
        .on('receipt', function (receipt) {
            console.log("=============== bind aspect ===============")
            console.log(receipt)
        })
        .on('transactionHash', (txHash) => {
            console.log("contract binding tx hash: ", txHash);
        });
}
f().then();
`;
