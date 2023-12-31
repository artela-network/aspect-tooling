// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0
//   protoc        v4.25.1

import { Protobuf, Reader, Writer } from 'as-proto/assembly';
import { BlockInput } from './block-input';
import { PreExecMessageInput } from './pre-exec-message-input';

export class PreContractCallInput {
  static encode(message: PreContractCallInput, writer: Writer): void {
    const call = message.call;
    if (call !== null) {
      writer.uint32(10);
      writer.fork();
      PreExecMessageInput.encode(call, writer);
      writer.ldelim();
    }

    const block = message.block;
    if (block !== null) {
      writer.uint32(18);
      writer.fork();
      BlockInput.encode(block, writer);
      writer.ldelim();
    }
  }

  static decode(reader: Reader, length: i32): PreContractCallInput {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new PreContractCallInput();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.call = PreExecMessageInput.decode(reader, reader.uint32());
          break;

        case 2:
          message.block = BlockInput.decode(reader, reader.uint32());
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  call: PreExecMessageInput | null;
  block: BlockInput | null;

  constructor(call: PreExecMessageInput | null = null, block: BlockInput | null = null) {
    this.call = call;
    this.block = block;
  }
}

export function encodePreContractCallInput(message: PreContractCallInput): Uint8Array {
  return Protobuf.encode(message, PreContractCallInput.encode);
}

export function decodePreContractCallInput(buffer: Uint8Array): PreContractCallInput {
  return Protobuf.decode<PreContractCallInput>(buffer, PreContractCallInput.decode);
}
