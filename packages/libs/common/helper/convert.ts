import { ErrParseValueFail } from '../errors';
import { ethereum } from '../abi';
import { BigInt } from '../wraptypes/bigint';
import { Uint256 } from '../wraptypes/uint256';

export function uint8ArrayToHex(data: Uint8Array, prefix: string = ''): string {
  const hexChars = '0123456789abcdef';
  const result = new Uint8Array((data.length << 1) + prefix.length);

  for (let i = 0; i < prefix.length; i++) {
    result[i] = prefix.charCodeAt(i);
  }

  for (let i = 0; i < data.length; i++) {
    const byte = data[i];
    result[(i << 1) + prefix.length] = hexChars.charCodeAt(byte >> 4);
    result[(i << 1) + 1 + prefix.length] = hexChars.charCodeAt(byte & 0x0f);
  }

  return String.UTF8.decode(result.buffer);
}

export function hexToUint8Array(hex: string): Uint8Array {
  if (hex.length & 1) {
    return new Uint8Array(0);
  }
  if (hex.startsWith('0x')) {
    hex = hex.substr(2);
  }
  const length = hex.length;
  const bytes = new Uint8Array(length / 2);

  for (let i: i32 = 0, j: i32 = 0; i < length; i += 2, j++) {
    bytes[j] = u8.parse(hex.substr(i, 2), 16);
  }

  return bytes;
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

export function decodeUTF8(uint8Array: Uint8Array): string {
  return String.UTF8.decode(uint8Array.buffer);
}

const base64chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

export function base64Encode(bytes: Uint8Array): string {
  let result = '';
  let i = 0;
  const l = bytes.length;
  for (i = 2; i < l; i += 3) {
    result += base64chars.charAt(bytes[i - 2] >> 2);
    result += base64chars.charAt(((bytes[i - 2] & 0x03) << 4) | (bytes[i - 1] >> 4));
    result += base64chars.charAt(((bytes[i - 1] & 0x0f) << 2) | (bytes[i] >> 6));
    result += base64chars.charAt(bytes[i] & 0x3f);
  }

  // Handle padding
  if (i === l + 1) {
    // two bytes left
    result += base64chars.charAt(bytes[i - 2] >> 2);
    result += base64chars.charAt((bytes[i - 2] & 0x03) << 4);
    result += '==';
  } else if (i === l) {
    // one byte left
    result += base64chars.charAt(bytes[i - 2] >> 2);
    result += base64chars.charAt(((bytes[i - 2] & 0x03) << 4) | (bytes[i - 1] >> 4));
    result += base64chars.charAt((bytes[i - 1] & 0x0f) << 2);
    result += '=';
  }

  return result;
}

export function base64Decode(str: string): Uint8Array {
  const pad = str.endsWith('==') ? 2 : str.endsWith('=') ? 1 : 0;
  const length = (str.length * 3) / 4 - pad;
  const buffer = new Uint8Array(length);
  let j = 0;

  for (let i = 0; i < str.length;) {
    const c1 = base64chars.indexOf(str.charAt(i++));
    const c2 = base64chars.indexOf(str.charAt(i++));
    const c3 = base64chars.indexOf(str.charAt(i++));
    const c4 = base64chars.indexOf(str.charAt(i++));

    buffer[j++] = (c1 << 2) | (c2 >> 4);
    if (j < length) {
      buffer[j++] = ((c2 & 15) << 4) | (c3 >> 2);
    }
    if (j < length) {
      buffer[j++] = ((c3 & 3) << 6) | c4;
    }
  }

  return buffer;
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
  let valueStr: string | null = null;
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

  if (valueStr == null) {
    valueStr = '';
  }
  return valueStr;
}

export function fromString<T>(value: string): T {
  if (isBoolean<T>()) return changetype<T>(value == '1');
  if (isInteger<T>() && !isSigned<T>() && sizeof<T>() == 1) return u8.parse(value, 10) as T;
  if (isInteger<T>() && isSigned<T>() && sizeof<T>() == 1) return i8.parse(value, 10) as T;
  if (isInteger<T>() && !isSigned<T>() && sizeof<T>() == 2) return u16.parse(value, 10) as T;
  if (isInteger<T>() && isSigned<T>() && sizeof<T>() == 2) return i16.parse(value, 10) as T;
  if (isInteger<T>() && !isSigned<T>() && sizeof<T>() == 4) return u32.parse(value, 10) as T;
  if (isInteger<T>() && isSigned<T>() && sizeof<T>() == 4) return i32.parse(value, 10) as T;
  if (isInteger<T>() && !isSigned<T>() && sizeof<T>() == 8) return u64.parse(value, 10) as T;
  if (isInteger<T>() && isSigned<T>() && sizeof<T>() == 8) return i64.parse(value, 10) as T;
  if (idof<T>() == idof<BigInt>()) return changetype<T>(BigInt.fromString(value));
  if (idof<T>() == idof<string>()) return changetype<T>(value);

  throw ErrParseValueFail;
}

export function toUint8Array<T>(value: T): Uint8Array {
  if (!value) {
    return new Uint8Array(0);
  }
  let valueBuffer: Uint8Array | null = null;
  if (value instanceof string) valueBuffer = stringToUint8Array(<string>value);
  if (value instanceof bool) valueBuffer = booleanToUint8Array(<bool>value);
  if (value instanceof BigInt) valueBuffer = (<BigInt>value).toUint8ArrayWithSign();
  if (value instanceof Uint8Array) valueBuffer = value as Uint8Array;
  if (value instanceof i8) {
    valueBuffer = BigInt.fromInt16(<i16>value).toUint8ArrayWithSign();
  }
  if (value instanceof u8) {
    valueBuffer = BigInt.fromUInt16(<u16>value).toUint8ArrayWithSign();
  }
  if (value instanceof i16) {
    valueBuffer = BigInt.fromInt16(<i16>value).toUint8ArrayWithSign();
  }
  if (value instanceof u16) {
    valueBuffer = BigInt.fromUInt16(<u16>value).toUint8ArrayWithSign();
  }
  if (value instanceof i32) {
    valueBuffer = BigInt.fromInt32(<i32>value).toUint8ArrayWithSign();
  }
  if (value instanceof u32) {
    valueBuffer = BigInt.fromUInt32(<u32>value).toUint8ArrayWithSign();
  }
  if (value instanceof i64) {
    valueBuffer = BigInt.fromInt64(<i64>value).toUint8ArrayWithSign();
  }
  if (value instanceof u64) {
    valueBuffer = BigInt.fromUInt64(<u64>value).toUint8ArrayWithSign();
  }

  if (valueBuffer == null) {
    valueBuffer = new Uint8Array(0);
  }
  return valueBuffer;
}

export function fromUint8Array<T>(value: Uint8Array): T {
  if (isBoolean<T>()) return changetype<T>(value.length > 0 && value[0] > 0);
  if (isInteger<T>() && !isSigned<T>() && sizeof<T>() == 1) {
    return BigInt.fromUint8ArrayWithSign(value).toUInt8() as T;
  }
  if (isInteger<T>() && isSigned<T>() && sizeof<T>() == 1) {
    return BigInt.fromUint8ArrayWithSign(value).toInt8() as T;
  }
  if (isInteger<T>() && !isSigned<T>() && sizeof<T>() == 2) {
    return BigInt.fromUint8ArrayWithSign(value).toUInt16() as T;
  }
  if (isInteger<T>() && isSigned<T>() && sizeof<T>() == 2) {
    return BigInt.fromUint8ArrayWithSign(value).toInt16() as T;
  }
  if (isInteger<T>() && !isSigned<T>() && sizeof<T>() == 4) {
    return BigInt.fromUint8ArrayWithSign(value).toUInt32() as T;
  }
  if (isInteger<T>() && isSigned<T>() && sizeof<T>() == 4) {
    return BigInt.fromUint8ArrayWithSign(value).toInt32() as T;
  }
  if (isInteger<T>() && !isSigned<T>() && sizeof<T>() == 8)
    return BigInt.fromUint8ArrayWithSign(value).toUInt64() as T;
  if (isInteger<T>() && isSigned<T>() && sizeof<T>() == 8)
    return BigInt.fromUint8ArrayWithSign(value).toInt64() as T;
  if (idof<T>() == idof<Uint8Array>()) {
    return value as T;
  }
  if (idof<T>() == idof<BigInt>()) {
    return changetype<T>(BigInt.fromUint8ArrayWithSign(value));
  }
  if (idof<T>() == idof<string>()) return changetype<T>(uint8ArrayToString(value));

  throw ErrParseValueFail;
}

export function fromExternalUint8Array<T>(value: Uint8Array): T {
  if (isInteger<T>()) {
    if (isSigned<T>()) {
      /*const isNegative = (value[0] & 0x80) != 0;
      // copy input to a new Uint8Array
      let unsigned = new Uint8Array(32); */
      // TODO
      throw new Error("Value must be a positive integer");
    }

    const u256Value = Uint256.fromUint8Array(value);
    if (sizeof<T>() == 1) {
      return u256Value.toUInt8() as T;
    } else if (sizeof<T>() == 2) {
      return u256Value.toUInt16() as T;
    } else if (sizeof<T>() == 4) {
      return u256Value.toUInt32() as T;
    } else if (sizeof<T>() == 8) {
      return u256Value.toUInt64() as T;
    }
  } else if (isBoolean<T>()) {
    return changetype<T>(value.length > 0 && value[0] > 0);
  } else if (idof<T>() == idof<Uint256>()) {
    return changetype<T>(Uint256.fromUint8Array(value));
  } else if (idof<T>() == idof<string>()) {
    return changetype<T>(uint8ArrayToString(value));
  } else if (idof<T>() == idof<Uint8Array>()) {
    return value as T;
  }

  throw new Error("convert failed");
}

function booleanToUint8Array(value: bool): Uint8Array {
  const array = new Uint8Array(1);
  array[0] = value ? 1 : 0;
  return array;
}
