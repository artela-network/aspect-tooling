// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0
//   protoc        v4.23.3

import { Writer, Reader } from "as-proto/assembly";

export class Result {
  static encode(message: Result, writer: Writer): void {
    writer.uint32(8);
    writer.bool(message.success);

    writer.uint32(18);
    writer.string(message.error);
  }

  static decode(reader: Reader, length: i32): Result {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new Result();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.success = reader.bool();
          break;

        case 2:
          message.error = reader.string();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  success: bool;
  error: string;

  constructor(success: bool = false, error: string = "") {
    this.success = success;
    this.error = error;
  }
}
