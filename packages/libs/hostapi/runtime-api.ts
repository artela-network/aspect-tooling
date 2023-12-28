import {AString, AUint8Array, uint8ArrayToHex} from '../common';
import {UtilApi} from "./util-api";

declare namespace __RuntimeContextApi__ {
  function get(ctxKey: i32): i32;
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

    UtilApi.instance().log("|||Context get "+uint8ArrayToHex(bytes.get()))
    return bytes.get();

  }
}
