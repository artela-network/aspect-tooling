import { Protobuf } from 'as-proto/assembly';
import { ABool, AString, AUint8Array, ErrLoadRuntimeCtxValue } from '../common';
import {
  Any,
  ContextQueryRequest,
  ContextQueryResponse,
  ContextRemoveRequest,
  ContextSetRequest,
  QueryNameSpace,
  RemoveNameSpace,
  SetNameSpace,
} from '../proto';

declare namespace __RuntimeContextApi__ {
  function get(query: i32): i32;

  function set(query: i32): i32;

  function remove(query: i32): i32;

  function query(query: i32): i32;

  function aspectId(): i32;
}

export class RuntimeContextApi {
  private static _instance: RuntimeContextApi | null;

  private constructor() {}

  public static instance(): RuntimeContextApi {
    if (!this._instance) {
      this._instance = new RuntimeContextApi();
    }
    return this._instance!;
  }

  public query(nameSpace: QueryNameSpace = 0, query: Any | null = null): ContextQueryResponse {
    const contextQueryRequest = new ContextQueryRequest(nameSpace, query);
    const encoded = Protobuf.encode(contextQueryRequest, ContextQueryRequest.encode);
    const input = new AUint8Array();
    input.set(encoded);
    const inputPtr = input.store();
    const ret = __RuntimeContextApi__.query(inputPtr);
    if (ret == 0) {
      throw ErrLoadRuntimeCtxValue;
    }
    const bytes = new AUint8Array();
    bytes.load(ret);
    return Protobuf.decode<ContextQueryResponse>(bytes.get(), ContextQueryResponse.decode);
  }

  public remove(nameSpace: RemoveNameSpace = 0, query: Any | null = null): bool {
    const contextQueryRequest = new ContextRemoveRequest(nameSpace, query);
    const encoded = Protobuf.encode(contextQueryRequest, ContextRemoveRequest.encode);
    const input = new AUint8Array();
    input.set(encoded);
    const inputPtr = input.store();
    const ret = __RuntimeContextApi__.remove(inputPtr);
    if (ret == 0) {
      throw ErrLoadRuntimeCtxValue;
    }
    const bytes = new ABool();
    bytes.load(ret);
    return bytes.get();
  }

  public set(dataSpace: SetNameSpace, key: string, value: string): bool {
    const contextQueryRequest = new ContextSetRequest(dataSpace, key, value);
    const encoded = Protobuf.encode(contextQueryRequest, ContextSetRequest.encode);
    const input = new AUint8Array();
    input.set(encoded);
    const inputPtr = input.store();
    const ret = __RuntimeContextApi__.set(inputPtr);
    if (ret == 0) {
      throw ErrLoadRuntimeCtxValue;
    }
    const bytes = new ABool();
    bytes.load(ret);
    return bytes.get();
  }

  public get(key: string): ContextQueryResponse {
    const inputKey = new AString();
    inputKey.set(key);
    const inPtr = inputKey.store();
    const ret = __RuntimeContextApi__.get(inPtr);
    if (ret == 0) {
      throw ErrLoadRuntimeCtxValue;
    }
    const bytes = new AUint8Array();
    bytes.load(ret);
    return Protobuf.decode<ContextQueryResponse>(bytes.get(), ContextQueryResponse.decode);
  }

  public aspectId(): string {
    const ret = __RuntimeContextApi__.aspectId();
    if (ret == 0) {
      throw ErrLoadRuntimeCtxValue;
    }
    const bytes = new AString();
    bytes.load(ret);
    return bytes.get();
  }
}
