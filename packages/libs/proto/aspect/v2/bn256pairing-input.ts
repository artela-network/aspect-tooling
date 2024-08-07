// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0
//   protoc        v5.27.1

import { Writer, Reader } from "as-proto/assembly";
import { G1 } from "./g1";
import { G2 } from "./g2";

export class Bn256PairingInput {
  static encode(message: Bn256PairingInput, writer: Writer): void {
    const cs = message.cs;
    for (let i: i32 = 0; i < cs.length; ++i) {
      writer.uint32(10);
      writer.fork();
      G1.encode(cs[i], writer);
      writer.ldelim();
    }

    const ts = message.ts;
    for (let i: i32 = 0; i < ts.length; ++i) {
      writer.uint32(18);
      writer.fork();
      G2.encode(ts[i], writer);
      writer.ldelim();
    }
  }

  static decode(reader: Reader, length: i32): Bn256PairingInput {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new Bn256PairingInput();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.cs.push(G1.decode(reader, reader.uint32()));
          break;

        case 2:
          message.ts.push(G2.decode(reader, reader.uint32()));
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  cs: Array<G1>;
  ts: Array<G2>;

  constructor(cs: Array<G1> = [], ts: Array<G2> = []) {
    this.cs = cs;
    this.ts = ts;
  }
}