import web3 from '@artela/web3'
import assert from "assert";
import {RootDirectory, DeployContract, SendTx} from "../utils/base.js";
import {ContractCall} from "../bese-test.js";
import {
    isBloom,
    isUserEthereumAddressInBloom,
    isContractAddressInBloom,
    isTopic,
    isTopicInBloom,
    isInBloom,
} from 'ethereum-bloom-filters';

//const ws = new web3("wss://test-node.artela.network/ws");

//const ws = new web3("ws://localhost:8546");
//const ws = new web3("wss://evmos.drpc.org");



const result = await DeployContract({
    abiPath: RootDirectory + "/build/contract/Store.abi", bytePath: RootDirectory + "/build/contract/Store.bin"
})
assert.ok(result.contractAddress, "Deploy Store Contract fail");
console.log("==Deploy Store Contract Result== ", result)

//send tx
const storeVal = await SendTx({
    contract: result.contractAddress,
    abiPath: RootDirectory + "/build/contract/Store.abi",
    method: "Storage"
})

const callVal = await ContractCall({
    contract: result.contractAddress,
    abiPath: RootDirectory + "/build/contract/Store.abi",
    method: "Storage"
});
console.log("==== reuslt===",storeVal );


const logTopic = web3.utils.soliditySha3('LogTest(string)');

const hasTopic=isTopicInBloom(storeVal.logsBloom, logTopic)

console.log('Log included in block Bloom Filter:', hasTopic);
assert.ok(hasTopic,"Log included in block Bloom Filter");


// ws.eth.subscribe('logs', {
//     fromBlock:"0x846564",
//     address: "0x7E904F62253B09c183Ed0b9806C4902c296F7038",
//     topics: ['0x7e3bde2ba7aca4a8499608ca57f3b0c1c1c93ace63ffd3741a9fab204146fc9a']
// }, (error, resultLog) => {
//     if (error) return console.error(error);
//     console.log('==log=log', resultLog);
// }).on('data', (blockHeader) => {
//     console.log('==log=data', blockHeader);
// })
