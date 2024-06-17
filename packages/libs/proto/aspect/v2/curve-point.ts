// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0
//   protoc        v4.25.1

import { Protobuf, Reader, Writer } from 'as-proto/assembly';

export class CurvePoint {
  static encode(message: CurvePoint, writer: Writer): void {
    writer.uint32(10);
    writer.bytes(message.x);

    writer.uint32(18);
    writer.bytes(message.y);
  }

  static decode(reader: Reader, length: i32): CurvePoint {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new CurvePoint();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.x = reader.bytes();
          break;

        case 2:
          message.y = reader.bytes();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  x: Uint8Array;
  y: Uint8Array;

  constructor(
    x: Uint8Array = new Uint8Array(0),
    y: Uint8Array = new Uint8Array(0)
  ) {
    this.x = x;
    this.y = y;
  }
}

export function encodeCurvePoint(message: CurvePoint): Uint8Array {
  return Protobuf.encode(message, CurvePoint.encode);
}

export function decodeCurvePoint(buffer: Uint8Array): CurvePoint {
  return Protobuf.decode<CurvePoint>(buffer, CurvePoint.decode);
}