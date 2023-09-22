// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0
//   protoc        v4.23.2

import { Writer, Reader } from "as-proto/assembly";
import { Evidence } from "./evidence";

export class EvidenceList {
  static encode(message: EvidenceList, writer: Writer): void {
    const evidences = message.evidences;
    for (let i: i32 = 0; i < evidences.length; ++i) {
      writer.uint32(10);
      writer.fork();
      Evidence.encode(evidences[i], writer);
      writer.ldelim();
    }
  }

  static decode(reader: Reader, length: i32): EvidenceList {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new EvidenceList();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.evidences.push(Evidence.decode(reader, reader.uint32()));
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  evidences: Array<Evidence>;

  constructor(evidences: Array<Evidence> = []) {
    this.evidences = evidences;
  }
}