// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0
//   protoc        v5.27.1

import { Writer, Reader } from "as-proto/assembly";

export class EthCallMessage {
  static encode(message: EthCallMessage, writer: Writer): void {
    writer.uint32(10);
    writer.bytes(message.from);

    writer.uint32(18);
    writer.bytes(message.to);

    writer.uint32(26);
    writer.bytes(message.data);

    writer.uint32(32);
    writer.uint64(message.gas);

    writer.uint32(42);
    writer.bytes(message.value);

    writer.uint32(50);
    writer.bytes(message.ret);

    writer.uint32(56);
    writer.uint64(message.gasUsed);

    writer.uint32(66);
    writer.string(message.error);

    writer.uint32(72);
    writer.uint64(message.index);

    writer.uint32(80);
    writer.int64(message.parentIndex);

    const childrenIndices = message.childrenIndices;
    if (childrenIndices.length !== 0) {
      for (let i: i32 = 0; i < childrenIndices.length; ++i) {
        writer.uint32(88);
        writer.uint64(childrenIndices[i]);
      }
    }
  }

  static decode(reader: Reader, length: i32): EthCallMessage {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new EthCallMessage();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.from = reader.bytes();
          break;

        case 2:
          message.to = reader.bytes();
          break;

        case 3:
          message.data = reader.bytes();
          break;

        case 4:
          message.gas = reader.uint64();
          break;

        case 5:
          message.value = reader.bytes();
          break;

        case 6:
          message.ret = reader.bytes();
          break;

        case 7:
          message.gasUsed = reader.uint64();
          break;

        case 8:
          message.error = reader.string();
          break;

        case 9:
          message.index = reader.uint64();
          break;

        case 10:
          message.parentIndex = reader.int64();
          break;

        case 11:
          message.childrenIndices.push(reader.uint64());
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  from: Uint8Array;
  to: Uint8Array;
  data: Uint8Array;
  gas: u64;
  value: Uint8Array;
  ret: Uint8Array;
  gasUsed: u64;
  error: string;
  index: u64;
  parentIndex: i64;
  childrenIndices: Array<u64>;

  constructor(
    from: Uint8Array = new Uint8Array(0),
    to: Uint8Array = new Uint8Array(0),
    data: Uint8Array = new Uint8Array(0),
    gas: u64 = 0,
    value: Uint8Array = new Uint8Array(0),
    ret: Uint8Array = new Uint8Array(0),
    gasUsed: u64 = 0,
    error: string = "",
    index: u64 = 0,
    parentIndex: i64 = 0,
    childrenIndices: Array<u64> = []
  ) {
    this.from = from;
    this.to = to;
    this.data = data;
    this.gas = gas;
    this.value = value;
    this.ret = ret;
    this.gasUsed = gasUsed;
    this.error = error;
    this.index = index;
    this.parentIndex = parentIndex;
    this.childrenIndices = childrenIndices;
  }
}
