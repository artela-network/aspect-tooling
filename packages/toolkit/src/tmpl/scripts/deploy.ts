export const  DeployTmpl=`
"use strict"
const Web3 = require("@artela/web3");
const fs = require("fs");
const argv = require('yargs')
    .string('node')
    .string('aspectAccount')
    .argv;

async function f() {

    const configJson = JSON.parse(fs.readFileSync('./project.config.json', "utf-8").toString());

    // init connection to Artela node
    let node = (argv.node)?String(argv.node):configJson.node;
    if(!node){
        console.log("'node' cannot be empty, please set by the parameter or artela.config.json")
        process.exit(0)
    }
    const web3 = new Web3(node);

    let aspectDeployer =String(argv.aspectAccount)
    if(!aspectDeployer){
        console.log("'aspectAccount' cannot be empty, please set by the parameter' --aspectAccount 0xxxx' ")
        process.exit(0)
    }

    // set nonce value
    let nonceValAspectDeployer = await web3.atl.getTransactionCount(aspectDeployer);

    //read wasm code
    let aspectCode = fs.readFileSync('./build/release.wasm', {
        encoding: "hex"
    });

    // to deploy aspect
    let aspect = new web3.atl.Aspect(
        web3.utils.aspectCoreAddr, {
            gasPrice: 1000000010, // Default gasPrice set by Geth
            gas: 4000000
        });

    let instance = aspect.deploy({
        data: '0x' + aspectCode,
        properties: [ { 'key': 'owner', 'value': aspectDeployer }]
    }).send({ from: aspectDeployer, nonce: nonceValAspectDeployer });

    // print receipt
    let aspectRt = await instance.on('receipt', (receipt) => {
        console.log("=============== deployed aspect ===============");
        console.log(receipt);
    }).on('transactionHash', (txHash) => {
        console.log("deploy aspect tx hash: ", txHash);
    });
    // print aspect info
    console.log(\`Aspect Account: \${aspectDeployer},Aspect Id: \${aspectRt.options.address}\`);
}
f().then();
`