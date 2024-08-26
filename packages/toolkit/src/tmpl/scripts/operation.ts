export const OperationCallTmpl = `
"use strict"
const Web3 = require("@artela-next/web3");
const fs = require("fs");
var argv = require('yargs')
    .string('node')
    .string('skfile')
    .string('callData')
    .string('aspectId')
    .boolean('isCall')
    .string('gas')
    .argv;

async function operationCall() {
    // init connection to Artela node
    const configJson = JSON.parse(fs.readFileSync('./project.config.json', "utf-8").toString());

    let node = (argv.node) ? String(argv.node) : configJson.node;
    if (!node) {
        console.log("'node' cannot be empty, please set by the parameter or project.config.json")
        process.exit(0)
    }
    const web3 = new Web3(node);
    let gasPrice = await web3.eth.getGasPrice();


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
    let sender = web3.eth.accounts.privateKeyToAccount(pk.trim());
    web3.eth.accounts.wallet.add(sender.privateKey);

    // --callData {smart-contract-address}
    let callData = String(argv.callData)
    if (!callData || callData === 'undefined') {
        console.log("'callData' cannot be empty, please set by the parameter ' --callData 0xxxx'")
        process.exit(0)
    }

    // --aspectId {aspect-Id}
    let aspectId = String(argv.aspectId)
    if (!aspectId || aspectId === 'undefined') {
        console.log("'aspectId' cannot be empty, please set by the parameter' --aspectId 0xxxx'")
        process.exit(0)
    }
    
    const isCall = argv.isCall;
    const aspectContract = new web3.atl.aspectCore();
    const aspectInstance = new web3.atl.Aspect(aspectId);
    const operation = aspectInstance.operation(callData);

    if (isCall) {
        let callResult = await web3.eth.call({
            from: sender.address,
            to: aspectContract.options.address,
            data: operation.encodeABI()
        });
        const rest = web3.eth.abi.decodeParameter('string', callResult);
        console.log('operation call result: ' + rest);
    } else {
        const tx = {
          from: sender.address,
          to: aspectContract.options.address,
          data: operation.encodeABI(),
          gasPrice,
          gas: argv.gas ? parseInt(argv.gas) : await operation.estimateGas({from: sender.address})
        }
        
        const signedTx = await web3.eth.accounts.signTransaction(tx, sender.privateKey);
    
        await web3.eth.sendSignedTransaction(signedTx.rawTransaction)
            .on('receipt', receipt => {
                console.log(receipt);
            });
    }
}

operationCall().then();
`;
