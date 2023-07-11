export const ContractDeployTmpl = `
    
"use strict"

// import required libs
const fs = require('fs');
const Web3 = require("@artela/web3");
var argv = require('yargs')
    .string('node')
    .string('sender')
    .string('bytecode')
    .string('abi')
    .string('gasPrice')
    .string('gas')
    .argv;


async function deploy() {

    const configJson = JSON.parse(fs.readFileSync('./project.config.json', "utf-8").toString());
    // init connection to Artela node
    let node = (argv.node)?String(argv.node):configJson.node;
    if(!node){
        console.log("'node' cannot be empty, please set by the parameter or artela.config.json")
        process.exit(0)
    }
    const web3 = new Web3(node);

    const deployParams = {
        data: null,
        arguments:null,
    }
    // get bytecode by path  --bytecode  ./build/contract/xxx.bin
    let bytecodePath =String(argv.bytecode)
    let byteTxt=""
    if(!bytecodePath){
        console.log("'bytecode' cannot be empty, please set by the parameter ' --bytecode ./build/contract/xxx.bin'")
        process.exit(0)
    }else {
        byteTxt = fs.readFileSync(bytecodePath,"utf-8");
        if(!byteTxt){
            console.log("bytecode cannot be empty")
            process.exit(0)
        }
        deployParams.data=byteTxt
    }
    // --args [55]
    const inputs = argv.args;
    if(inputs && inputs!=='undefined') {
        deployParams.arguments=JSON.parse(inputs)
    }

    //--abi ./build/contract/xxx.abi
    let abiPath =String(argv.abi)
    let abiTxt=""
    if(!abiPath){
        console.log("'abi' cannot be empty, please set by the parameter ' --abi ./build/contract/xxx.abi'")
        process.exit(0)
    }else {
         abiTxt = fs.readFileSync(abiPath,"utf-8");
        if(!abiTxt){
            console.log("'abi' json cannot be empty")
            process.exit(0)
        }
    }

    //--sender 0x99999999999999999999
    let account =String(argv.sender)
    if(!account || account==='undefined') {
        console.log("'account' cannot be empty, please set by the parameter ' --sender 0x9999999999999999999999999999999999999999'")
        process.exit(0)
    }


    // retrieve current nonce
    let nonceVal = await web3.atl.getTransactionCount(account);

    const contractOptions = {
        from: account,
        nonce: nonceVal,
        gasPrice:  '1000000000',
        gas:  4000000,
    };

    //--gasPrice 1000000
    if(argv.gasPrice && argv.gasPrice!=='undefined') {
        contractOptions.gasPrice=argv.gasPrice;
    }
    //--gas 20000
    if(argv.gas && argv.gas!=='undefined') {
        contractOptions.gas=parseInt(argv.gas);
    }

    const contractAbi = JSON.parse(abiTxt);
    // instantiate an instance of demo contract
    let contractObj = new web3.atl.Contract(contractAbi);

    // deploy demo contract
    let schedule_instance = contractObj.deploy(deployParams).send(contractOptions);
    let contractAddress="";
    contractObj = await schedule_instance.on('receipt', function (receipt) {
        console.log("=============== deployed contract ===============");
        console.log(receipt);
        contractAddress= receipt.contractAddress
    }).on('transactionHash', (txHash) => {
        console.log("deploy contract tx hash: ", txHash);
    });
    console.log(\`--contractAccount \${account} --contractAddress \${contractAddress}\`);
}

deploy().then();

`