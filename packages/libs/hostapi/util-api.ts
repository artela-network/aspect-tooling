import { AString } from '../common';

declare namespace __UtilApi__ {
  function revert(ptr: i32): void;

  function sLog(ptr: i32): void;
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

  public log(data: string): void {
    const dataPtr = new AString(data).store();
    __UtilApi__.sLog(dataPtr);
  }
}
