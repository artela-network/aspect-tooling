import assert from 'node:assert/strict'
import {TestRpc} from "./base.test.js";
import {DeployContract} from "../bese-test.js";
import { RootDirectory} from "../utils/base.js";

const protocol = {
    jsonrpc: '2.0',
    id: 50,
    method: 'eth_protocolVersion',
    params: [],
};


function resultNotEmptyFunc(response) {
    assert.ok(response.result, 'response should not be null');
}

let res = await TestRpc(protocol, resultNotEmptyFunc);
console.log(res)

const sync = {"jsonrpc": "2.0", "id": 51, "method": "eth_syncing", "params": []};
res = await TestRpc(sync);
console.log(res)

const gasPrice = {"jsonrpc": "2.0", "id": 52, "method": "eth_gasPrice", "params": []};
res = await TestRpc(gasPrice);
console.log(res)

const accounts = {"jsonrpc": "2.0", "id": 53, "method": "eth_accounts", "params": []};
const accountRes = await TestRpc(accounts);
console.log(accountRes)

const blockNumber = {"jsonrpc": "2.0", "id": 54, "method": "eth_blockNumber", "params": []};
res = await TestRpc(blockNumber);
console.log(res)

const eth_getBalance = {
    "jsonrpc": "2.0",
    "id": 55,
    "method": "eth_getBalance",
    "params": [accountRes.result[2], "latest"]
};
res = await TestRpc(eth_getBalance);
console.log(res)


const result = await DeployContract({
    abiPath: RootDirectory + "/build/contract/Store.abi", bytePath: RootDirectory + "/build/contract/Store.bin"
})
assert.ok(result.contractAddress, "Deploy Store Contract fail");
console.log("==Deploy Store Contract Result== ", result)

const eth_getStorageAt = {
    "jsonrpc": "2.0",
    "id": 56,
    "method": "eth_getStorageAt",
    "params": [result.contractAddress, '0x0', "latest"]
};
res = await TestRpc(eth_getStorageAt);
console.log(res)

const eth_getStorageAt2 = {
    "jsonrpc": "2.0",
    "id": 56,
    "method": "eth_getStorageAt",
    "params": [result.contractAddress, '0x6661e9d6d8b923d5bbaab1b96e1dd51ff6ea2a93520fdc9eb75d059238b8c5e9', "latest"]
};
res = await TestRpc(eth_getStorageAt2);
console.log(res)

const fromTxCount = {
    "jsonrpc": "2.0",
    "id": 57,
    "method": "eth_getTransactionCount",
    "params": [result.from, "latest"]
}
res = await TestRpc(fromTxCount);
console.log(res)

const txCount = {
    "jsonrpc": "2.0",
    "id": 57,
    "method": "eth_getBlockTransactionCountByNumber",
    "params": ['0x' + result.blockNumber.toString(16)]
}
res = await TestRpc(txCount);
console.log(res)


const constHash = {
    "jsonrpc": "2.0",
    "id": 59,
    "method": "eth_getBlockTransactionCountByHash",
    "params": [result.blockHash]
}
res = await TestRpc(constHash);
console.log(res)

const getCode = {
    "jsonrpc": "2.0",
    "id": 60,
    "method": "eth_getCode",
    "params": [result.from, '0x' + result.blockNumber.toString(16)]
}
res = await TestRpc(getCode);
console.log(res)

// ./build/artelad keys add gene
// ./build/artelad debug addr art1q4xrcwq9rjy3j093pt38d4celk8hk7dhlym3mj

const signtx = {
    "jsonrpc": "2.0",
    "id": 61,
    "method": "eth_sign",
    "params": ["0x054c3C38051C89193Cb10aE276d719Fd8F7b79b7", "0xdeadbeaf"]
}
res = await TestRpc(signtx);
console.log(res)


const transaction = {
    "jsonrpc": "2.0",
    "id": 62,
    "method": "eth_sendTransaction",
    "params": [{
        "from": result.from,
        "to": result.contractAddress,
        "value": "0xee3711be",
        "gasLimit": "0x5208",
        "gasPrice": "0x55ae82600"
    }]
}

res = await TestRpc(transaction);
console.log(res)

const rawTx = {
    "jsonrpc": "2.0",
    "id": 63,
    "method": "eth_sendRawTransaction",
    "params": ["0xf9ff74c86aefeb5f6019d77280bbb44fb695b4d45cfe97e6eed7acd62905f4a85034d5c68ed25a2e7a8eeb9baf1b8401e4f865d92ec48c1763bf649e354d900b1c"]
}

res = await TestRpc(rawTx);
console.log(res)

const rawCall = {
    "jsonrpc": "2.0",
    "id": 64,
    "method": "eth_call",
    "params": [{
        "from": "0x3b7252d007059ffc82d16d022da3cbf9992d2f70",
        "to": "0xddd64b4712f7c8f1ace3c145c950339eddaf221d",
        "gas": "0x5208",
        "gasPrice": "0x55ae82600",
        "value": "0x16345785d8a0000",
        "data": "0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675"
    }, "0x0"]
}

res = await TestRpc(rawCall);
console.log(res)

const estimateGas = {
    "jsonrpc": "2.0",
    "id": 65,
    "method": "eth_estimateGas",
    "params": [{
        "from": "0x0f54f47bf9b8e317b214ccd6a7c3e38b893cd7f0",
        "to": "0x3b7252d007059ffc82d16d022da3cbf9992d2f70",
        "value": "0x16345785d8a00000"
    }]
}
res = await TestRpc(estimateGas);
console.log(res)

const blockByNum = {"jsonrpc": "2.0", "id": 66, "method": "eth_getBlockByNumber", "params": ["0x1", false]}
res = await TestRpc(blockByNum);
console.log(res)


const blockHash = {
    "jsonrpc": "2.0",
    "id": 67,
    "method": "eth_getBlockByHash",
    "params": ["0x1b9911f57c13e5160d567ea6cf5b545413f96b95e43ec6e02787043351fb2cc4", false]
};
res = await TestRpc(blockHash);
console.log(res)

const txByHash =
    {
        "jsonrpc": "2.0",
        "id": 68,
        "method": "eth_getTransactionByHash",
        "params": ["0xec5fa15e1368d6ac314f9f64118c5794f076f63c02e66f97ea5fe1de761a8973"]
    };
res = await TestRpc(txByHash);
console.log(res)

const getTx = {
    "jsonrpc": "2.0",
    "id": 69,
    "method": "eth_getTransactionByBlockHashAndIndex",
    "params": ["0x1b9911f57c13e5160d567ea6cf5b545413f96b95e43ec6e02787043351fb2cc4", "0x0"]
}
res = await TestRpc(getTx);
console.log(res)


const rept = {
    "jsonrpc": "2.0",
    "id": 70,
    "method": "eth_getTransactionReceipt",
    "params": ["0xae64961cb206a9773a6e5efeb337773a6fd0a2085ce480a174135a029afea614"]
}
res = await TestRpc(rept);
console.log(res)

const filter = {
    "jsonrpc": "2.0",
    "id": 71,
    "method": "eth_newFilter",
    "params": [{"topics": ["0x0000000000000000000000000000000000000000000000000000000012341234"]}]
}
res = await TestRpc(filter);
console.log(res)

const newFilter = {"jsonrpc": "2.0", "id": 72, "method": "eth_newBlockFilter", "params": []}
res = await TestRpc(newFilter);
console.log(res)

const pendingFilter = {"jsonrpc": "2.0", "id": 73, "method": "eth_newPendingTransactionFilter", "params": []}
res = await TestRpc(pendingFilter);
console.log(res)


const filterUninstall = {
    "jsonrpc": "2.0",
    "id": 74,
    "method": "eth_uninstallFilter",
    "params": ["0xb91b6608b61bf56288a661a1bd5eb34a"]
}
res = await TestRpc(filterUninstall);
console.log(res)

const filterChanges = {
    "jsonrpc": "2.0",
    "id": 75,
    "method": "eth_getFilterChanges",
    "params": ["0x127e9eca4f7751fb4e5cb5291ad8b455"]
}
res = await TestRpc(filterChanges);
console.log(res)

const filterLogs = {
    "jsonrpc": "2.0",
    "id": 76,
    "method": "eth_getFilterLogs",
    "params": ["0x127e9eca4f7751fb4e5cb5291ad8b455"]
}
res = await TestRpc(filterLogs);
console.log(res)

const geLogs =
    {
        "jsonrpc": "2.0",
        "id": 77,
        "method": "eth_getLogs",
        "params": [{
            "topics": ["0x775a94827b8fd9b519d36cd827093c664f93347070a554f65e4a6f56cd738898", "0x0000000000000000000000000000000000000000000000000000000000000011"],
            "fromBlock": `"latest"`
        }]
    }
res = await TestRpc(geLogs);
console.log(res)

const coinbase = {"jsonrpc": "2.0", "id": 78, "method": "eth_coinbase", "params": []}
const coinbaseRes = await TestRpc(coinbase);
console.log(coinbaseRes)

const getProof = {
    "jsonrpc": "2.0",
    "id": 79,
    "method": "eth_getProof",
    "params": ["0x1234567890123456789012345678901234567890", ["0x0000000000000000000000000000000000000000000000000000000000000000", "0x0000000000000000000000000000000000000000000000000000000000000001"], `"latest"`]
}
const getProofRes = await TestRpc(getProof);
console.log(getProofRes)

