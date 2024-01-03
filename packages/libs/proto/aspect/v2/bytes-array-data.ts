// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0
//   protoc        v4.25.1

import { Protobuf, Reader, Writer } from 'as-proto/assembly';

export class BytesArrayData {
  static encode(message: BytesArrayData, writer: Writer): void {
    const data = message.data;
    if (data.length !== 0) {
      for (let i: i32 = 0; i < data.length; ++i) {
        writer.uint32(10);
        writer.bytes(data[i]);
      }
    }
  }

  static decode(reader: Reader, length: i32): BytesArrayData {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new BytesArrayData();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.data.push(reader.bytes());
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  data: Array<Uint8Array>;

  constructor(data: Array<Uint8Array> = []) {
    this.data = data;
  }
}

export function encodeBytesArrayData(message: BytesArrayData): Uint8Array {
  return Protobuf.encode(message, BytesArrayData.encode);
}

export function decodeBytesArrayData(buffer: Uint8Array): BytesArrayData {
  return Protobuf.decode<BytesArrayData>(buffer, BytesArrayData.decode);
}
