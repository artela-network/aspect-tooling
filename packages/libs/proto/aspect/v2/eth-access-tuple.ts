// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0
//   protoc        v5.27.1

import { Writer, Reader } from "as-proto/assembly";

export class EthAccessTuple {
  static encode(message: EthAccessTuple, writer: Writer): void {
    writer.uint32(10);
    writer.bytes(message.address);

    const storageKeys = message.storageKeys;
    if (storageKeys.length !== 0) {
      for (let i: i32 = 0; i < storageKeys.length; ++i) {
        writer.uint32(18);
        writer.bytes(storageKeys[i]);
      }
    }
  }

  static decode(reader: Reader, length: i32): EthAccessTuple {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new EthAccessTuple();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.address = reader.bytes();
          break;

        case 2:
          message.storageKeys.push(reader.bytes());
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  address: Uint8Array;
  storageKeys: Array<Uint8Array>;

  constructor(
    address: Uint8Array = new Uint8Array(0),
    storageKeys: Array<Uint8Array> = []
  ) {
    this.address = address;
    this.storageKeys = storageKeys;
  }
}
