import { MessageUrlType } from '../types';
import { MutableAspectValue } from './common';
import { utils } from './util-api';
import { RuntimeContext } from './runtime-api';
import { KeyPath } from './key-path';

import { Protobuf } from 'as-proto';
import { Any, RemoveNameSpace, SetNameSpace, StringData } from '../proto';
import { ErrUpdateAspectState } from './errors';

export class AspectProperty {
  private constructor() {}

  public static get<T>(key: string): T | null {
    const keyPath = KeyPath.tx.extProperties.addKey(key).toPath();
    const outPtr = RuntimeContext.get(keyPath);
    if (outPtr.result == null || !outPtr.result.success || outPtr.data == null) {
      return null;
    }
    const stringData = Protobuf.decode<StringData>(outPtr.data.value, StringData.decode);
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
    const keyPath = KeyPath.aspect.state.addKey(this.key).toPath();
    const response = RuntimeContext.get(keyPath);
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
