// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0
//   protoc        v5.27.1

import { Writer, Reader } from "as-proto/assembly";
import { EthLog } from "./eth-log";

export class EthReceipt {
  static encode(message: EthReceipt, writer: Writer): void {
    writer.uint32(8);
    writer.uint64(message.status);

    writer.uint32(16);
    writer.uint64(message.cumulativeGasUsed);

    writer.uint32(26);
    writer.bytes(message.logsBloom);

    writer.uint32(34);
    writer.bytes(message.effectiveGasPrice);

    const logs = message.logs;
    for (let i: i32 = 0; i < logs.length; ++i) {
      writer.uint32(42);
      writer.fork();
      EthLog.encode(logs[i], writer);
      writer.ldelim();
    }
  }

  static decode(reader: Reader, length: i32): EthReceipt {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new EthReceipt();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.status = reader.uint64();
          break;

        case 2:
          message.cumulativeGasUsed = reader.uint64();
          break;

        case 3:
          message.logsBloom = reader.bytes();
          break;

        case 4:
          message.effectiveGasPrice = reader.bytes();
          break;

        case 5:
          message.logs.push(EthLog.decode(reader, reader.uint32()));
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  status: u64;
  cumulativeGasUsed: u64;
  logsBloom: Uint8Array;
  effectiveGasPrice: Uint8Array;
  logs: Array<EthLog>;

  constructor(
    status: u64 = 0,
    cumulativeGasUsed: u64 = 0,
    logsBloom: Uint8Array = new Uint8Array(0),
    effectiveGasPrice: Uint8Array = new Uint8Array(0),
    logs: Array<EthLog> = []
  ) {
    this.status = status;
    this.cumulativeGasUsed = cumulativeGasUsed;
    this.logsBloom = logsBloom;
    this.effectiveGasPrice = effectiveGasPrice;
    this.logs = logs;
  }
}
