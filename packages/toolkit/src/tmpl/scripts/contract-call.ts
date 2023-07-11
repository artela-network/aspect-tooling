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
    .string('gasPrice')
    .string('gas')
    .string('method')
    .string('abi')
    .argv;


async function call() {
    // init connection to Artela node
    const configJson = JSON.parse(fs.readFileSync('./project.config.json', "utf-8").toString());
    // init connection to Artela node
    let node = (argv.node)?String(argv.node):configJson.node;
    if(!node){
        console.log("'node' cannot be empty, please set by the parameter or artela.config.json")
        process.exit(0)
    }
    const web3 = new Web3(node);

    //--sender 0x9999999999999999999999999999999999999999
    const account =String(argv.sender)
    if(!account || account==='undefined') {
        console.log("'sender' cannot be empty, please set by the parameter ' --sender 0x9999999999999999999999999999999999999999'")
        process.exit(0)
    }


    const contractOptions = {
        gasPrice:  '1000000000',
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

    // --contract 0x9999999999999999999999999999999999999999
    const contractAddr = argv.contract;
    if(!contractAddr){
        console.log("'contract address' cannot be empty, please set by the parameter ' --contract 0x9999999999999999999999999999999999999999'")
        process.exit(0)
    }

    // --abi xxx/xxx.abi
    const abiPath=String(argv.abi)
    let abi=null
    if(abiPath && abiPath!=='undefined') {
        abi = JSON.parse(fs.readFileSync(abiPath, "utf-8").toString());
    }

    // --args [55]
    const inputs = argv.args;
    let parameters=[];
    if(inputs && inputs!=='undefined') {
        parameters = JSON.parse(inputs);
    }
    //--method count
    const method = argv.method;
    if(!method || method==='undefined') {
        console.log("'method' cannot be empty, please set by the parameter ' --method {method-name}'")
        process.exit(0)
    }

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