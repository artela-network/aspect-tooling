import { MessageUrlType } from '../types';
import { MutableAspectValue } from './common';
import { utils } from './util-api';
import { RuntimeContext } from './runtime-api';

import { Protobuf } from 'as-proto';
import { Any, QueryNameSpace, RemoveNameSpace, SetNameSpace, StringData } from '../proto';
import { ErrUpdateAspectState, NewMessageError } from './errors';
import { ToAny } from '../types/message-helper';
export class AspectProperty {
  private constructor() {}

  public static get<T>(key: string): T | null {
    const sateChangeQuery = new StringData(key);
    const query = ToAny<StringData>(
      MessageUrlType.SateChangeQuery,
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
}

export class AspectState {
  private constructor() {}

  public static get<T>(key: string): StateValue<T> {
    return new StateValue<T>(key);
  }
}

export class StateValue<T> implements MutableAspectValue<T> {
  private val: T | null = null;

  constructor(private readonly key: string) {}

  set<T>(value: T): bool {
    const data = utils.toString<T>(value);
    if (this.key == '') {
      throw ErrUpdateAspectState;
    }
    return RuntimeContext.set(SetNameSpace.SetAspectState, this.key, data);
  }

  delete(): bool {
    const data = new StringData(this.key);
    const encode = Protobuf.encode(data, StringData.encode);
    const any = new Any(MessageUrlType.StringData, encode);

    return RuntimeContext.remove(RemoveNameSpace.RemoveAspectState, any);
  }

  reload(): void {
    const sateChangeQuery = new StringData(this.key);
    const query = ToAny<StringData>(
      MessageUrlType.SateChangeQuery,
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
