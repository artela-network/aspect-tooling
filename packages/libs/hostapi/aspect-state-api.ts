import { AString, AUint8Array } from '../common';

declare namespace __AspectStateApi__ {
  function get(key: i32): i32;

  function set(key: i32, value: i32): void;
}

export class AspectStateApi {
  private static _instance: AspectStateApi | null;

  private constructor() {}

  public static instance(): AspectStateApi {
    if (!this._instance) {
      this._instance = new AspectStateApi();
    }
    return this._instance!;
  }

  public get(key: string): Uint8Array {
    const inputKey = new AString();
    inputKey.set(key);
    const inPtr = inputKey.store();
    const ret = __AspectStateApi__.get(inPtr);
    const bytes = new AUint8Array();
    bytes.load(ret);
    return bytes.get();
  }

  public set(key: string, value: Uint8Array): void {
    const inputKey = new AString();
    inputKey.set(key);
    const keyPtr = inputKey.store();
    const inputValue = new AUint8Array();
    inputValue.set(value);
    const valPtr = inputValue.store();

    __AspectStateApi__.set(keyPtr, valPtr);
  }
}
