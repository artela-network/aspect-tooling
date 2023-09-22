// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0
//   protoc        v4.23.2

import { Writer, Reader } from "as-proto/assembly";

export class GasMeter {
  static encode(message: GasMeter, writer: Writer): void {
    writer.uint32(8);
    writer.uint64(message.gasConsumed);

    writer.uint32(16);
    writer.uint64(message.gasConsumedToLimit);

    writer.uint32(24);
    writer.uint64(message.gasRemaining);

    writer.uint32(32);
    writer.uint64(message.limit);
  }

  static decode(reader: Reader, length: i32): GasMeter {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new GasMeter();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.gasConsumed = reader.uint64();
          break;

        case 2:
          message.gasConsumedToLimit = reader.uint64();
          break;

        case 3:
          message.gasRemaining = reader.uint64();
          break;

        case 4:
          message.limit = reader.uint64();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  gasConsumed: u64;
  gasConsumedToLimit: u64;
  gasRemaining: u64;
  limit: u64;

  constructor(
    gasConsumed: u64 = 0,
    gasConsumedToLimit: u64 = 0,
    gasRemaining: u64 = 0,
    limit: u64 = 0
  ) {
    this.gasConsumed = gasConsumed;
    this.gasConsumedToLimit = gasConsumedToLimit;
    this.gasRemaining = gasRemaining;
    this.limit = limit;
  }
}