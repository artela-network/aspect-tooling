import { AString, AUint8Array } from '../common';

declare namespace __UtilApi__ {
  function fromHexString(input: i32): i32;

  function toHexString(input: i32): i32;

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

  public hexToUint8Array(s: string): Uint8Array {
    if (s.length % 2 !== 0) {
      throw new Error('Invalid hex string');
    }
    const outPtr = __UtilApi__.fromHexString(new AString(s).store());
    const out = new AUint8Array();
    out.load(outPtr);
    const data = out.get();
    if (data.length == 0 && s.length != 0) {
      throw new Error('Invalid hex string');
    }
    return data;
  }
  public uint8ArrayToHex(data: Uint8Array): string {
    const outPtr = __UtilApi__.toHexString(new AUint8Array(data).store());
    const out = new AString();
    out.load(outPtr);
    return out.get();
  }
}
