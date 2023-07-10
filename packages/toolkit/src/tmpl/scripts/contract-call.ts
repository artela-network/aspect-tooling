export const ContractCallTmpl = `

"use strict"

// import required libs
const fs = require('fs');
const Web3 = require('web3');
const yargs = require('yargs/yargs');

// parse args
const argv = yargs(process.argv.slice(2)).string('account').string('gasPrice').string('args').string('contract').argv;
const method = argv.method;
const contract = argv.contract;
const abi = JSON.parse(fs.readFileSync(argv.abi, "utf-8").toString());
const args = JSON.parse(argv.args);
let account = fs.readFileSync(argv.account, "utf-8").toString();
const contractOptions = {
    gasPrice: argv.gasPrice || '1000000000',
    gas: parseInt(argv.gas) || 4000000
};
const projectConfig = JSON.parse(fs.readFileSync('./project.config.json', "utf-8").toString());

async function call() {
    // init connection to Artela node
    const web3 = new Web3(projectConfig.node);

    if (!account) {
        // try retrieve account from config
        account = projectConfig.accounts && projectConfig.accounts.length > 0 ? projectConfig.accounts[0] : undefined;
        if (!account) {
            // try retrieve accounts from node
            let accounts = await web3.eth.getAccounts();
            account = accounts[0];
        }
    }

    // retrieve current nonce
    const nonceVal = await web3.eth.getTransactionCount(account);

    // instantiate an instance of contract
    let contract = new web3.atl.Contract(abi, contract);
    
    // deploy contract
    let instance = contract.methods[method](...args).send({ from: account, nonce: nonceVal, ...contractOptions });
    contract = await instance.on('receipt', function (receipt) {
        console.log("receipt: ", receipt);
    }).on('transactionHash', (txHash) => {
        console.log("tx hash: ", txHash);
    });
}

call().then();
`