import web3 from '@artela/web3'
import assert from "assert";
import {RootDirectory, DeployContract, SendTx} from "../utils/base.js";


//const ws = new web3("wss://test-node.artela.network/ws");

const ws = new web3("ws://47.254.68.8:8546");
//const ws = new web3("wss://evmos.drpc.org");

ws.eth.subscribe('newBlockHeaders', (error, blockHeader) => {
    if (error) return console.error(error);
}).on('data', (blockHeader) => {
    console.log('data: ', blockHeader);

})

// const result = await DeployContract({
//     abiPath: RootDirectory + "/build/contract/Store.abi", bytePath: RootDirectory + "/build/contract/Store.bin"
// })
// assert.ok(result.contractAddress, "Deploy Store Contract fail");
// console.log("==Deploy Store Contract Result== ", result)

//send tx
// SendTx({
//     contract: "0xa8E5A49470805b58F393d4c4784aFC0bc0CadFdb",
//     abiPath: RootDirectory + "/build/contract/Store.abi",
//     method: "Storage"
// })

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
