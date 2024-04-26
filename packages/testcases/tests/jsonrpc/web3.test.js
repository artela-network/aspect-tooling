import assert from 'node:assert/strict'
import {TestRpc} from "./base.test.js";


const clientVersion = {
    jsonrpc: '2.0',
    id: 42,
    method: 'web3_clientVersion',
    params: [],
};

function assertClientVersionFunc(response) {
    const expectedResult = {
        jsonrpc: '2.0',
        id: 42,
        result: 'artelad/v0.4.7-rc6-3-g7e1055a/darwin-amd64/go1.21.3'
    };
    assert.ok(response, 'response should not be null');
    assert.deepStrictEqual(
        {jsonrpc: response.jsonrpc, id: response.id},
        {jsonrpc: expectedResult.jsonrpc, id: expectedResult.id},
        'jsonrpc and id should be equal'
    );
    assert.ok(
        response.result.startsWith(expectedResult.result.split('v0.4')[0]),
        'result should have the same prefix'
    );
}

const res = await TestRpc(clientVersion, assertClientVersionFunc);

console.log(res);

const sha3 = {
    jsonrpc: '2.0',
    id: 43,
    method: 'web3_sha3',
    params: ["0x68656c6c6f20776f726c64"],
};

function assertSh3Func(response) {
    const expectedResult = {
        jsonrpc: '2.0',
        id: 43,
        result: '0x47173285a8d7341e5e972fc677286384f802f8ef42a5ec5f03bbfa254cb01fad'
    };
    assert.ok(response, 'response should not be null');
    assert.deepStrictEqual(response,expectedResult,
        'sh3 response should be equal'
    );
}

const resSh3 = await TestRpc(sha3,assertSh3Func);
console.log(resSh3);

