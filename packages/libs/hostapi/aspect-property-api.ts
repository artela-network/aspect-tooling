import { AString, AUint8Array } from '../common';

declare namespace __AspectPropertyApi__ {
  function get(aspectId: i32, key: i32): i32;
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

  public get(aspectId: Uint8Array, key: string): Uint8Array {
    const inputAspectId = new AUint8Array();
    inputAspectId.set(aspectId);
    const aspectIdPtr = inputAspectId.store();
    const inputKey = new AString();
    inputKey.set(key);
    const keyPtr = inputKey.store();
    const ret = __AspectPropertyApi__.get(aspectIdPtr, keyPtr);
    const bytes = new AUint8Array();
    bytes.load(ret);
    return bytes.get();
  }
}
