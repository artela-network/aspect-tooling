import { MessageUrlType } from '../types';
import { ImmutableAspectValue, MutableAspectValue } from './common';
import { utils } from './util-api';
import { RuntimeContext } from './runtime-api';

import { Any, QueryNameSpace, RemoveNameSpace, SetNameSpace, StringData } from '../proto';
import { ErrUpdateAspectState, NewMessageError } from './errors';
import { ToAny } from '../types/message-helper';
import { Protobuf } from 'as-proto/assembly';

export class AspectProperty {
  private static _instance: AspectProperty | null;

  private constructor() {}
  public get<T>(key: string): T | null {
    const sateChangeQuery = new StringData(key);
    const query = ToAny<StringData>(
      MessageUrlType.StringData,
      sateChangeQuery,
      StringData.encode,
    );
    const outPtr = RuntimeContext.query(QueryNameSpace.QueryAspectProperty, query);
    if (!outPtr.result!.success) {
      throw NewMessageError(outPtr.result!.message);
    }
    const stringData = Protobuf.decode<StringData>(outPtr!.data!.value, StringData.decode);
    return utils.fromString<T>(stringData.data);
  }

  public static get(): AspectProperty {
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

  public static get(): MutableAspectState {
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

  public static get(): ImmutableAspectState {
    if (!this._instance) {
      this._instance = new ImmutableAspectState();
    }
    return this._instance!;
  }
}

export class ImmutableStateValue<T> implements ImmutableAspectValue<T> {
  protected val: T | null = null;

  constructor(protected readonly key: string) {}

  reload(): void {
    const sateChangeQuery = new StringData(this.key);
    const query = ToAny<StringData>(
      MessageUrlType.StringData,
      sateChangeQuery,
      StringData.encode,
    );
    const response = RuntimeContext.query(QueryNameSpace.QueryAspectState, query);
    if (!response.result!.success) {
      throw NewMessageError(response.result!.message);
    }
    const value = response.data!.value;
    const stringData = Protobuf.decode<StringData>(value, StringData.decode);
    this.val = utils.fromString<T>(stringData.data);
  }

  unwrap(): T | null {
    if (this.val == null) {
      this.reload();
    }

    return this.val;
  }
}

export class MutableStateValue<T> extends ImmutableStateValue<T> implements MutableAspectValue<T> {
  set<T>(value: T): void {
    const data = utils.toString<T>(value);
    if (this.key == '') {
      throw ErrUpdateAspectState;
    }
    RuntimeContext.set(SetNameSpace.SetAspectState, this.key, data);
  }

  delete(): void {
    const data = new StringData(this.key);
    const encode = Protobuf.encode(data, StringData.encode);
    const any = new Any(MessageUrlType.StringData, encode);

    RuntimeContext.remove(RemoveNameSpace.RemoveAspectState, any);
  }
}
