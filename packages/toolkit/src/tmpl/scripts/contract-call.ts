export const ContractCallTmpl = `


"use strict"

// import required libs
const fs = require('fs');
const Web3 = require('@artela/web3');
var argv = require('yargs')
    .string('node')
    .string('sender')
    .string('args')
    .string('contract')
    .string('inputs')
    .string('method')
    .string('abi')
    .argv;


async function call() {
    // init connection to Artela node
    const configJson = JSON.parse(fs.readFileSync('./project.config.json', "utf-8").toString());
    // init connection to Artela node
    let node = (argv.node)?String(argv.node):configJson.node;
    if(!node){
        console.log("'node' cannot be empty, please set by the parameter or project.config.json")
        process.exit(0)
    }
    const web3 = new Web3(node);


    const account = String(argv.sender)
    if(!account || account==='undefined') {
        console.log("'sender' cannot be empty, please set by the parameter ' --sender 0x9999999999999999999999999999999999999999'")
        process.exit(0)
    }

    // --args '{"gasPrice":1000000010,"gas":4000000}'
    let argsJson =String(argv.args)
    let gasPrice=null
    let gas=null
    if(argsJson && argsJson!=='undefined') {
        let parseJson = JSON.parse(argsJson);
        if (parseJson) {
            gasPrice = parseJson.gasPrice
            gas = parseJson.gas
        }
    }
    const contractOptions = {
        gasPrice: gasPrice || '1000000000',
        gas: parseInt(gas) || 4000000
    };

    const contractAddr = argv.contract;
    if(!contractAddr || contractAddr==='undefined') {
        console.log("'contractAddr' cannot be empty, please set by the parameter ' --contract 0x9999999999999999999999999999999999999999'")
        process.exit(0)
    }
    const abiPath=String(argv.abi)
    let abi=null
    if(abiPath && abiPath!=='undefined') {
         abi = JSON.parse(fs.readFileSync(abiPath, "utf-8").toString());
    }

    const inputs = argv.inputs;
    let parameters=[];
    if(inputs && inputs!=='undefined') {
        parameters = JSON.parse(inputs);
    }
    const method = argv.method;

    // retrieve current nonce
    const nonceVal = await web3.atl.getTransactionCount(account);

    // instantiate an instance of contract
    let contract = new web3.atl.Contract(abi, contractAddr);

    // invoke contract method
    let instance = contract.methods[method](...parameters).send({ from: account, nonce: nonceVal, ...contractOptions });
    contract = await instance.on('receipt', function (receipt) {
        console.log("receipt: ", receipt);
    }).on('transactionHash', (txHash) => {
        console.log("tx hash: ", txHash);
    });

}

call().then();
`