// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0
//   protoc        v4.23.2

import { Writer, Reader } from "as-proto/assembly";

export class StateQueryRequest {
  static encode(message: StateQueryRequest, writer: Writer): void {
    writer.uint32(10);
    writer.string(message.addressEquals);

    writer.uint32(18);
    writer.string(message.hashEquals);
  }

  static decode(reader: Reader, length: i32): StateQueryRequest {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new StateQueryRequest();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.addressEquals = reader.string();
          break;

        case 2:
          message.hashEquals = reader.string();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  addressEquals: string;
  hashEquals: string;

  constructor(addressEquals: string = "", hashEquals: string = "") {
    this.addressEquals = addressEquals;
    this.hashEquals = hashEquals;
  }
}
