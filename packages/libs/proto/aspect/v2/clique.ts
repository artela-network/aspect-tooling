// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0
//   protoc        v4.23.2

import { Writer, Reader } from "as-proto/assembly";

export class Clique {
  static encode(message: Clique, writer: Writer): void {
    writer.uint32(8);
    writer.uint64(message.period);

    writer.uint32(16);
    writer.uint64(message.epoch);
  }

  static decode(reader: Reader, length: i32): Clique {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new Clique();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.period = reader.uint64();
          break;

        case 2:
          message.epoch = reader.uint64();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  period: u64;
  epoch: u64;

  constructor(period: u64 = 0, epoch: u64 = 0) {
    this.period = period;
    this.epoch = epoch;
  }
}
