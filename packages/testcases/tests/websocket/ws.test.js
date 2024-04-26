import web3 from '@artela/web3'
import assert from "assert";
import {RootDirectory, DeployContract, SendTx} from "../utils/base.js";

const ws = new web3("ws://localhost:8546");
// ws.eth.subscribe('newBlockHeaders', (error, blockHeader) => {
//     if (error) return console.error(error);
//     console.log('Successfully subscribed!', blockHeader);
// }).on('data', (blockHeader) => {
//     console.log('data: ', blockHeader);
// })

// const result = await DeployContract({
//     abiPath: RootDirectory + "/build/contract/Store.abi", bytePath: RootDirectory + "/build/contract/Store.bin"
// })
// assert.ok(result.contractAddress, "Deploy Store Contract fail");
// console.log("==Deploy Store Contract Result== ", result)

//send tx
SendTx({
    contract: "0xa8E5A49470805b58F393d4c4784aFC0bc0CadFdb",
    abiPath: RootDirectory + "/build/contract/Store.abi",
    method: "Storage"
})
// ws.eth.subscribe('logs', {
//     fromBlock: result.blockNumber,
//     address: result.contractAddress,
//     topics: []
// }, (error, resultLog) => {
//     if (error) return console.error(error);
//     console.log('==log=log', resultLog);
// }).on('data', (blockHeader) => {
//     console.log('==log=data', blockHeader);
// })
