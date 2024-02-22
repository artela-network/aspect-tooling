import {ConnectToANode, DeployAspect, EntryPoint} from "./bese-test.js";

import assert from "assert";

//将数值写入到视图中，获得其字节数组，大端字节序
function getUint8Array(len, setNum) {
    var buffer = new ArrayBuffer(len);  //指定字节长度
    setNum(new DataView(buffer));  //根据不同的类型调用不同的函数来写入数值
    return new Uint8Array(buffer); //创建一个字节数组，从缓存中拿取数据
}
//得到一个8位有符号整型的字节数组，大端字节序
function getInt8Bytes(num) {
    return getUint8Array(1, function (view) { view.setInt8(0, num); })
}
//得到一个8位无符号整型的字节数组，大端字节序
function getUint8Bytes(num) {
    return getUint8Array(1, function (view) { view.setUint8(0, num); })
}
//得到一个16位有符号整型的字节数组，大端字节序
function getInt16Bytes(num) {
    return getUint8Array(2, function (view) { view.setInt16(0, num); })
}

const aspect = await DeployAspect({
    wasmPath: "../build/operation-aspect.wasm",
    properties: [{'key': 'num', 'value':getInt16Bytes(100)} ],

})

console.log("==deploy Aspect Result== ", aspect)
assert.ok(aspect.aspectAddress, "deploy Aspect fail")


const rawcall = await EntryPoint({
    aspectId: aspect.aspectAddress,
    operationData: '0x1167c2e50dFE34b9Ad593d2c6694731097147317'
})
const web3 = ConnectToANode();
console.log(rawcall)
const rest = web3.eth.abi.decodeParameter('string', rawcall);
console.log(rawcall, rest)
assert.strictEqual(rest, "test")
