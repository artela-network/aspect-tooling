import { AString, AUint8Array } from '../common';

declare namespace __AspectPropertyApi__ {
  function get(key: i32): i32;
}

export class AspectPropertyApi {
  private static _instance: AspectPropertyApi | null;

  private constructor() {}

  public static instance(): AspectPropertyApi {
    if (!this._instance) {
      this._instance = new AspectPropertyApi();
    }
    return this._instance!;
  }

  public get(key: string): Uint8Array {
    const inputKey = new AString();
    inputKey.set(key);
    const keyPtr = inputKey.store();
    const ret = __AspectPropertyApi__.get(keyPtr);
    const bytes = new AUint8Array();
    bytes.load(ret);
    return bytes.get();
  }
}
