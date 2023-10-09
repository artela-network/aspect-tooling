import {ImmutableAspectValue, MutableAspectValue} from './aspect-state-interface';

import {Any, QueryNameSpace, RemoveNameSpace, SetNameSpace, StringData} from '../../proto';
import {
  AspectStateModifiable,
  AspectStateReadonly,
  convertUtil,
  ErrUpdateAspectState,
  MessageUtil,
  NewMessageError,
  NotAuthorizedFail
} from '../../common';
import {Protobuf} from 'as-proto/assembly';
import {RuntimeContextApi} from "../../hostapi";

const runtimeContext = RuntimeContextApi.instance();
const messageUtil = MessageUtil.instance();

export class AspectProperty {
  private static _instance: AspectProperty | null;

  private constructor() {}
  public get<T>(key: string): T {
    const sateChangeQuery = new StringData(key);
    const query = messageUtil.ToAny<StringData>(messageUtil.StringData, sateChangeQuery, StringData.encode);
    const outPtr =runtimeContext.query(QueryNameSpace.QueryAspectProperty, query);
    if (!outPtr.result!.success) {
      throw NewMessageError(outPtr.result!.message);
    }
    return  convertUtil.fromString<T>(
      outPtr.data == null
        ? ''
        : Protobuf.decode<StringData>(outPtr.data!.value, StringData.decode).data,
    );
  }

  public static instance(): AspectProperty {
    if (!this._instance) {
      this._instance = new AspectProperty();
    }
    return this._instance!;
  }
}

export class MutableAspectState {
  private static _instance: MutableAspectState | null;

  private constructor() {}

  public get<T>(key: string): MutableStateValue<T> {
    return new MutableStateValue<T>(key);
  }

  public static instance(ctx: AspectStateModifiable): MutableAspectState {
    if (ctx == null) {
      throw NotAuthorizedFail;
    }
    if (!this._instance) {
      this._instance = new MutableAspectState();
    }
    return this._instance!;
  }
}

export class ImmutableAspectState {
  private static _instance: ImmutableAspectState | null;

  private constructor() {}
  public get<T>(key: string): ImmutableStateValue<T> {
    return new ImmutableStateValue<T>(key);
  }

  public static instance(ctx: AspectStateReadonly): ImmutableAspectState {
    if (ctx == null) {
      throw NotAuthorizedFail;
    }
    if (!this._instance) {
      this._instance = new ImmutableAspectState();
    }
    return this._instance!;
  }
}

export class ImmutableStateValue<T> implements ImmutableAspectValue<T> {
  protected val: T;
  private loaded: boolean = false;

  constructor(protected readonly key: string) {
    this.val = convertUtil.fromString<T>('');
  }

  reload(): void {
    const sateChangeQuery = new StringData(this.key);
    const query = messageUtil.ToAny<StringData>(messageUtil.StringData, sateChangeQuery, StringData.encode);
    const response = runtimeContext.query(QueryNameSpace.QueryAspectState, query);
    if (!response.result!.success) {
      throw NewMessageError(response.result!.message);
    }
    this.val = convertUtil.fromString<T>(
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

export class MutableStateValue<T> extends ImmutableStateValue<T> implements MutableAspectValue<T> {
  set<T>(value: T): void {
    const data = convertUtil.toString<T>(value);
    if (this.key == '') {
      throw ErrUpdateAspectState;
    }
    runtimeContext.set(SetNameSpace.SetAspectState, this.key, data);
  }

  delete(): void {
    const data = new StringData(this.key);
    const encode = Protobuf.encode(data, StringData.encode);
    const any = new Any(messageUtil.StringData, encode);

    runtimeContext.remove(RemoveNameSpace.RemoveAspectState, any);
  }
}
