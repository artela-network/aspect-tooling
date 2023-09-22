// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0
//   protoc        v4.23.2

import { Writer, Reader } from "as-proto/assembly";

export class GasInfo {
  static encode(message: GasInfo, writer: Writer): void {
    writer.uint32(8);
    writer.uint64(message.gasWanted);

    writer.uint32(16);
    writer.uint64(message.gasUsed);

    writer.uint32(24);
    writer.uint64(message.gas);
  }

  static decode(reader: Reader, length: i32): GasInfo {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new GasInfo();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.gasWanted = reader.uint64();
          break;

        case 2:
          message.gasUsed = reader.uint64();
          break;

        case 3:
          message.gas = reader.uint64();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  gasWanted: u64;
  gasUsed: u64;
  gas: u64;

  constructor(gasWanted: u64 = 0, gasUsed: u64 = 0, gas: u64 = 0) {
    this.gasWanted = gasWanted;
    this.gasUsed = gasUsed;
    this.gas = gas;
  }
}