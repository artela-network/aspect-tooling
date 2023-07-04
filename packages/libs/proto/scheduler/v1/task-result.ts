// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0
//   protoc        v4.23.3

import { Writer, Reader } from "as-proto/assembly";
import { TaskTx } from "./task-tx";

export class TaskResult {
  static encode(message: TaskResult, writer: Writer): void {
    const confirmTxs = message.confirmTxs;
    for (let i: i32 = 0; i < confirmTxs.length; ++i) {
      writer.uint32(10);
      writer.fork();
      TaskTx.encode(confirmTxs[i], writer);
      writer.ldelim();
    }

    writer.uint32(16);
    writer.uint64(message.count);
  }

  static decode(reader: Reader, length: i32): TaskResult {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new TaskResult();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.confirmTxs.push(TaskTx.decode(reader, reader.uint32()));
          break;

        case 2:
          message.count = reader.uint64();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  confirmTxs: Array<TaskTx>;
  count: u64;

  constructor(confirmTxs: Array<TaskTx> = [], count: u64 = 0) {
    this.confirmTxs = confirmTxs;
    this.count = count;
  }
}