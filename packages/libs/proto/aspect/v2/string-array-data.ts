// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0
//   protoc        v4.23.2

import { Writer, Reader } from "as-proto/assembly";

export class StringArrayData {
  static encode(message: StringArrayData, writer: Writer): void {
    const data = message.data;
    if (data.length !== 0) {
      for (let i: i32 = 0; i < data.length; ++i) {
        writer.uint32(10);
        writer.string(data[i]);
      }
    }
  }

  static decode(reader: Reader, length: i32): StringArrayData {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new StringArrayData();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.data.push(reader.string());
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  data: Array<string>;

  constructor(data: Array<string> = []) {
    this.data = data;
  }
}
