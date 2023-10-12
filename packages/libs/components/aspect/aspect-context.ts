import { ContextKey, ConvertUtil, ErrLoadRuntimeCtxValue } from '../../common';
import { MutableAspectValue } from './aspect-state-interface';
import { SetNameSpace, StringData } from '../../proto';
import { Protobuf } from 'as-proto/assembly';
import { RuntimeContextApi } from '../../hostapi';

const runtimeContext = RuntimeContextApi.instance();
const utils = new ConvertUtil();

export class AspectContext {
  private static _instance: AspectContext | null;

  private constructor() {}

  public transientStorage<T>(key: string, aspectId: string = ''): TransientStorageValue<T> {
    return new TransientStorageValue(key, aspectId);
  }

  get id(): string {
    return runtimeContext.aspectId();
  }

  public static instance(): AspectContext {
    if (!this._instance) {
      this._instance = new AspectContext();
    }
    return this._instance!;
  }
}

export class TransientStorageValue<T> implements MutableAspectValue<T> {
  private val: T;
  private loaded: boolean = false;

  constructor(private readonly key: string, private readonly aspectId: string = '') {
    this.val = utils.fromString<T>('');
  }

  set<T>(value: T): bool {
    const dataStr = utils.toString(value);
    return runtimeContext.set(SetNameSpace.SetAspectContext, this.key, dataStr);
  }

  reload(): void {
    const path = ContextKey.tx.context.property(this.key).toString();
    const response = runtimeContext.get(path);
    if (!response.result!.success) {
      throw ErrLoadRuntimeCtxValue;
    }

    this.val = utils.fromString<T>(
      response.data == null
        ? ''
        : Protobuf.decode<StringData>(response.data!.value, StringData.decode).data,
    );
    this.loaded = true;
  }

  unwrap(): T {
    if (!this.loaded) {
      this.reload();
    }

    return this.val;
  }
}
