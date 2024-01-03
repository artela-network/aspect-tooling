import { Protobuf } from 'as-proto/assembly';
import { hexToUint8Array, IntArrayData, sys, uint8ArrayToHex } from '@artela/aspect-libs';

export function intArrayDataTest(): string {
  var intArrayData = new IntArrayData([3855]);
  var uint8Array = Protobuf.encode<IntArrayData>(intArrayData, IntArrayData.encode);
  return uint8ArrayToHex(uint8Array);
  // const extraEIPs = hexToUint8Array("088f1e");
  // const extraEIPsData = Protobuf.decode<IntArrayData>(uint8Array, IntArrayData.decode);
  // return extraEIPsData.data[0];
}

export function add(a: i32, b: i32): i32 {
  return a + b;
}
