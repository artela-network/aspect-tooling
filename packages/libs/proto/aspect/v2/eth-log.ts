// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0
//   protoc        v4.23.2

import { Writer, Reader } from "as-proto/assembly";

export class EthLog {
  static encode(message: EthLog, writer: Writer): void {
    writer.uint32(10);
    writer.string(message.address);

    const topics = message.topics;
    if (topics.length !== 0) {
      for (let i: i32 = 0; i < topics.length; ++i) {
        writer.uint32(18);
        writer.string(topics[i]);
      }
    }

    writer.uint32(26);
    writer.bytes(message.data);

    writer.uint32(32);
    writer.uint64(message.blockNumber);

    writer.uint32(42);
    writer.string(message.txHash);

    writer.uint32(48);
    writer.uint64(message.txIndex);

    writer.uint32(58);
    writer.string(message.blockHash);

    writer.uint32(64);
    writer.uint64(message.index);

    writer.uint32(72);
    writer.bool(message.removed);
  }

  static decode(reader: Reader, length: i32): EthLog {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new EthLog();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.address = reader.string();
          break;

        case 2:
          message.topics.push(reader.string());
          break;

        case 3:
          message.data = reader.bytes();
          break;

        case 4:
          message.blockNumber = reader.uint64();
          break;

        case 5:
          message.txHash = reader.string();
          break;

        case 6:
          message.txIndex = reader.uint64();
          break;

        case 7:
          message.blockHash = reader.string();
          break;

        case 8:
          message.index = reader.uint64();
          break;

        case 9:
          message.removed = reader.bool();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  address: string;
  topics: Array<string>;
  data: Uint8Array;
  blockNumber: u64;
  txHash: string;
  txIndex: u64;
  blockHash: string;
  index: u64;
  removed: bool;

  constructor(
    address: string = "",
    topics: Array<string> = [],
    data: Uint8Array = new Uint8Array(0),
    blockNumber: u64 = 0,
    txHash: string = "",
    txIndex: u64 = 0,
    blockHash: string = "",
    index: u64 = 0,
    removed: bool = false
  ) {
    this.address = address;
    this.topics = topics;
    this.data = data;
    this.blockNumber = blockNumber;
    this.txHash = txHash;
    this.txIndex = txIndex;
    this.blockHash = blockHash;
    this.index = index;
    this.removed = removed;
  }
}