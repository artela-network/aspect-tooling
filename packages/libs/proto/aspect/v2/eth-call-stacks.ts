// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0
//   protoc        v4.23.2

import { Writer, Reader } from "as-proto/assembly";
import { EthStackTransaction } from "./eth-stack-transaction";

export class EthCallStacks {
  static encode(message: EthCallStacks, writer: Writer): void {
    const calls = message.calls;
    if (calls !== null) {
      const callsKeys = calls.keys();
      for (let i: i32 = 0; i < callsKeys.length; ++i) {
        const callsKey = callsKeys[i];
        writer.uint32(10);
        writer.fork();
        writer.uint32(8);
        writer.uint64(callsKey);
        writer.uint32(18);
        writer.fork();
        EthStackTransaction.encode(calls.get(callsKey), writer);
        writer.ldelim();
        writer.ldelim();
      }
    }
  }

  static decode(reader: Reader, length: i32): EthCallStacks {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new EthCallStacks();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          let callsKey: u64 = 0;
          let callsValue: EthStackTransaction | null = null;
          let callsHasKey: bool = false;
          let callsHasValue: bool = false;
          for (
            const end: usize = reader.ptr + reader.uint32();
            reader.ptr < end;

          ) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
              case 1:
                callsKey = reader.uint64();
                callsHasKey = true;
                break;

              case 2:
                callsValue = EthStackTransaction.decode(
                  reader,
                  reader.uint32()
                );
                callsHasValue = true;
                break;

              default:
                reader.skipType(tag & 7);
                break;
            }
            if (message.calls === null) {
              message.calls = new Map<u64, EthStackTransaction>();
            }
            const calls = message.calls;
            if (
              calls !== null &&
              callsHasKey &&
              callsHasValue &&
              callsValue !== null
            ) {
              calls.set(callsKey, callsValue);
            }
          }
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  calls: Map<u64, EthStackTransaction>;

  constructor(calls: Map<u64, EthStackTransaction> = new Map()) {
    this.calls = calls;
  }
}
