export const ContractDeployTmpl = `

"use strict"

// import required libs
const fs = require('fs');
const Web3 = require("@artela/web3");
var argv = require('yargs')
    .string('node')
    .string('account')
    .string('bytecode')
    .string('abi')
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

    // get bytecode by path
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
    }

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

    let account =String(argv.account)
    if(!account){
        console.log("'account' cannot be empty, please set by the parameter ' --account 0x9999999999999999999999999999999999999999'")
        process.exit(0)
    }

    // --args {"gasPrice":"10000000","gas":"400000"}
    let argsJson =String(argv.args)
    let gasPrice=null
    let gas=null
    if(argsJson){
        let parseJson = JSON.parse(argsJson);
        if(parseJson){
            gasPrice=parseJson.gasPrice
            gas=parseJson.gas
        }
    }
    const contractAbi = JSON.parse(abiTxt);
    const contractOptions = {
        data: byteTxt,
        gasPrice: gasPrice || '1000000000',
        gas: parseInt(gas) || 4000000
    };

    // retrieve current nonce
    let nonceVal = await web3.atl.getTransactionCount(account);

    // instantiate an instance of demo contract
    let contractObj = new web3.atl.Contract(contractAbi,null, contractOptions);

    // deploy demo contract
    let schedule_instance = contractObj.deploy().send({from: account, nonce: nonceVal});
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