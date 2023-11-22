// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0
//   protoc        v4.25.1

import { Writer, Reader } from 'as-proto/assembly';
import { EthBlockHeader } from './eth-block-header';
import { GasInfo } from './gas-info';

export class EthBlockAspect {
  static encode(message: EthBlockAspect, writer: Writer): void {
    const header = message.header;
    if (header !== null) {
      writer.uint32(10);
      writer.fork();
      EthBlockHeader.encode(header, writer);
      writer.ldelim();
    }

    const gasInfo = message.gasInfo;
    if (gasInfo !== null) {
      writer.uint32(18);
      writer.fork();
      GasInfo.encode(gasInfo, writer);
      writer.ldelim();
    }
  }

  static decode(reader: Reader, length: i32): EthBlockAspect {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new EthBlockAspect();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.header = EthBlockHeader.decode(reader, reader.uint32());
          break;

        case 2:
          message.gasInfo = GasInfo.decode(reader, reader.uint32());
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  header: EthBlockHeader | null;
  gasInfo: GasInfo | null;

  constructor(header: EthBlockHeader | null = null, gasInfo: GasInfo | null = null) {
    this.header = header;
    this.gasInfo = gasInfo;
  }
}
