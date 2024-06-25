import {AI64, AString, AUint8Array} from '../common';

declare namespace __UtilApi__ {
  function revert(ptr: i32): void;

  function sLog(ptr: i32): void;

  function gas(): i32;
}

export class UtilApi {
  private static _instance: UtilApi | null;

  private constructor() {}

  public static instance(): UtilApi {
    if (!this._instance) {
      this._instance = new UtilApi();
    }
    return this._instance!;
  }

  public revert(message: string): void {
    const input = new AString();
    input.set(message);
    const inPtr = input.store();
    __UtilApi__.revert(inPtr);
    throw new Error(message);
  }

  public gas(): i64 {
    const ret = __UtilApi__.gas();
    const gas = new AI64();
    gas.load(ret);
    return gas.get();
  }

  public log(data: string): void {
    const dataPtr = new AString(data).store();
    __UtilApi__.sLog(dataPtr);
  }
}
