// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0
//   protoc        v5.27.1

import { Writer, Reader } from "as-proto/assembly";
import { PostExecMessageInput } from "./post-exec-message-input";
import { BlockInput } from "./block-input";

export class PostContractCallInput {
  static encode(message: PostContractCallInput, writer: Writer): void {
    const call = message.call;
    if (call !== null) {
      writer.uint32(10);
      writer.fork();
      PostExecMessageInput.encode(call, writer);
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

  static decode(reader: Reader, length: i32): PostContractCallInput {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new PostContractCallInput();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.call = PostExecMessageInput.decode(reader, reader.uint32());
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

  call: PostExecMessageInput | null;
  block: BlockInput | null;

  constructor(
    call: PostExecMessageInput | null = null,
    block: BlockInput | null = null
  ) {
    this.call = call;
    this.block = block;
  }
}
