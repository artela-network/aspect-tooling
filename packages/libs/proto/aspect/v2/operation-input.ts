// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0
//   protoc        v4.25.1

import { Writer, Reader } from 'as-proto/assembly';
import { WithFromTxInput } from './with-from-tx-input';
import { BlockInput } from './block-input';

export class OperationInput {
  static encode(message: OperationInput, writer: Writer): void {
    const tx = message.tx;
    if (tx !== null) {
      writer.uint32(10);
      writer.fork();
      WithFromTxInput.encode(tx, writer);
      writer.ldelim();
    }

    const block = message.block;
    if (block !== null) {
      writer.uint32(18);
      writer.fork();
      BlockInput.encode(block, writer);
      writer.ldelim();
    }

    writer.uint32(26);
    writer.bytes(message.callData);
  }

  static decode(reader: Reader, length: i32): OperationInput {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new OperationInput();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.tx = WithFromTxInput.decode(reader, reader.uint32());
          break;

        case 2:
          message.block = BlockInput.decode(reader, reader.uint32());
          break;

        case 3:
          message.callData = reader.bytes();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  tx: WithFromTxInput | null;
  block: BlockInput | null;
  callData: Uint8Array;

  constructor(
    tx: WithFromTxInput | null = null,
    block: BlockInput | null = null,
    callData: Uint8Array = new Uint8Array(0),
  ) {
    this.tx = tx;
    this.block = block;
    this.callData = callData;
  }
}