// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0
//   protoc        v4.23.2

import { Writer, Reader } from "as-proto/assembly";
import { Schedule } from "./schedule";

export class ScheduleTask {
  static encode(message: ScheduleTask, writer: Writer): void {
    const schedule = message.schedule;
    if (schedule !== null) {
      writer.uint32(10);
      writer.fork();
      Schedule.encode(schedule, writer);
      writer.ldelim();
    }

    writer.uint32(16);
    writer.int64(message.blockHeight);

    writer.uint32(26);
    writer.string(message.txHash);

    writer.uint32(32);
    writer.uint64(message.txNonce);

    writer.uint32(42);
    writer.bytes(message.sdkTx);
  }

  static decode(reader: Reader, length: i32): ScheduleTask {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new ScheduleTask();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.schedule = Schedule.decode(reader, reader.uint32());
          break;

        case 2:
          message.blockHeight = reader.int64();
          break;

        case 3:
          message.txHash = reader.string();
          break;

        case 4:
          message.txNonce = reader.uint64();
          break;

        case 5:
          message.sdkTx = reader.bytes();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  schedule: Schedule | null;
  blockHeight: i64;
  txHash: string;
  txNonce: u64;
  sdkTx: Uint8Array;

  constructor(
    schedule: Schedule | null = null,
    blockHeight: i64 = 0,
    txHash: string = "",
    txNonce: u64 = 0,
    sdkTx: Uint8Array = new Uint8Array(0)
  ) {
    this.schedule = schedule;
    this.blockHeight = blockHeight;
    this.txHash = txHash;
    this.txNonce = txNonce;
    this.sdkTx = sdkTx;
  }
}
