// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0
//   protoc        v4.25.1

import { Protobuf, Reader, Writer } from 'as-proto/assembly';

export class WithFromTxInput {
  static encode(message: WithFromTxInput, writer: Writer): void {
    writer.uint32(10);
    writer.bytes(message.hash);

    writer.uint32(18);
    writer.bytes(message.to);

    writer.uint32(26);
    writer.bytes(message.from);
  }

  static decode(reader: Reader, length: i32): WithFromTxInput {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new WithFromTxInput();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.hash = reader.bytes();
          break;

        case 2:
          message.to = reader.bytes();
          break;

        case 3:
          message.from = reader.bytes();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  hash: Uint8Array;
  to: Uint8Array;
  from: Uint8Array;

  constructor(
    hash: Uint8Array = new Uint8Array(0),
    to: Uint8Array = new Uint8Array(0),
    from: Uint8Array = new Uint8Array(0),
  ) {
    this.hash = hash;
    this.to = to;
    this.from = from;
  }
}

export function encodeWithFromTxInput(message: WithFromTxInput): Uint8Array {
  return Protobuf.encode(message, WithFromTxInput.encode);
}

export function decodeWithFromTxInput(buffer: Uint8Array): WithFromTxInput {
  return Protobuf.decode<WithFromTxInput>(buffer, WithFromTxInput.decode);
}
