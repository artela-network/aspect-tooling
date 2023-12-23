import { AString, AUint8Array } from '../common';

declare namespace __RuntimeContextApi__ {
  function get(query: i32): i32;
}

export class RuntimeContextApi {
  private static _instance: RuntimeContextApi | null;

  private constructor() {}

  public static instance(): RuntimeContextApi {
    if (!this._instance) {
      this._instance = new RuntimeContextApi();
    }
    return this._instance!;
  }

  public get(key: string): Uint8Array {
    const inputKey = new AString();
    inputKey.set(key);
    const inPtr = inputKey.store();
    const ret = __RuntimeContextApi__.get(inPtr);
    const bytes = new AUint8Array();
    bytes.load(ret);
    return bytes.get();
  }
}
