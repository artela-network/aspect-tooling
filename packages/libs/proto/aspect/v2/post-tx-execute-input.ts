// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0
//   protoc        v5.27.1

import { Writer, Reader } from "as-proto/assembly";
import { WithFromTxInput } from "./with-from-tx-input";
import { BlockInput } from "./block-input";
import { ReceiptInput } from "./receipt-input";

export class PostTxExecuteInput {
  static encode(message: PostTxExecuteInput, writer: Writer): void {
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

    const receipt = message.receipt;
    if (receipt !== null) {
      writer.uint32(26);
      writer.fork();
      ReceiptInput.encode(receipt, writer);
      writer.ldelim();
    }
  }

  static decode(reader: Reader, length: i32): PostTxExecuteInput {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new PostTxExecuteInput();

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
          message.receipt = ReceiptInput.decode(reader, reader.uint32());
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
  receipt: ReceiptInput | null;

  constructor(
    tx: WithFromTxInput | null = null,
    block: BlockInput | null = null,
    receipt: ReceiptInput | null = null
  ) {
    this.tx = tx;
    this.block = block;
    this.receipt = receipt;
  }
}
