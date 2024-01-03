import { Protobuf } from 'as-proto/assembly';
import { AUint8Array } from '../common';
import { CallTreeQuery, StateChangeQuery } from '../proto';

declare namespace __TraceApi__ {
  function queryStateChange(query: i32): i32;
  function queryCallTree(query: i32): i32;
}

export class TraceApi {
  private static _instance: TraceApi | null;

  private constructor() {}

  public static instance(): TraceApi {
    if (!this._instance) {
      this._instance = new TraceApi();
    }
    return this._instance!;
  }

  public queryStateChange(query: StateChangeQuery): Uint8Array {
    const rawQuery = Protobuf.encode<StateChangeQuery>(query, StateChangeQuery.encode);
    const rawRequest = new AUint8Array();
    rawRequest.set(rawQuery);
    const inPtr = rawRequest.store();
    const ret = __TraceApi__.queryStateChange(inPtr);
    const bytes = new AUint8Array();
    bytes.load(ret);
    return bytes.get();
  }

  public queryCallTree(query: CallTreeQuery): Uint8Array {
    const rawQuery = Protobuf.encode<CallTreeQuery>(query, CallTreeQuery.encode);
    const rawRequest = new AUint8Array();
    rawRequest.set(rawQuery);
    const inPtr = rawRequest.store();
    const ret = __TraceApi__.queryCallTree(inPtr);
    const bytes = new AUint8Array();
    bytes.load(ret);
    return bytes.get();
  }
}
