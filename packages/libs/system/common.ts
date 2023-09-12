import {BigInt} from "../types";


export class ContextValue {
    val: string;

    constructor(val: string) {
        this.val = val;
    }

    asI8(): i8 {
        return BigInt.fromString(this.val).toInt32() as i8;
    }

    asU8(): u8 {
        return BigInt.fromString(this.val).toInt32() as u8;
    }

    asI16(): i16 {
        return BigInt.fromString(this.val).toInt32() as i16;
    }

    asU16(): u16 {
        return BigInt.fromString(this.val).toInt32() as u16;
    }

    asI32(): i32 {
        return BigInt.fromString(this.val).toInt32();
    }

    asU32(): u32 {
        return BigInt.fromString(this.val).toUInt32();
    }

    asI64(): i64 {
        return BigInt.fromString(this.val).toInt64();
    }

    asU64(): u64 {
        return BigInt.fromString(this.val).toUInt64();
    }

    asString(): string {
        return this.val;
    }

    asBool(): bool {
        return (this.val.toLowerCase() === '1');
    }
}

export function ToContextValue(value: string): ContextValue {
    return new ContextValue(value)
}

export function ToString<T>(value: T): string {

    let valueStr: string;
    if (value instanceof string) valueStr = value.toString();
    if (value instanceof bool) valueStr = value ? "1" : "0";
    if (value instanceof BigInt) valueStr = value.toString();
    if (value instanceof i8) valueStr = BigInt.fromInt16(<i16>value).toString();
    if (value instanceof u8) valueStr = BigInt.fromUInt16(<u16>value).toString();
    if (value instanceof i16) valueStr = BigInt.fromInt16(value).toString();
    if (value instanceof u16) valueStr = BigInt.fromUInt16(value).toString();
    if (value instanceof i32) valueStr = BigInt.fromInt32(value).toString();
    if (value instanceof u32) valueStr = BigInt.fromUInt32(value).toString();
    if (value instanceof i64) valueStr = BigInt.fromInt64(value).toString();
    if (value instanceof u64) valueStr = BigInt.fromUInt64(value).toString();
    return valueStr
}