export const ContractDeployTmpl = `

"use strict"

// import required libs
const fs = require('fs');
const Web3 = require("@artela-next/web3");
var argv = require('yargs')
    .string('node')
    .string('skfile')
    .string('bytecode')
    .string('abi')
    .string('gas')
    .array('args')
    .parserConfiguration({
        "parse-numbers": false,
    })
    .argv;


async function deploy() {

    const configJson = JSON.parse(fs.readFileSync('./project.config.json', "utf-8").toString());
    // init connection to Artela node
    let node = (argv.node) ? String(argv.node) : configJson.node;
    if (!node) {
        console.log("'node' cannot be empty, please set by the parameter or artela.config.json")
        process.exit(0)
    }
    const web3 = new Web3(node);

    const deployParams = {
        data: null,
        arguments: null,
    }
    // get bytecode by path  --bytecode  ./build/contract/xxx.bin
    let bytecodePath = String(argv.bytecode)
    let byteTxt = ""
    if (!bytecodePath) {
        console.log("'bytecode' cannot be empty, please set by the parameter ' --bytecode ./build/contract/xxx.bin'")
        process.exit(0)
    } else {
        byteTxt = fs.readFileSync(bytecodePath, "utf-8").toString().trim();
        if (!byteTxt) {
            console.log("bytecode cannot be empty")
            process.exit(0)
        }
        if (byteTxt.startsWith("0x")) {
            byteTxt = byteTxt.slice(2);
        }
        deployParams.data = byteTxt.trim()
    }

    // --args [55]
    const inputs = argv.args;
    if (inputs && inputs !== 'undefined') {
        for (let i = 0; i < inputs.length; i++) {
            const input = inputs[i].trim();
            if (input.startsWith('[') || input.startsWith('{')) {
                deployParams.arguments.push(JSON.parse(input));
            } else {
                deployParams.arguments.push(input);
            }
        }
    }

    //--abi ./build/contract/xxx.abi
    let abiPath = String(argv.abi)
    let abiTxt = ""
    if (!abiPath) {
        console.log("'abi' cannot be empty, please set by the parameter ' --abi ./build/contract/xxx.abi'")
        process.exit(0)
    } else {
        abiTxt = fs.readFileSync(abiPath, "utf-8").toString().trim();
        if (!abiTxt) {
            console.log("'abi' json cannot be empty")
            process.exit(0)
        }
    }

    //--skfile ./build/privateKey.txt
    let senderPriKey = String(argv.skfile)
    if (!senderPriKey || senderPriKey === 'undefined') {
        senderPriKey = "privateKey.txt"
    }
    if (!fs.existsSync(senderPriKey)) {
        console.log("'account' cannot be empty, please set by the parameter ' --skfile ./build/privateKey.txt'")
        process.exit(0)
    }
    let pk = fs.readFileSync(senderPriKey, 'utf-8');
    let account = web3.eth.accounts.privateKeyToAccount(pk.trim());
    console.log("from address: ", account.address);
    web3.eth.accounts.wallet.add(account.privateKey);


    // deploy demo contract
    let contractAddress;
    {
        const contractAbi = JSON.parse(abiTxt);

        // instantiate an instance of contract
        let contract = new web3.eth.Contract(contractAbi);

        // deploy contract
        let deploy = contract.deploy(deployParams);
        let nonceVal = await web3.eth.getTransactionCount(account.address);

        let tx = {
            from: account.address,
            data: deploy.encodeABI(),
            nonce: nonceVal,
            gas: argv.gas ? parseInt(argv.gas) : await deploy.estimateGas({from: sender.address})
        }

        let signedTx = await web3.eth.accounts.signTransaction(tx, account.privateKey);
        console.log('deploy contract tx hash: ' + signedTx.transactionHash);
        await web3.eth.sendSignedTransaction(signedTx.rawTransaction)
            .on('receipt', receipt => {
                console.log(receipt);
                console.log("contract address: ", receipt.contractAddress);
                contractAddress = receipt.contractAddress;
            });
    }
    console.log(\`contractAddress: \${contractAddress}\`);

}

deploy().then();

`;
