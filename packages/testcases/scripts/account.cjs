"use strict"

// import required libs
const fs = require('fs');
const Web3 = require("@artela/web3");
var argv = require('yargs')
    .string('skfile')
    .argv;


async function f() {
    const configJson = JSON.parse(fs.readFileSync('./project.config.json', "utf-8").toString());
    // init connection to Artela node
    let node = (argv.node) ? String(argv.node) : configJson.node;
    if (!node) {
        console.log("'node' cannot be empty, please set by the parameter or artela.config.json")
        process.exit(0)
    }
    const web3 = new Web3(node);


    // receiver is the EOA address or contract address that receive native tokens
    //--pkfile ./build/privateKey.txt
    let privateFile = String(argv.skfile)
    if (!privateFile || privateFile === 'undefined') {
        privateFile = "privateKey.txt"
    }

    console.log("=== " + privateFile)
    let account;
    if (fs.existsSync(privateFile)) {
        let pk = fs.readFileSync(privateFile, 'utf-8');
        account = web3.eth.accounts.privateKeyToAccount(pk.trim());
    } else {
        console.log("invalid private key")
        process.exit(0)
    }

    // add account to wallet
    web3.atl.accounts.wallet.add(account.privateKey);
    console.log("address: ", account.address);

    const receiver = account.address;

    // let sender = web3.eth.accounts.privateKeyToAccount("{private-key-have-Token}");
    // let senderAddr = sender.address

     let accounts = await web3.eth.getAccounts();
     let senderAddr= accounts[0]

    // retrieve current nonce
    var balance = await web3.eth.getBalance(senderAddr);
    console.log('===account balance:' + balance);


    // transfer account from bank to local account
    // the params of getTransactionCount is bank address.
    let bankNonce = await web3.atl.getTransactionCount(senderAddr);
    let tx1 = {
        'from': senderAddr,
        'to': receiver,
        'value': web3.utils.toWei('100', 'ether'), // transfer 1 eth
        'gas': 2000000,
        'gaslimit': 4000000,
        'nonce': bankNonce
    };

    // send transaction
    await web3.atl.sendTransaction(tx1).on('receipt', receipt => {
        console.log('transferred from bank to local account');
        console.log(receipt);
    });
}

f().then();



