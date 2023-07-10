import {EthBlock, StateChanges, ScheduleMsg, } from "../proto";
import { Context } from "../host";
import { BigInt } from "../message";



class ContextValue {
    val : string;
    constructor(val: string) {
        this.val = val;
    }
    asI8(): i8 {return BigInt.fromString(this.val).toInt32() as i8;}
    asU8(): u8 {return BigInt.fromString(this.val).toInt32() as u8;}
    asI16(): i16 {return BigInt.fromString(this.val).toInt32() as i16;}
    asU16(): u16 {return BigInt.fromString(this.val).toInt32() as u16;}
    asI32(): i32 {return BigInt.fromString(this.val).toInt32();}
    asU32(): u32 {return BigInt.fromString(this.val).toUInt32();}
    asI64(): i64 {return BigInt.fromString(this.val).toInt64();}
    asU64(): u64 {return BigInt.fromString(this.val).toUInt64();}
    asString(): string {return this.val;}
    asBool(): bool {return (this.val.toLowerCase() === 'true');}
}


export class StateCtx {
    public getProperty(key: string): string {
        return Context.getProperty(key);
    }


    public getAspectState(key: string): ContextValue {
        return new ContextValue(Context.getAspectState(key));
    }

}


export class  DefaultApi extends  StateCtx{
    public lastBlock(): EthBlock | null {
        return Context.lastBlock();
    }
    public currentBalance(acct: string): BigInt | null {
        return Context.currentBalance(acct);
    }
}

export class  UniversalApi extends DefaultApi {
    public getContext(key: string): ContextValue {
        return new ContextValue(Context.getContext(key));
    }
    public setContext<T>(key: string, value: T): bool {
        let valueStr: string;
        switch (typeof value) {
            case 'bool':
            case 'string':
                valueStr = String(value);
                break;
            default:
                valueStr = '';
                break;
        }
        if (value instanceof BigInt) valueStr = value.toString();
        // @ts-ignore
        if (value instanceof i8) valueStr = BigInt.fromInt16(<i16>value).toString();
        // @ts-ignore
        if (value instanceof u8) valueStr = BigInt.fromUInt16(<u16>value).toString();
        // @ts-ignore
        if (value instanceof i16) valueStr = BigInt.fromInt16(value).toString();
        // @ts-ignore
        if (value instanceof u16) valueStr = BigInt.fromUInt16(value).toString();
        // @ts-ignore
        if (value instanceof i32) valueStr = BigInt.fromInt32(value).toString();
        // @ts-ignore
        if (value instanceof u32) valueStr = BigInt.fromUInt32(value).toString();
        // @ts-ignore
        if (value instanceof i64) valueStr = BigInt.fromInt64(value).toString();
        // @ts-ignore
        if (value instanceof u64) valueStr = BigInt.fromUInt64(value).toString();

        return Context.setContext(key, valueStr);
    }


    public currentBlock(): EthBlock | null {
        return Context.currentBlock();
    }


    public setAspectState<T>(key: string, value: T): bool {
        let valueStr: string;
        switch (typeof value) {
            case 'bool':
            case 'string':
                valueStr = String(value);
                break;
            default:
                valueStr = '';
                break;
        }
        if (value instanceof BigInt) valueStr = value.toString();
        // @ts-ignore
        if (value instanceof i8) valueStr = BigInt.fromInt16(<i16>value).toString();
        // @ts-ignore
        if (value instanceof u8) valueStr = BigInt.fromUInt16(<u16>value).toString();
        // @ts-ignore
        if (value instanceof i16) valueStr = BigInt.fromInt16(value).toString();
        // @ts-ignore
        if (value instanceof u16) valueStr = BigInt.fromUInt16(value).toString();
        // @ts-ignore
        if (value instanceof i32) valueStr = BigInt.fromInt32(value).toString();
        // @ts-ignore
        if (value instanceof u32) valueStr = BigInt.fromUInt32(value).toString();
        // @ts-ignore
        if (value instanceof i64) valueStr = BigInt.fromInt64(value).toString();
        // @ts-ignore
        if (value instanceof u64) valueStr = BigInt.fromUInt64(value).toString();

        return Context.setAspectState(key, valueStr);
    }
}
export class ScheduleCtx {
    public scheduleTx(sch: ScheduleMsg): bool {
        return Context.scheduleTx(sch);
    }
}
export class TraceCtx {
    public getStateChanges(addr: string, variable: string, key: Uint8Array): StateChanges {
        return Context.getStateChanges(addr, variable, key);
    }
}
