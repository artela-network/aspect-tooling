// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0
//   protoc        v4.25.1

import { CurvePoint } from './curve-point';
import { Protobuf, Reader, Writer } from 'as-proto/assembly';

export class Bn256PairingInput {
  static encode(message: Bn256PairingInput, writer: Writer): void {
    const cs = message.cs;
    for (let i: i32 = 0; i < cs.length; ++i) {
      writer.uint32(10);
      writer.fork();
      CurvePoint.encode(cs[i], writer);
      writer.ldelim();
    }

    const ts1 = message.ts1;
    for (let i: i32 = 0; i < ts1.length; ++i) {
      writer.uint32(18);
      writer.fork();
      CurvePoint.encode(ts1[i], writer);
      writer.ldelim();
    }

    const ts2 = message.ts2;
    for (let i: i32 = 0; i < ts2.length; ++i) {
      writer.uint32(26);
      writer.fork();
      CurvePoint.encode(ts2[i], writer);
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
          message.cs.push(CurvePoint.decode(reader, reader.uint32()));
          break;

        case 2:
          message.ts1.push(CurvePoint.decode(reader, reader.uint32()));
          break;

        case 3:
          message.ts2.push(CurvePoint.decode(reader, reader.uint32()));
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  cs: Array<CurvePoint>;
  ts1: Array<CurvePoint>;
  ts2: Array<CurvePoint>;

  constructor(
    cs: Array<CurvePoint> = [],
    ts1: Array<CurvePoint> = [],
    ts2: Array<CurvePoint> = []
  ) {
    this.cs = cs;
    this.ts1 = ts1;
    this.ts2 = ts2;
  }
}

export function encodeBn256PairingInput(message: Bn256PairingInput): Uint8Array {
  return Protobuf.encode(message, Bn256PairingInput.encode);
}

export function decodeBn256PairingInput(buffer: Uint8Array): Bn256PairingInput {
  return Protobuf.decode<Bn256PairingInput>(buffer, Bn256PairingInput.decode);
}