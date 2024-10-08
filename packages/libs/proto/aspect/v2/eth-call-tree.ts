// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0
//   protoc        v5.27.1

import { Writer, Reader } from "as-proto/assembly";
import { EthCallMessage } from "./eth-call-message";

export class EthCallTree {
  static encode(message: EthCallTree, writer: Writer): void {
    const calls = message.calls;
    for (let i: i32 = 0; i < calls.length; ++i) {
      writer.uint32(10);
      writer.fork();
      EthCallMessage.encode(calls[i], writer);
      writer.ldelim();
    }
  }

  static decode(reader: Reader, length: i32): EthCallTree {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new EthCallTree();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.calls.push(EthCallMessage.decode(reader, reader.uint32()));
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  calls: Array<EthCallMessage>;

  constructor(calls: Array<EthCallMessage> = []) {
    this.calls = calls;
  }
}
