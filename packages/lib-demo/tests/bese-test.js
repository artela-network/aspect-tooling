//---- web3 init---

import fs from 'fs';
import Web3 from '@artela/web3';

const DefProjectConfig = "../project.config.json";
const DefPrivateKeyPath = "../privateKey.txt";
const DefGasLimit = 9000000;
const ASPECT_ADDR = "0x0000000000000000000000000000000000A27E14";

export function ConnectToANode(nodeConfig = DefProjectConfig) {

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


export async function DeployContract({
                                         nodeConfig = DefProjectConfig,
                                         abiPath = "",
                                         bytePath = "",
                                         args = [],
                                         skFile = DefPrivateKeyPath,
                                         gas = DefGasLimit
                                     }) {

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
    if (args) {
        deployParams.arguments = args
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

    const signedTokenTx = await web3.eth.accounts.signTransaction(tokenTx, account.privateKey);
    return await web3.eth.sendSignedTransaction(signedTokenTx.rawTransaction);
}

export async function DeployAspect({
                                       nodeConfig = DefProjectConfig,
                                       wasmPath = "../build/release.wasm",
                                       joinPoints = [],
                                       properties = [],
                                       skFile = DefPrivateKeyPath,
                                       gas = DefGasLimit
                                   }) {
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
    return  await web3.atl.sendSignedTransaction(signedTx.rawTransaction);

}


export async function UpgradeAspect({
                                        nodeConfig = DefProjectConfig,
                                        wasmPath = "",
                                        joinPoints = [],
                                        properties = [],
                                        aspectId = "",
                                        skFile = DefPrivateKeyPath,
                                        gas = DefGasLimit
                                    }) {
    const ARTELA_ADDR = "0x0000000000000000000000000000000000A27E14";

    const web3 = ConnectToANode(nodeConfig);
    const gasPrice = await web3.eth.getGasPrice();

    //--skFile ./build/privateKey.txt
    const pk = fs.readFileSync(skFile, 'utf-8');
    const account = web3.eth.accounts.privateKeyToAccount(pk.trim());
    web3.eth.accounts.wallet.add(account.privateKey);




    // --aspectId {aspect-Id}
    if (!aspectId || aspectId === 'undefined') {
        throw new Error("'aspectId' cannot be empty, please set by the parameter'0xxxx'")
    }

    //read wasm code
    let aspectCode = "";
    if (wasmPath) {
        aspectCode = fs.readFileSync(wasmPath, {encoding: "hex"});
    }
    if (!aspectCode || aspectCode === "" || aspectCode === 'undefined') {
        throw new Error("aspectCode cannot be empty.");
    }

    // to deploy aspect
    const aspect = new web3.atl.Aspect(aspectId);

    const deploy = await aspect.upgrade({
        data: '0x' + aspectCode,
        properties,
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
    return await web3.atl.sendSignedTransaction(signedTx.rawTransaction)
        .on('receipt', receipt => {
            console.log(receipt);
        });

}

export async function BindAspect({
                                     nodeConfig = DefProjectConfig,
                                     abiPath = "",
                                     contractAddress = "",
                                     aspectId = "",
                                     skFile = DefPrivateKeyPath,
                                     gas = DefGasLimit
                                 }) {
    const ASPECT_ADDR = "0x0000000000000000000000000000000000A27E14";
    const web3 = ConnectToANode(nodeConfig);

    const gasPrice = await web3.eth.getGasPrice();


    if (!fs.existsSync(skFile)) {
        throw new Error("'account' cannot be empty, please set by the parameter ' --skfile ./build/privateKey.txt'")
    }
    const pk = fs.readFileSync(skFile, 'utf-8');
    const sender = web3.eth.accounts.privateKeyToAccount(pk.trim());
    web3.eth.accounts.wallet.add(sender.privateKey);


    // --contract {smart-contract-address}
    if (!contractAddress || contractAddress === 'undefined') {
        throw new Error("'contractAddress' cannot be empty, please set by the parameter ' 0xxxx'")
    }

    if (!aspectId || aspectId === 'undefined') {
        throw new Error("'aspectId' cannot be empty, please set by the parameter' 0xxxx'")
    }

    let abi = null
    if (abiPath && abiPath !== 'undefined') {
        abi = JSON.parse(fs.readFileSync(abiPath, "utf-8").toString());
    } else {
        throw new Error("abiPath cannot be empty")
    }

    // do aspect bind
    const storageInstance = new web3.eth.Contract(abi, contractAddress);
    // bind the smart contract with aspect
    const bind = await storageInstance.bind({
        priority: 1,
        aspectId,
        aspectVersion: 1,
    })

    const tx = {
        from: sender.address,
        data: bind.encodeABI(),
        gasPrice,
        to: ASPECT_ADDR,
        gas
    }
    const signedTx = await web3.eth.accounts.signTransaction(tx, sender.privateKey);
    return await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
}


export async function UnBindAspect({
                                       nodeConfig = DefProjectConfig,
                                       contract = "",
                                       aspectId = "",
                                       skFile = DefPrivateKeyPath,
                                       gas = DefGasLimit
                                   }) {
    const web3 = ConnectToANode(nodeConfig);

    const gasPrice = await web3.eth.getGasPrice();


    if (!fs.existsSync(skFile)) {
        throw new Error("'account' cannot be empty, please set by the parameter ' --skfile ./build/privateKey.txt'")
    }
    const pk = fs.readFileSync(skFile, 'utf-8');
    const sender = web3.eth.accounts.privateKeyToAccount(pk.trim());
    web3.eth.accounts.wallet.add(sender.privateKey);


    // --contract {smart-contract-address}
    if (!contract || contract === 'undefined') {
        throw new Error("'contractAddress' cannot be empty, please set by the parameter ' 0xxxx'")
    }

    if (!aspectId || aspectId === 'undefined') {
        throw new Error("'aspectId' cannot be empty, please set by the parameter' 0xxxx'")
    }

    const aspectContract = new web3.atl.aspectCore();
    // bind the smart contract with aspect
    const bind = await aspectContract.unbind({
        aspectId,
        contract,
    })

    const tx = {
        from: sender.address,
        data: bind.encodeABI(),
        gasPrice,
        to: ASPECT_ADDR,
        gas
    }

    const signedTx = await web3.eth.accounts.signTransaction(tx, sender.privateKey);
    await web3.eth.sendSignedTransaction(signedTx.rawTransaction)
        .on('receipt', receipt => {
            console.log(receipt);
        });
    return true
}


export async function AspectsOf({
                                    nodeConfig = DefProjectConfig,
                                    contract = "",
                                    skFile = DefPrivateKeyPath
                                }) {
    // init connection to Artela node
    const web3 = ConnectToANode(nodeConfig);


    if (!fs.existsSync(skFile)) {
        throw new Error("'account' cannot be empty, please set by the parameter ' --skfile ./build/privateKey.txt'")
    }
    const pk = fs.readFileSync(skFile, 'utf-8');
    const sender = web3.eth.accounts.privateKeyToAccount(pk.trim());
    web3.eth.accounts.wallet.add(sender.privateKey);

    // --contract 0x9999999999999999999999999999999999999999
    if (!contract) {
        throw new Error("'contract address' cannot be empty, please set by the parameter ' --contract 0x9999999999999999999999999999999999999999'")
    }

    var aspectCore = web3.atl.aspectCore();

    return await aspectCore.methods["aspectsOf"](contract).call()
}

export async function VersionOf({
                                    nodeConfig = DefProjectConfig,
                                    aspectId = "",
                                    skFile = DefPrivateKeyPath
                                }) {
    // init connection to Artela node
    const web3 = ConnectToANode(nodeConfig);


    if (!fs.existsSync(skFile)) {
        throw new Error("'account' cannot be empty, please set by the parameter ' --skfile ./build/privateKey.txt'")
    }
    const pk = fs.readFileSync(skFile, 'utf-8');
    const sender = web3.eth.accounts.privateKeyToAccount(pk.trim());
    web3.eth.accounts.wallet.add(sender.privateKey);

    // --contract 0x9999999999999999999999999999999999999999
    if (!aspectId) {
        throw new Error("'aspectId' cannot be empty, please set by the parameter ' 0x9999999999999999999999999999999999999999'")
    }

    var aspectCore = web3.atl.aspectCore();

    return await aspectCore.methods["versionOf"](aspectId).call()
}

export async function BoundAddressesOf({
                                           nodeConfig = DefProjectConfig,
                                           aspectId = "",
                                           skFile = DefPrivateKeyPath
                                       }) {
    // init connection to Artela node
    const web3 = ConnectToANode(nodeConfig);


    if (!fs.existsSync(skFile)) {
        throw new Error("'account' cannot be empty, please set by the parameter ' --skfile ./build/privateKey.txt'")
    }
    const pk = fs.readFileSync(skFile, 'utf-8');
    const sender = web3.eth.accounts.privateKeyToAccount(pk.trim());
    web3.eth.accounts.wallet.add(sender.privateKey);

    // --contract 0x9999999999999999999999999999999999999999
    if (!aspectId) {
        throw new Error("'boundAddressesOf' cannot be empty, please set by the parameter ' 0x9999999999999999999999999999999999999999'")
    }

    var aspectCore = web3.atl.aspectCore();

    return await aspectCore.methods["boundAddressesOf"](aspectId).call()
}


export async function ContractCall({
                                       nodeConfig = DefProjectConfig,
                                       contract = "",
                                       abiPath = "",
                                       method = "",
                                       args = [],
                                       skFile = DefPrivateKeyPath
                                   }) {
    // init connection to Artela node
    const web3 = ConnectToANode(nodeConfig);


    if (!fs.existsSync(skFile)) {
        throw new Error("'account' cannot be empty, please set by the parameter ' --skfile ./build/privateKey.txt'")
    }
    const pk = fs.readFileSync(skFile, 'utf-8');
    const sender = web3.eth.accounts.privateKeyToAccount(pk.trim());
    web3.eth.accounts.wallet.add(sender.privateKey);

    // --contract 0x9999999999999999999999999999999999999999
    if (!contract) {
        throw new Error("'contract address' cannot be empty, please set by the parameter ' --contract 0x9999999999999999999999999999999999999999'")
    }

    // --abi xxx/xxx.abi
    let abi = null
    if (abiPath && abiPath !== 'undefined') {
        abi = JSON.parse(fs.readFileSync(abiPath, "utf-8").toString());
    } else {
        throw new Error("'abi' cannot be empty, please set by the parameter abiPath")
    }

    //--method count
    if (!method || method === 'undefined') {
        throw new Error("'method' cannot be empty, please set by the parameter ' --method {method-name}'")
    }
    const storageInstance = new web3.eth.Contract(abi, contract);
    return await storageInstance.methods[method](...args).call()
}


export async function SendTx({
                                 nodeConfig = DefProjectConfig,
                                 contract = "",
                                 abiPath = "",
                                 method = "",
                                 args = [],
                                 skFile = DefPrivateKeyPath,
                                 gas = DefGasLimit,
                                 value=""
                             }) {
    // init connection to Artela node
    const web3 = ConnectToANode(nodeConfig);

    const gasPrice = await web3.eth.getGasPrice();

    if (!fs.existsSync(skFile)) {
        throw new Error("'account' cannot be empty, please set by the parameter ' --skfile ./build/privateKey.txt'")
    }
    const pk = fs.readFileSync(skFile, 'utf-8');
    const sender = web3.eth.accounts.privateKeyToAccount(pk.trim());
    web3.eth.accounts.wallet.add(sender.privateKey);

    // --contract 0x9999999999999999999999999999999999999999
    if (!contract) {
        throw new Error("'contract address' cannot be empty, please set by the parameter ' --contract 0x9999999999999999999999999999999999999999'")
    }

    // --abi xxx/xxx.abi
    let abi = null
    if (abiPath && abiPath !== 'undefined') {
        abi = JSON.parse(fs.readFileSync(abiPath, "utf-8").toString());
    } else {
        throw new Error("'abi' cannot be empty, please set by the parameter abiPath")
    }

    //--method count
    if (!method || method === 'undefined') {
        throw new Error("'method' cannot be empty, please set by the parameter ' --method {method-name}'")
    }
    const storageInstance = new web3.eth.Contract(abi, contract);

    const instance = storageInstance.methods[method](...args);

    const tx = {
        from: sender.address,
        to: contract,
        data: instance.encodeABI(),
        gasPrice,
        gas
    }
    if(value!==""){
        tx.value=value
    }

    const signedTx = await web3.eth.accounts.signTransaction(tx, sender.privateKey);

    return await web3.eth.sendSignedTransaction(signedTx.rawTransaction)
        .on('receipt', receipt => {
            console.log(receipt);
        });
}


export async function EntryPoint({
                                     nodeConfig = DefProjectConfig,
                                     aspectId = "",
                                     operationData = "",
                                     skFile = DefPrivateKeyPath,
                                 }) {
    // init connection to Artela node
    const web3 = ConnectToANode(nodeConfig);


    if (!fs.existsSync(skFile)) {
        throw new Error("'account' cannot be empty, please set by the parameter ' --skfile ./build/privateKey.txt'")
    }
    const pk = fs.readFileSync(skFile, 'utf-8');
    const sender = web3.eth.accounts.privateKeyToAccount(pk.trim());
    web3.eth.accounts.wallet.add(sender.privateKey);

    // --contract 0x9999999999999999999999999999999999999999
    if (!aspectId) {
        throw new Error("aspectId cannot be empty, please set by the parameter ' 0x9999999999999999999999999999999999999999'")
    }
    const aspectInstance = new web3.atl.Aspect(aspectId);

    const encodeABI = aspectInstance.operation(operationData).encodeABI();

    return  await web3.eth.call({
        to: ASPECT_ADDR, // contract address
        data: encodeABI
    });
}


