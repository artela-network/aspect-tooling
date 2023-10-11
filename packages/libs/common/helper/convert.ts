import {ErrParseValueFail} from "../errors";
import {UtilApi} from "../../hostapi";
import {BigInt} from "../wraptypes/bigint";
import {ethereum} from "../abi";
export class ConvertUtil {
    public uint8ArrayToHex(data: Uint8Array): string {
        return UtilApi.instance().uint8ArrayToHex(data)
    }

    public hexToUint8Array(s: string): Uint8Array {
        return UtilApi.instance().hexToUint8Array(s)
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

    public uint8ArrayToString(arr: Uint8Array): string {
        return String.UTF8.decode(arr.buffer, false);
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

    public decodeUTF8(uint8Array: Uint8Array): string {
        return String.UTF8.decode(uint8Array);
    }

    public parseCallMethod(data: Uint8Array): string {
        const s = this.uint8ArrayToHex(data);
        if (s.startsWith('0x')) {
            return s.substring(0, 10);
        }
        return '0x' + s.substring(0, 8);
    }

    public toString<T>(value: T): string {
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

    public fromString<T>(value: string): T {
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
}

