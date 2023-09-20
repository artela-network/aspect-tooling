import { AString, AUint8Array } from '../types';
import { ethereum } from '../common';

declare namespace __UtilApi__ {
  function fromHexString(input: i32): i32;

  function toHexString(input: i32): i32;

  function revert(ptr: i32): void;

  function sLog(ptr: i32): void;
}

class Utility {
  revert(message: string): void {
    const input = new AString();
    input.set(message);
    const inPtr = input.store();
    __UtilApi__.revert(inPtr);
    throw new Error(message);
  }

  sLog(data: string): void {
    const dataPtr = new AString(data).store();
    __UtilApi__.sLog(dataPtr);
  }

  uint8ArrayToHex(data: Uint8Array): string {
    const outPtr = __UtilApi__.toHexString(new AUint8Array(data).store());
    const out = new AString();
    out.load(outPtr);
    return out.get();
  }

  hexToUint8Array(s: string): Uint8Array {
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
}

class ExtUtility extends Utility {
  public alloc(size: i32): i32 {
    return heap.alloc(size) as i32;
  }

  public stringToUint8Array(s: string): Uint8Array {
    const buffer = String.UTF8.encode(s);
    if (buffer.byteLength === 0) {
      return new Uint8Array(0);
    }
    return Uint8Array.wrap(buffer, 0, s.length);
  }

  public uint8ArrayToAddress(data: Uint8Array): ethereum.Address {
    const hex = String.UTF8.decode(data.buffer, false);
    return ethereum.Address.fromHexString(hex);
  }

  public uint8ArrayToString(arr: Uint8Array, decode: bool = true): string {
    if (decode) {
      return String.UTF8.decode(arr.buffer, false);
    }

    let result = '';
    for (let i = 0; i < arr.length; i++) {
      // Convert each byte to a character
      result += String.fromCharCode(arr[i]);
    }
    return result;
  }

  public uint8ArrayToBool(data: Uint8Array): bool {
    for (let i = 0; i < data.length; i++) {
      if (data[i] != 0) {
        return true;
      }
    }
    return false;
  }

  public boolToUint8Array(b: bool): Uint8Array {
    const result = new Uint8Array(1);
    result[0] = b ? 1 : 0;

    return result;
  }

  public arrayCopyPush<T>(a: Array<T>, elem: T): Array<T> {
    const res = new Array<T>(a.length + 1);
    for (let i = 0; i < a.length; i++) {
      res[i] = a[i];
    }
    res[a.length] = elem;
    return res;
  }

  public concatUint8Arrays(a: Uint8Array, b: Uint8Array): Uint8Array {
    const result = new Uint8Array(a.length + b.length);

    for (let i = 0; i < a.length; i++) {
      result[i] = a[i];
    }

    for (let i = 0; i < b.length; i++) {
      result[a.length + i] = b[i];
    }

    return result;
  }

  public encodeStringUTF8(str: string): ArrayBuffer {
    return String.UTF8.encode(str);
  }

  public parseCallMethod(data: Uint8Array): string {
    const s = super.uint8ArrayToHex(data);
    if (s.startsWith('0x')) {
      return s.substring(0, 10);
    }
    return '0x' + s.substring(0, 8);
  }
}
export const UtilityProvider = new ExtUtility();
