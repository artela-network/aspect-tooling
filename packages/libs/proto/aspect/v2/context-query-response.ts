// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0
//   protoc        v4.23.2

import { Writer, Reader } from "as-proto/assembly";
import { RunResult } from "./run-result";
import { Any } from "../../google/protobuf/any";

export class ContextQueryResponse {
  static encode(message: ContextQueryResponse, writer: Writer): void {
    const result = message.result;
    if (result !== null) {
      writer.uint32(10);
      writer.fork();
      RunResult.encode(result, writer);
      writer.ldelim();
    }

    writer.uint32(18);
    writer.string(message.dataMessageType);

    const data = message.data;
    if (data !== null) {
      writer.uint32(26);
      writer.fork();
      Any.encode(data, writer);
      writer.ldelim();
    }
  }

  static decode(reader: Reader, length: i32): ContextQueryResponse {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new ContextQueryResponse();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.result = RunResult.decode(reader, reader.uint32());
          break;

        case 2:
          message.dataMessageType = reader.string();
          break;

        case 3:
          message.data = Any.decode(reader, reader.uint32());
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  result: RunResult | null;
  dataMessageType: string;
  data: Any | null;

  constructor(
    result: RunResult | null = null,
    dataMessageType: string = "",
    data: Any | null = null
  ) {
    this.result = result;
    this.dataMessageType = dataMessageType;
    this.data = data;
  }
}
