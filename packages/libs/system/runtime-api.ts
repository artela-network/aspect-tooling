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

  public getId(): string {
    const outPtr = __RuntimeContextApi__.aspectId();
    if (outPtr == 0) {
      return '';
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

export class KeyPath {
  public static AspectContext = 'aspect.context';
  public static AspectState = 'aspect.state';
  public static AspectProperty = 'aspect.property';
  public static ExtProperties = 'tx.extProperties';
  public static TxContent = 'tx.content';
  public static TxStateChanges = 'tx.stateChanges';
  public static TxCallTree = 'tx.callTree';
  public static TxReceipt = 'tx.receipt';
  public static TxGasMeter = 'tx.gasMeter';
  public static EnvConsParams = 'env.consParams';
  public static EnvChainConfig = 'env.chainConfig';
  public static EnvEvmParams = 'env.evmParams';
  public static EnvBaseInfo = 'env.baseInfo';
  public static BlockHeader = 'block.header';
  public static BlockTxs = 'block.txs';
  public static BlockGasMeter = 'block.gasMeter';
  public static BlockMinGasPrice = 'block.minGasPrice';
  public static BlockLastCommit = 'block.lastCommit';

  public static Occupy = '#';

  arr = new Array<string>();

  private static _instance: KeyPath | null;

  public static New(...keys: string[]): KeyPath {
    if (!this._instance) {
      this._instance = new KeyPath(keys);
    }
    return this._instance!;
  }
  constructor(...keys: string[]) {
    for (let i = 0; i < keys.length; i++) {
      this.arr.push(keys[i]);
    }
  }

  add(key: string = ''): this {
    if (key != '') {
      this.arr.push(key);
    }
    return this;
  }

  build(): string {
    if (this.arr.length == 0) {
      return '';
    }
    return this.arr.join('.');
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
    const path = KeyPath.New(KeyPath.AspectContext).add(this.key).add(this.aspectId).build();

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
