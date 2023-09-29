// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0
//   protoc        v4.24.3

import { Writer, Reader } from 'as-proto/assembly';

export class EthBlockHeader {
  static encode(message: EthBlockHeader, writer: Writer): void {
    writer.uint32(10);
    writer.string(message.parentHash);

    writer.uint32(18);
    writer.string(message.uncleHash);

    writer.uint32(26);
    writer.string(message.coinbase);

    writer.uint32(34);
    writer.string(message.stateRoot);

    writer.uint32(42);
    writer.string(message.transactionsRoot);

    writer.uint32(50);
    writer.string(message.receiptHash);

    writer.uint32(56);
    writer.uint64(message.difficulty);

    writer.uint32(64);
    writer.uint64(message.number);

    writer.uint32(72);
    writer.uint64(message.gasLimit);

    writer.uint32(80);
    writer.uint64(message.gasUsed);

    writer.uint32(88);
    writer.uint64(message.timestamp);

    writer.uint32(98);
    writer.bytes(message.extraData);

    writer.uint32(106);
    writer.bytes(message.mixHash);

    writer.uint32(112);
    writer.uint64(message.nonce);

    writer.uint32(120);
    writer.uint64(message.baseFee);

    writer.uint32(130);
    writer.string(message.withdrawalsRoot);

    writer.uint32(138);
    writer.string(message.excessDataGas);
  }

  static decode(reader: Reader, length: i32): EthBlockHeader {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new EthBlockHeader();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.parentHash = reader.string();
          break;

        case 2:
          message.uncleHash = reader.string();
          break;

        case 3:
          message.coinbase = reader.string();
          break;

        case 4:
          message.stateRoot = reader.string();
          break;

        case 5:
          message.transactionsRoot = reader.string();
          break;

        case 6:
          message.receiptHash = reader.string();
          break;

        case 7:
          message.difficulty = reader.uint64();
          break;

        case 8:
          message.number = reader.uint64();
          break;

        case 9:
          message.gasLimit = reader.uint64();
          break;

        case 10:
          message.gasUsed = reader.uint64();
          break;

        case 11:
          message.timestamp = reader.uint64();
          break;

        case 12:
          message.extraData = reader.bytes();
          break;

        case 13:
          message.mixHash = reader.bytes();
          break;

        case 14:
          message.nonce = reader.uint64();
          break;

        case 15:
          message.baseFee = reader.uint64();
          break;

        case 16:
          message.withdrawalsRoot = reader.string();
          break;

        case 17:
          message.excessDataGas = reader.string();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  parentHash: string;
  uncleHash: string;
  coinbase: string;
  stateRoot: string;
  transactionsRoot: string;
  receiptHash: string;
  difficulty: u64;
  number: u64;
  gasLimit: u64;
  gasUsed: u64;
  timestamp: u64;
  extraData: Uint8Array;
  mixHash: Uint8Array;
  nonce: u64;
  baseFee: u64;
  withdrawalsRoot: string;
  excessDataGas: string;

  constructor(
    parentHash: string = '',
    uncleHash: string = '',
    coinbase: string = '',
    stateRoot: string = '',
    transactionsRoot: string = '',
    receiptHash: string = '',
    difficulty: u64 = 0,
    number: u64 = 0,
    gasLimit: u64 = 0,
    gasUsed: u64 = 0,
    timestamp: u64 = 0,
    extraData: Uint8Array = new Uint8Array(0),
    mixHash: Uint8Array = new Uint8Array(0),
    nonce: u64 = 0,
    baseFee: u64 = 0,
    withdrawalsRoot: string = '',
    excessDataGas: string = '',
  ) {
    this.parentHash = parentHash;
    this.uncleHash = uncleHash;
    this.coinbase = coinbase;
    this.stateRoot = stateRoot;
    this.transactionsRoot = transactionsRoot;
    this.receiptHash = receiptHash;
    this.difficulty = difficulty;
    this.number = number;
    this.gasLimit = gasLimit;
    this.gasUsed = gasUsed;
    this.timestamp = timestamp;
    this.extraData = extraData;
    this.mixHash = mixHash;
    this.nonce = nonce;
    this.baseFee = baseFee;
    this.withdrawalsRoot = withdrawalsRoot;
    this.excessDataGas = excessDataGas;
  }
}
