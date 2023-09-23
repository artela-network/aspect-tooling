import { AString, AUint8Array, BigInt } from '../types';
import { ethereum } from '../common';
import { ErrParseValueFail } from './errors';

declare namespace __UtilApi__ {
  function fromHexString(input: i32): i32;

  function toHexString(input: i32): i32;

  function revert(ptr: i32): void;

  function sLog(ptr: i32): void;
}

export namespace utils {
  export function revert(message: string): void {
    const input = new AString();
    input.set(message);
    const inPtr = input.store();
    __UtilApi__.revert(inPtr);
    throw new Error(message);
  }

  export function log(data: string): void {
    const dataPtr = new AString(data).store();
    __UtilApi__.sLog(dataPtr);
  }

  export function uint8ArrayToHex(data: Uint8Array): string {
    const outPtr = __UtilApi__.toHexString(new AUint8Array(data).store());
    const out = new AString();
    out.load(outPtr);
    return out.get();
  }

  export function hexToUint8Array(s: string): Uint8Array {
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

  export function alloc(size: i32): i32 {
    return heap.alloc(size) as i32;
  }

  export function stringToUint8Array(s: string): Uint8Array {
    const buffer = String.UTF8.encode(s);
    if (buffer.byteLength === 0) {
      return new Uint8Array(0);
    }
    return Uint8Array.wrap(buffer, 0, s.length);
  }

  export function uint8ArrayToAddress(data: Uint8Array): ethereum.Address {
    const hex = String.UTF8.decode(data.buffer, false);
    return ethereum.Address.fromHexString(hex);
  }

  export function uint8ArrayToString(arr: Uint8Array): string {
    return String.UTF8.decode(arr.buffer, false);
  }

  export function uint8ArrayToBool(data: Uint8Array): bool {
    for (let i = 0; i < data.length; i++) {
      if (data[i] != 0) {
        return true;
      }
    }
    return false;
  }

  export function boolToUint8Array(b: bool): Uint8Array {
    const result = new Uint8Array(1);
    result[0] = b ? 1 : 0;

    return result;
  }

  export function arrayCopyPush<T>(a: Array<T>, elem: T): Array<T> {
    const res = new Array<T>(a.length + 1);
    for (let i = 0; i < a.length; i++) {
      res[i] = a[i];
    }
    res[a.length] = elem;
    return res;
  }

  export function concatUint8Arrays(a: Uint8Array, b: Uint8Array): Uint8Array {
    const result = new Uint8Array(a.length + b.length);

    for (let i = 0; i < a.length; i++) {
      result[i] = a[i];
    }

    for (let i = 0; i < b.length; i++) {
      result[a.length + i] = b[i];
    }

    return result;
  }

  export function encodeStringUTF8(str: string): ArrayBuffer {
    return String.UTF8.encode(str);
  }

  export function parseCallMethod(data: Uint8Array): string {
    const s = uint8ArrayToHex(data);
    if (s.startsWith('0x')) {
      return s.substring(0, 10);
    }
    return '0x' + s.substring(0, 8);
  }

  export function toString<T>(value: T): string {
    if (!value) {
      return '';
    }
    let valueStr: string;
    if (value instanceof string) valueStr = <string>value;
    if (value instanceof bool) valueStr = value ? '1' : '0';
    if (value instanceof BigInt) valueStr = value.toString();
    if (value instanceof i8) valueStr = BigInt.fromInt16(<i16>value).toString();
    if (value instanceof u8) valueStr = BigInt.fromUInt16(<u16>value).toString();
    if (value instanceof i16) valueStr = BigInt.fromInt16(<i16>value).toString();
    if (value instanceof u16) valueStr = BigInt.fromUInt16(<u16>value).toString();
    if (value instanceof i32) valueStr = BigInt.fromInt32(<i32>value).toString();
    if (value instanceof u32) valueStr = BigInt.fromUInt32(<u32>value).toString();
    if (value instanceof i64) valueStr = BigInt.fromInt64(<i64>value).toString();
    if (value instanceof u64) valueStr = BigInt.fromUInt64(<u64>value).toString();

    valueStr ||= '';
    return valueStr;
  }

  export function fromString<T>(value: string): T | null {
    if (!value) {
      return null;
    }
    if (idof<T>() == idof<string>()) return changetype<T>(value);
    if (idof<T>() == idof<bool>()) return changetype<T>(value ? '1' : '0');
    if (idof<T>() == idof<BigInt>()) return changetype<T>(BigInt.fromString(value));
    if (idof<T>() == idof<i8>()) return changetype<T>(<i8>BigInt.fromString(value).toInt32());
    if (idof<T>() == idof<u8>()) return changetype<T>(<u8>BigInt.fromString(value).toUInt32());
    if (idof<T>() == idof<i16>()) return changetype<T>(<i16>BigInt.fromString(value).toInt32());
    if (idof<T>() == idof<u16>()) return changetype<T>(<u16>BigInt.fromString(value).toUInt32());
    if (idof<T>() == idof<i32>()) return changetype<T>(BigInt.fromString(value).toInt32());
    if (idof<T>() == idof<u32>()) return changetype<T>(BigInt.fromString(value).toUInt32());
    if (idof<T>() == idof<i64>()) return changetype<T>(<i64>BigInt.fromString(value).toInt64());
    if (idof<T>() == idof<u64>()) return changetype<T>(<u64>BigInt.fromString(value).toUInt64());

    throw ErrParseValueFail;
  }
}
