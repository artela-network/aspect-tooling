import fetch from 'node-fetch';
import fs from 'fs';
import test from 'node:test'
import assert from 'node:assert/strict'


const DefProjectConfig = "../../project.config.json";

export async function TestRpc(data, assertFunc, nodeConfig = DefProjectConfig) {

    let node = ""
    if (nodeConfig.startsWith("http")) {
        node = nodeConfig
    } else {
        const configJson = JSON.parse(fs.readFileSync(nodeConfig, "utf-8").toString());
        node = configJson.node
    }

    const response = await fetch(node, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then(response => response.json())

    // assert respsonse expectedResult
    if (assertFunc) {
        assertFunc(response);
    }

    return response
}

