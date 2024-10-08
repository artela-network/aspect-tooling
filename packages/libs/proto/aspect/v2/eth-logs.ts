// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0
//   protoc        v5.27.1

import { Writer, Reader } from "as-proto/assembly";
import { EthLog } from "./eth-log";

export class EthLogs {
  static encode(message: EthLogs, writer: Writer): void {
    const logs = message.logs;
    for (let i: i32 = 0; i < logs.length; ++i) {
      writer.uint32(10);
      writer.fork();
      EthLog.encode(logs[i], writer);
      writer.ldelim();
    }
  }

  static decode(reader: Reader, length: i32): EthLogs {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new EthLogs();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.logs.push(EthLog.decode(reader, reader.uint32()));
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  logs: Array<EthLog>;

  constructor(logs: Array<EthLog> = []) {
    this.logs = logs;
  }
}
