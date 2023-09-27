import {
  Any,
  ContextQueryRequest,
  ContextQueryResponse,
  ContextRemoveRequest,
  ContextSetRequest,
  QueryNameSpace,
  RemoveNameSpace,
  SetNameSpace,
  StringData,
} from '../proto';
import { ABool, AString, AUint8Array } from '../types';
import { MutableAspectValue } from './common';
import { Protobuf } from 'as-proto/assembly';
import { ErrLoadRuntimeCtxValue } from './errors';
import { utils } from './util-api';
import { ContextKey } from './key-path';

declare namespace __RuntimeContextApi__ {
  function get(query: i32): i32;

  function set(query: i32): i32;

  function remove(query: i32): i32;

  function query(query: i32): i32;

  function aspectId(): i32;
}

export class RuntimeContext {
  public static query(
    nameSpace: QueryNameSpace = 0,
    query: Any | null = null,
  ): ContextQueryResponse {
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

  public static remove(nameSpace: RemoveNameSpace = 0, query: Any | null = null): bool {
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

  public static set(dataSpace: SetNameSpace, key: string, value: string): bool {
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

  public static get(key: string): ContextQueryResponse {
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

  public static aspectId(): string {
    const ret = __RuntimeContextApi__.aspectId();
    if (ret == 0) {
      throw ErrLoadRuntimeCtxValue;
    }
    const bytes = new AString();
    bytes.load(ret);
    return bytes.get();
  }
}

export class AspectContext {
  private static _instance: AspectContext | null;

  private constructor() {}

  public transientStorage<T>(key: string, aspectId: string = ''): TransientStorageValue<T> {
    return new TransientStorageValue(key, aspectId);
  }

  get id(): string {
    const outPtr = __RuntimeContextApi__.aspectId();
    if (outPtr == 0) {
      throw ErrLoadRuntimeCtxValue;
    }
    const output = new AString();
    output.load(outPtr);
    return output.get();
  }

  public static get(): AspectContext {
    if (!this._instance) {
      this._instance = new AspectContext();
    }
    return this._instance!;
  }
}

export class TransientStorageValue<T> implements MutableAspectValue<T> {
  private val: T | null = null;

  constructor(private readonly key: string, private readonly aspectId: string = '') {}

  set<T>(value: T): bool {
    const dataStr = utils.toString(value);
    return RuntimeContext.set(SetNameSpace.SetAspectContext, this.key, dataStr);
  }

  reload(): void {
    const path = ContextKey.tx.context.property(this.key).toString();
    const response = RuntimeContext.get(path);
    if (response.result!.success) {
      this.val = null;
      return;
    }

    this.val = utils.fromString<T>(
      Protobuf.decode<StringData>(response.data!.value, StringData.decode).data,
    );
  }

  unwrap(): T | null {
    if (this.val == null) {
      this.reload();
    }

    return this.val;
  }
}
