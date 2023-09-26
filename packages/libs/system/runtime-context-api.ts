import { ContextQueryRequest, ContextQueryResponse, DataSpaceType, StringData } from '../proto';
import { ABool, AString, AUint8Array } from '../types';
import { MutableAspectValue } from './common';
import { Protobuf } from 'as-proto/assembly';
import { ErrLoadRuntimeCtxValue } from './errors';
import { utils } from './util-api';

declare namespace __RuntimeContextApi__ {
  function get(query: i32): i32;

  function setAspectContext(key: i32, value: i32): i32;

  function aspectId(): i32;
}

export class RuntimeContext {
  public static get(dataSpace: DataSpaceType, keys: Array<string> = []): ContextQueryResponse {
    const contextQueryRequest = new ContextQueryRequest(dataSpace, keys);
    const encoded = Protobuf.encode(contextQueryRequest, ContextQueryRequest.encode);
    const input = new AUint8Array();
    input.set(encoded);
    const inputPtr = input.store();
    const ret = __RuntimeContextApi__.get(inputPtr);
    if (ret == 0) {
      throw ErrLoadRuntimeCtxValue;
    }
    const bytes = new AUint8Array();
    bytes.load(ret);
    return Protobuf.decode<ContextQueryResponse>(bytes.get(), ContextQueryResponse.decode);
  }
}

export class AspectContext {
  private static _instance: AspectContext | null;

  private constructor() {}

  public transientStorage<T>(
    key: string,
    aspectId: string = '',
    contractAddr: string = '',
  ): TransientStorageValue<T> {
    return new TransientStorageValue(key, aspectId, contractAddr);
  }
  get id():string{
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

  constructor(
    private readonly key: string,
    private readonly aspectId: string = '',
    private readonly contractAddr: string = '',
  ) {}

  set<T>(value: T): bool {
    const inputKey = new AString();
    inputKey.set(this.key);
    const inPtr = inputKey.store();

    const inputValue = new AString();
    const dataStr = utils.toString(value);
    inputValue.set(dataStr);
    const ptrValue = inputValue.store();
    const outPtr = __RuntimeContextApi__.setAspectContext(inPtr, ptrValue);
    if (outPtr == 0) {
      return false;
    }
    const output = new ABool();
    output.load(outPtr);
    return output.get();
  }

  reload(): void {
    const response = RuntimeContext.get(DataSpaceType.TX_ASPECT_CONTEXT, [
      this.key,
      this.aspectId,
      this.contractAddr,
    ]);
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
