import { ABool, AString } from '../types';
import { MutableAspectValue } from './common';
import { ErrUpdateAspectState } from './errors';
import { utils } from './util-api';

declare namespace __AspectStateApi__ {
  function getAspectState(key: i32): i32;

  function setAspectState(key: i32, value: i32): i32;

  function removeAspectState(key: i32): i32;

  function getProperty(key: i32): i32;
}

export class AspectProperty {
  private constructor() {}

  public static get<T>(key: string): T | null {
    const input = new AString();
    input.set(key);
    const inPtr = input.store();
    const outPtr = __AspectStateApi__.getProperty(inPtr);
    if (outPtr == 0) {
      return null;
    }
    const output = new AString();
    output.load(outPtr);
    return utils.fromString<T>(output.get());
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
    const inputKey = new AString();
    inputKey.set(this.key);
    const inPtr = inputKey.store();
    const data = utils.toString(value);
    const inputValue = new AString();
    inputValue.set(data);
    const ptrValue = inputValue.store();
    const outPtr = __AspectStateApi__.setAspectState(inPtr, ptrValue);
    if (outPtr == 0) {
      throw ErrUpdateAspectState;
    }
    const output = new ABool();
    output.load(outPtr);
    return output.get();
  }

  delete(): bool {
    const inputKey = new AString();
    inputKey.set(this.key);
    const inPtr = inputKey.store();
    const outPtr = __AspectStateApi__.removeAspectState(inPtr);
    if (outPtr == 0) {
      throw ErrUpdateAspectState;
    }
    const output = new ABool();
    output.load(outPtr);
    const success = output.get();
    if (success) {
      this.val = null;
    }
    return success;
  }

  reload(): void {
    const input = new AString();
    input.set(this.key);
    const inPtr = input.store();
    const outPtr = __AspectStateApi__.getAspectState(inPtr);
    if (outPtr == 0) {
      this.val = null;
      return;
    }
    const output = new AString();
    output.load(outPtr);
    const newVar = output.get();
    this.val = utils.fromString<T>(newVar);
  }

  unwrap(): T | null {
    if (this.val == null) {
      this.reload();
    }

    return this.val;
  }
}
