import assert from 'node:assert/strict'
import {TestRpc} from "./base.test.js";

/**
 * net_version
 */
const netVersion = {
    jsonrpc: '2.0',
    id: 44,
    method: 'net_version',
    params: [],
};

function assertVersionFunc(response) {
    const expectedResult = {
        jsonrpc: '2.0',
        id: 44,
        result: '11820'
    };
    assert.ok(response, 'response should not be null');
    assert.deepStrictEqual(
        {jsonrpc: response.jsonrpc, id: response.id},
        {jsonrpc: expectedResult.jsonrpc, id: expectedResult.id},
        'jsonrpc and id should be equal'
    );
    assert.ok(
        response.result.startsWith("118"),
        'version should have the same prefix'
    );
}

const res = await TestRpc(netVersion, assertVersionFunc);

console.log(res);

/***
 * net_peerCount
 */
const peerCount = {
    jsonrpc: '2.0',
    id: 45,
    method: 'net_peerCount',
    params: [],
};

function assertPeerCountFunc(response) {
    const expectedResult = {
        jsonrpc: '2.0',
        id: 45,
        result: '0x0'
    };
    assert.ok(response, 'response should not be null');
    assert.deepStrictEqual(
        {jsonrpc: response.jsonrpc, id: response.id},
        {jsonrpc: expectedResult.jsonrpc, id: expectedResult.id},
        'jsonrpc and id should be equal'
    );
    assert.ok(
        response.result.startsWith("0x"),
        'version should have the same prefix'
    );
}

const countjson = await TestRpc(peerCount, assertPeerCountFunc);
console.log(countjson);



/***
 * net_listening
 */
const listening = {
    jsonrpc: '2.0',
    id: 46,
    method: 'net_listening',
    params: [],
};

function assertListeningFunc(response) {
    const expectedResult = {
        jsonrpc: '2.0',
        id: 46,
        result: true
    };
    assert.ok(response, 'response should not be null');
    assert.deepStrictEqual(response,expectedResult,
        'jsonrpc and id should be equal'
    );

}
const listenjson = await TestRpc(listening,assertListeningFunc);
console.log(listenjson);


