// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0
//   protoc        v4.25.1

import { Writer, Reader } from 'as-proto/assembly';

export class BoolData {
  static encode(message: BoolData, writer: Writer): void {
    writer.uint32(8);
    writer.bool(message.data);
  }

  static decode(reader: Reader, length: i32): BoolData {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new BoolData();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.data = reader.bool();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  data: bool;

  constructor(data: bool = false) {
    this.data = data;
  }
}
