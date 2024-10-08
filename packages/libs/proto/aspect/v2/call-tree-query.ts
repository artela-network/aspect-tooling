// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0
//   protoc        v5.27.1

import { Writer, Reader } from "as-proto/assembly";

export class CallTreeQuery {
  static encode(message: CallTreeQuery, writer: Writer): void {
    writer.uint32(8);
    writer.int64(message.callIdx);
  }

  static decode(reader: Reader, length: i32): CallTreeQuery {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new CallTreeQuery();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.callIdx = reader.int64();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  callIdx: i64;

  constructor(callIdx: i64 = 0) {
    this.callIdx = callIdx;
  }
}
