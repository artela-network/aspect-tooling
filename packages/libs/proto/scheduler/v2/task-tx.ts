// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0
//   protoc        v4.23.2

import { Writer, Reader } from "as-proto/assembly";

export class TaskTx {
  static encode(message: TaskTx, writer: Writer): void {
    writer.uint32(8);
    writer.int64(message.blockHeight);

    writer.uint32(18);
    writer.string(message.txHash);
  }

  static decode(reader: Reader, length: i32): TaskTx {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new TaskTx();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.blockHeight = reader.int64();
          break;

        case 2:
          message.txHash = reader.string();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  blockHeight: i64;
  txHash: string;

  constructor(blockHeight: i64 = 0, txHash: string = "") {
    this.blockHeight = blockHeight;
    this.txHash = txHash;
  }
}
