import { Protobuf } from 'as-proto/assembly';
import { AUint8Array } from '../common';
import { Transaction } from '../proto/aspect/v2/transaction';

declare namespace __BlockchainApi__ {
  function getTransactionByHash(hash: i32): i32;
}

export class BlockchainApi {
  private static _instance: BlockchainApi | null;

  private constructor() { }

  public static instance(): BlockchainApi {
    if (!this._instance) {
      this._instance = new BlockchainApi();
    }
    return this._instance!;
  }

  public getTransactionByHash(hash: Uint8Array): Transaction | null {
    const rawRequest = new AUint8Array();
    rawRequest.set(hash);
    const inPtr = rawRequest.store();
    const ret = __BlockchainApi__.getTransactionByHash(inPtr);
    const bytes = new AUint8Array();
    bytes.load(ret);
    const tx = Protobuf.decode<Transaction>(bytes.get(), Transaction.decode);
    if (tx.blockNumber == 0) {
      return null;
    }
    return tx;
  }
}
