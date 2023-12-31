// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0
//   protoc        v4.25.1

import { Protobuf, Reader, Writer } from 'as-proto/assembly';

export class UintData {
  static encode(message: UintData, writer: Writer): void {
    writer.uint32(8);
    writer.uint64(message.data);
  }

  static decode(reader: Reader, length: i32): UintData {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new UintData();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.data = reader.uint64();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  data: u64;

  constructor(data: u64 = 0) {
    this.data = data;
  }
}

export function encodeUintData(message: UintData): Uint8Array {
  return Protobuf.encode(message, UintData.encode);
}

export function decodeUintData(buffer: Uint8Array): UintData {
  return Protobuf.decode<UintData>(buffer, UintData.decode);
}
