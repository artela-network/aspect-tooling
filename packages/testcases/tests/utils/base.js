import path from 'path';
import fs from 'fs';
import Web3 from "@artela/web3";

// Recursively look up until you find a directory that contains package.json
function findRootDirectory(dir) {
    if (fs.existsSync(path.join(dir, 'package.json'))) {
        return dir;
    }

    // If the root directory of the file system has been reached, the search is stopped
    const parentDir = path.resolve(dir, '..');
    if (parentDir === dir) {
        throw new Error('the root of the project could not be found');
    }

    // keep looking up
    return findRootDirectory(parentDir);
}

const currDirectory = path.resolve('__dirname', '../');
// get the root directory of the project

export const RootDirectory = findRootDirectory(currDirectory);
export const DefProjectConfig = path.join(RootDirectory, "project.config.json");
export const DefPrivateKeyPath = path.join(RootDirectory, "privateKey.txt");
export const DefGasLimit = 20_000_000;
export const ASPECT_ADDR = "0x0000000000000000000000000000000000A27E14";

export function NewWeb3(nodeConfig = DefProjectConfig) {
    let node = ""
    if (nodeConfig.startsWith("http")) {
        node = nodeConfig
    } else {
        const configJson = JSON.parse(fs.readFileSync(nodeConfig, "utf-8").toString());
        node = configJson.node
    }
    if (!node) {
        throw new Error("'node' cannot be empty, please set by the parameter or artela.config.json");
    }
    return new Web3(node)
}

export function NewAccount(web3) {
    const account = web3.eth.accounts.create()
    web3.atl.accounts.wallet.add(account.privateKey);
    return account
}

export async function SendTx({
                                 nodeConfig = DefProjectConfig,
                                 contract = "",
                                 abiPath = "",
                                 method = "",
                                 args = [],
                                 skFile = DefPrivateKeyPath,
                                 gas = DefGasLimit,
                                 value = ""
                             }) {
    // init connection to Artela node
    const web3 = NewWeb3(nodeConfig);

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
    if (value !== "") {
        tx.value = value
    }

    const signedTx = await web3.eth.accounts.signTransaction(tx, sender.privateKey);

    return await web3.eth.sendSignedTransaction(signedTx.rawTransaction)
        .on('receipt', receipt => {
            console.log(receipt);
        });
}


export async function DeployContract({
                                         nodeConfig = DefProjectConfig,
                                         abiPath = "",
                                         bytePath = "",
                                         args = [],
                                         skFile = DefPrivateKeyPath,
                                         gas = DefGasLimit
                                     }) {

    const web3 = NewWeb3(nodeConfig);

    const deployParams = {
        data: null,
        arguments: null,
    }

    let byteTxt = fs.readFileSync(bytePath, "utf-8").toString().trim();
    if (!byteTxt) {
        throw new Error("bytecode cannot be empty.");
    }
    if (byteTxt.startsWith("0x")) {
        byteTxt = byteTxt.slice(2);
    }
    if (byteTxt) {
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