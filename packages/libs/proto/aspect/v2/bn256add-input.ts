// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0
//   protoc        v5.27.1

import { Writer, Reader } from "as-proto/assembly";
import { G1 } from "./g1";

export class Bn256AddInput {
  static encode(message: Bn256AddInput, writer: Writer): void {
    const a = message.a;
    if (a !== null) {
      writer.uint32(10);
      writer.fork();
      G1.encode(a, writer);
      writer.ldelim();
    }

    const b = message.b;
    if (b !== null) {
      writer.uint32(18);
      writer.fork();
      G1.encode(b, writer);
      writer.ldelim();
    }
  }

  static decode(reader: Reader, length: i32): Bn256AddInput {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new Bn256AddInput();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.a = G1.decode(reader, reader.uint32());
          break;

        case 2:
          message.b = G1.decode(reader, reader.uint32());
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  a: G1 | null;
  b: G1 | null;

  constructor(a: G1 | null = null, b: G1 | null = null) {
    this.a = a;
    this.b = b;
  }
}
