export const  DeployTmpl=`


"use strict"
const Web3 = require("@artela/web3");
const fs = require("fs");
const argv = require('yargs')
    .string('node')
    .string('sender')
    .string('gasPrice')
    .string('gas')
    .string('wasm')
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

    //--sender 0x9999999999999999999999999999999999999999
    let aspectDeployer =String(argv.sender)
    if(!aspectDeployer || aspectDeployer==='undefined') {
        console.log("'sender' cannot be empty, please set by the parameter ' --sender 0x9999999999999999999999999999999999999999'")
        process.exit(0)
    }

    // set nonce value
    let nonceValAspectDeployer = await web3.atl.getTransactionCount(aspectDeployer);

    //
    //read wasm code
    let aspectCode="";
    //  --wasm  ./build/release.wasm
    let bytecodePath =String(argv.wasm)
    if(!bytecodePath){
        aspectCode = fs.readFileSync('./build/release.wasm', {
            encoding: "hex"
        });
    }else {
        aspectCode = fs.readFileSync(bytecodePath,"utf-8");
    }
    if(!aspectCode || aspectCode==="" ||aspectCode==='undefined'){
        console.log("aspectCode cannot be empty")
        process.exit(0)
    }

    const contractOptions = {
        from: aspectDeployer,
        nonce: nonceValAspectDeployer,
        gasPrice: argv.gasPrice || '1000000010',
        gas: parseInt(argv.gas) || 4000000
    };

    // to deploy aspect
    let aspect = new web3.atl.Aspect(
        web3.utils.aspectCoreAddr, contractOptions);

    let instance = aspect.deploy({
        data: '0x' + aspectCode,
        properties: [ { 'key': 'owner', 'value': aspectDeployer }]
    }).send(contractOptions);

    // print receipt
    let aspectRt = await instance.on('receipt', (receipt) => {
        console.log("=============== deployed aspect ===============");
        console.log(receipt);
    }).on('transactionHash', (txHash) => {
        console.log("deploy aspect tx hash: ", txHash);
    });
    // print aspect info
    console.log(\`--aspectAccount \${aspectDeployer}  --aspectId \${aspectRt.options.address}\`);
}
f().then();
`