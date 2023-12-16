//---- web3 init---

import fs from 'fs';
import Web3 from '@artela/web3';

export function ConnectToANode(nodeConfig = "../project.config.json") {

    let node = ""
    if (nodeConfig.startsWith("http")) {
        node = nodeConfig
    } else {
        const configJson = JSON.parse(fs.readFileSync(nodeConfig, "utf-8").toString());
        node = configJson.node
    }

// init connection to Artela node
    if (!node) {
        throw new Error("'node' cannot be empty, please set by the parameter or artela.config.json");
    }
    return new Web3(node)
}

export async function DeployContract({nodeConfig = "../project.config.json",abiPath="",bytePath="",args="", skFile="../privateKey.txt",gas=7_000_000}){

    const web3 = ConnectToANode(nodeConfig);

    const deployParams = {
        data:null,
        arguments:null,
    }

    let byteTxt = fs.readFileSync(bytePath, "utf-8").toString().trim();
    if (!byteTxt) {
        throw new Error("bytecode cannot be empty.");
    }
    if (byteTxt.startsWith("0x")) {
        byteTxt = byteTxt.slice(2);
    }
    if(byteTxt) {
        deployParams.data = byteTxt.trim()
    }
    if (args && args !== 'undefined') {
        deployParams.arguments = JSON.parse(args)
    }


    const abiTxt = fs.readFileSync(abiPath, "utf-8").toString().trim();
    if (!abiTxt) {
        throw new Error("'abi' json cannot be empty.");
    }
    const contractAbi = JSON.parse(abiTxt);


    // instantiate an instance of demo contract
    const tokenContract = new web3.eth.Contract(contractAbi);

    // deploy token contract
    const tokenDeploy = tokenContract.deploy(deployParams);

    const pk = fs.readFileSync(skFile, 'utf-8');
    const account = web3.eth.accounts.privateKeyToAccount(pk.trim());
    web3.eth.accounts.wallet.add(account.privateKey);
    const nonceVal = await web3.eth.getTransactionCount(account.address);

    const tokenTx = {
        from: account.address,
        data: tokenDeploy.encodeABI(),
        nonce: nonceVal,
        gas
    }

    let contractAddress
    const signedTokenTx = await web3.eth.accounts.signTransaction(tokenTx, account.privateKey);
    await web3.eth.sendSignedTransaction(signedTokenTx.rawTransaction)
        .on('receipt', receipt => {
            console.log(receipt);
            contractAddress = receipt.contractAddress;
        });

    return   {
        "contractAccount":account.address,
        contractAddress,
    }
}


export async function DeployAspect({nodeConfig = "../project.config.json",wasmPath="../build/release.wasm", joinPoints=[],properties=[], skFile = "../privateKey.txt",gas=9_000_000}){
    const ARTELA_ADDR = "0x0000000000000000000000000000000000A27E14";

    const web3 = ConnectToANode(nodeConfig);
    const gasPrice = await web3.eth.getGasPrice();

    //--skFile ./build/privateKey.txt
    const pk = fs.readFileSync(skFile, 'utf-8');
    const account = web3.eth.accounts.privateKeyToAccount(pk.trim());
    web3.eth.accounts.wallet.add(account.privateKey);

    //read wasm code
    let aspectCode = "";
    if (wasmPath) {
        aspectCode = fs.readFileSync(wasmPath, {encoding: "hex"});
    }
    if (!aspectCode || aspectCode === "" || aspectCode === 'undefined') {
        throw new Error("aspectCode cannot be empty.");
    }


    // to deploy aspect
    const aspect = new web3.atl.Aspect();
    const deploy = await aspect.deploy({
        data: '0x' + aspectCode,
        properties,
        paymaster: account.address,
        proof: '0x0',
        joinPoints
    });


    const tx = {
        from: account.address,
        data: deploy.encodeABI(),
        to: ARTELA_ADDR,
        gasPrice,
        gas
    }
    const signedTx = await web3.atl.accounts.signTransaction(tx, account.privateKey);
    const ret = await web3.atl.sendSignedTransaction(signedTx.rawTransaction)
        .on('receipt', receipt => {
            console.log(receipt);
        });

    return   {
        "aspectId": ret.aspectAddress
    }
}