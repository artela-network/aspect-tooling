// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0
//   protoc        v5.27.1

import { Writer, Reader } from "as-proto/assembly";
import { EthStateChange } from "./eth-state-change";

export class EthStateChanges {
  static encode(message: EthStateChanges, writer: Writer): void {
    const all = message.all;
    for (let i: i32 = 0; i < all.length; ++i) {
      writer.uint32(10);
      writer.fork();
      EthStateChange.encode(all[i], writer);
      writer.ldelim();
    }
  }

  static decode(reader: Reader, length: i32): EthStateChanges {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new EthStateChanges();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.all.push(EthStateChange.decode(reader, reader.uint32()));
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  all: Array<EthStateChange>;

  constructor(all: Array<EthStateChange> = []) {
    this.all = all;
  }
}
