import {AspTransaction, EthBlock, StateChanges, ScheduleMsg, InnerTransaction} from "../proto";
import { Context } from "../host";
import { utils } from "../common";
import { BigInt } from "../message";

export interface ScheduleCtx {
    scheduleTx(sch: ScheduleMsg): bool;
}

export interface TraceCtx {
    getStateChanges(addr: string, variable: string, key: Uint8Array): StateChanges;
}

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

    public getAspectState(key: string): string {
        return Context.getAspectState(key);
    }

    constructor() { };
}

export class OnTxReceiveCtx {
    public lastBlock(): EthBlock | null {
        return Context.lastBlock();
    }

    public localCall(input: string): string {
        return Context.localCall(input);
    }

    public getProperty(key: string): string {
        return Context.getProperty(key);
    }

    // i8 / u8 / i16 / u16 / i32 / u32 / i64 / u64 / bool / string / bigint
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
    
    public getContext(key: string): ContextValue {

        return new ContextValue(Context.getContext(key));
    }

    public setAspectState(key: string, value: string): bool {
        return Context.setAspectState(key, value);
    }

    public getAspectState(key: string): string {
        return Context.getAspectState(key);
    }

    public currentBalance(acct: string): BigInt | null {
        return Context.currentBalance(acct);
    }

    blockHeight: i64;
    tx: AspTransaction | null;

    constructor(blockHeight: i64, tx: AspTransaction | null) {
        this.blockHeight = blockHeight;
        this.tx = tx;
    };
}

export class OnBlockInitializeCtx implements ScheduleCtx {
    public lastBlock(): EthBlock | null {
        return Context.lastBlock();
    }

    public currentBlock(): EthBlock | null {
        return Context.currentBlock();
    }

    public localCall(input: string): string {
        return Context.localCall(input);
    }

    public getProperty(key: string): string {
        return Context.getProperty(key);
    }

    public setContext(key: string, value: string): bool {
        return Context.setContext(key, value);
    }

    public getContext(key: string): string {
        return Context.getContext(key);
    }

    public setAspectState(key: string, value: string): bool {
        return Context.setAspectState(key, value);
    }

    public getAspectState(key: string): string {
        return Context.getAspectState(key);
    }

    public scheduleTx(sch: ScheduleMsg): bool {
        return Context.scheduleTx(sch);
    }

    public revert(message: string): void {
        return utils.revert(message);
    }

    public currentBalance(acct: string): BigInt | null {
        return Context.currentBalance(acct);
    }

    blockHeight: i64;
    tx: AspTransaction | null;

    constructor(blockHeight: i64, tx: AspTransaction | null) {
        this.blockHeight = blockHeight;
        this.tx = tx;
    };
}

export class OnTxVerifyCtx {
    public lastBlock(): EthBlock | null {
        return Context.lastBlock();
    }

    public currentBlock(): EthBlock | null {
        return Context.currentBlock();
    }

    public localCall(input: string): string {
        return Context.localCall(input);
    }

    public getProperty(key: string): string {
        return Context.getProperty(key);
    }

    public setContext(key: string, value: string): bool {
        return Context.setContext(key, value);
    }

    public getContext(key: string): string {
        return Context.getContext(key);
    }

    public setAspectState(key: string, value: string): bool {
        return Context.setAspectState(key, value);
    }

    public getAspectState(key: string): string {
        return Context.getAspectState(key);
    }

    public revert(message: string): void {
        return utils.revert(message);
    }

    public currentBalance(acct: string): BigInt | null {
        return Context.currentBalance(acct);
    }

    blockHeight: i64;
    tx: AspTransaction | null;

    constructor(blockHeight: i64, tx: AspTransaction | null) {
        this.blockHeight = blockHeight;
        this.tx = tx;
    };
}

export class OnAccountVerifyCtx {
    public lastBlock(): EthBlock | null {
        return Context.lastBlock();
    }

    public currentBlock(): EthBlock | null {
        return Context.currentBlock();
    }

    public localCall(input: string): string {
        return Context.localCall(input);
    }

    public getProperty(key: string): string {
        return Context.getProperty(key);
    }

    public setContext(key: string, value: string): bool {
        return Context.setContext(key, value);
    }

    public getContext(key: string): string {
        return Context.getContext(key);
    }

    public setAspectState(key: string, value: string): bool {
        return Context.setAspectState(key, value);
    }

    public getAspectState(key: string): string {
        return Context.getAspectState(key);
    }

    public revert(message: string): void {
        return utils.revert(message);
    }

    public currentBalance(acct: string): BigInt | null {
        return Context.currentBalance(acct);
    }

    blockHeight: i64;
    tx: AspTransaction | null;

    constructor(blockHeight: i64, tx: AspTransaction | null) {
        this.blockHeight = blockHeight;
        this.tx = tx;
    };
}

export class OnGasPaymentCtx {
    public lastBlock(): EthBlock | null {
        return Context.lastBlock();
    }

    public currentBlock(): EthBlock | null {
        return Context.currentBlock();
    }

    public localCall(input: string): string {
        return Context.localCall(input);
    }

    public getProperty(key: string): string {
        return Context.getProperty(key);
    }

    public setContext(key: string, value: string): bool {
        return Context.setContext(key, value);
    }

    public getContext(key: string): string {
        return Context.getContext(key);
    }

    public setAspectState(key: string, value: string): bool {
        return Context.setAspectState(key, value);
    }

    public getAspectState(key: string): string {
        return Context.getAspectState(key);
    }

    public revert(message: string): void {
        return utils.revert(message);
    }

    public currentBalance(acct: string): BigInt | null {
        return Context.currentBalance(acct);
    }

    blockHeight: i64;
    tx: AspTransaction | null;

    constructor(blockHeight: i64, tx: AspTransaction | null) {
        this.blockHeight = blockHeight;
        this.tx = tx;
    };
}

export class PreTxExecuteCtx {
    public lastBlock(): EthBlock | null {
        return Context.lastBlock();
    }

    public currentBlock(): EthBlock | null {
        return Context.currentBlock();
    }

    public localCall(input: string): string {
        return Context.localCall(input);
    }

    public getProperty(key: string): string {
        return Context.getProperty(key);
    }

    public setContext(key: string, value: string): bool {
        return Context.setContext(key, value);
    }

    public getContext(key: string): string {
        return Context.getContext(key);
    }

    public setAspectState(key: string, value: string): bool {
        return Context.setAspectState(key, value);
    }

    public getAspectState(key: string): string {
        return Context.getAspectState(key);
    }

    public revert(message: string): void {
        return utils.revert(message);
    }

    public currentBalance(acct: string): BigInt | null {
        return Context.currentBalance(acct);
    }

    blockHeight: i64;
    tx: AspTransaction | null;

    constructor(blockHeight: i64, tx: AspTransaction | null) {
        this.blockHeight = blockHeight;
        this.tx = tx;
    };
}

export class PreContractCallCtx implements TraceCtx {
    public lastBlock(): EthBlock | null {
        return Context.lastBlock();
    }

    public currentBlock(): EthBlock | null {
        return Context.currentBlock();
    }

    public getProperty(key: string): string {
        return Context.getProperty(key);
    }

    public setContext(key: string, value: string): bool {
        return Context.setContext(key, value);
    }

    public getContext(key: string): string {
        return Context.getContext(key);
    }

    public setAspectState(key: string, value: string): bool {
        return Context.setAspectState(key, value);
    }

    public getAspectState(key: string): string {
        return Context.getAspectState(key);
    }

    public getStateChanges(addr: string, variable: string, key: Uint8Array): StateChanges {
        return Context.getStateChanges(addr, variable, key);
    }

    public revert(message: string): void {
        return utils.revert(message);
    }

    public currentBalance(acct: string): BigInt | null {
        return Context.currentBalance(acct);
    }

    blockHeight: i64;
    originalTx: AspTransaction | null;
    currInnerTx:InnerTransaction | null ;

    constructor(blockHeight: i64, tx: AspTransaction | null,innerTx :InnerTransaction | null) {
        this.blockHeight = blockHeight;
        this.originalTx = tx;
        this.currInnerTx=innerTx;
    };
}

export class PostContractCallCtx implements TraceCtx {
    public lastBlock(): EthBlock | null {
        return Context.lastBlock();
    }

    public currentBlock(): EthBlock | null {
        return Context.currentBlock();
    }

    public getProperty(key: string): string {
        return Context.getProperty(key);
    }

    public setContext(key: string, value: string): bool {
        return Context.setContext(key, value);
    }

    public getContext(key: string): string {
        return Context.getContext(key);
    }

    public setAspectState(key: string, value: string): bool {
        return Context.setAspectState(key, value);
    }

    public getAspectState(key: string): string {
        return Context.getAspectState(key);
    }

    public getStateChanges(addr: string, variable: string, key: Uint8Array): StateChanges {
        return Context.getStateChanges(addr, variable, key);
    }

    public revert(message: string): void {
        return utils.revert(message);
    }

    public currentBalance(acct: string): BigInt | null {
        return Context.currentBalance(acct);
    }

    blockHeight: i64;
    originalTx: AspTransaction | null;
    currInnerTx:InnerTransaction | null ;

    constructor(blockHeight: i64, tx: AspTransaction | null,currInnerTx:InnerTransaction | null) {
        this.blockHeight = blockHeight;
        this.originalTx = tx;
        this.currInnerTx=currInnerTx;
    };
}

export class PostTxExecuteCtx implements TraceCtx {
    public lastBlock(): EthBlock | null {
        return Context.lastBlock();
    }

    public currentBlock(): EthBlock | null {
        return Context.currentBlock();
    }

    public localCall(input: string): string {
        return Context.localCall(input);
    }

    public getProperty(key: string): string {
        return Context.getProperty(key);
    }

    public setContext(key: string, value: string): bool {
        return Context.setContext(key, value);
    }

    public getContext(key: string): string {
        return Context.getContext(key);
    }

    public setAspectState(key: string, value: string): bool {
        return Context.setAspectState(key, value);
    }

    public getAspectState(key: string): string {
        return Context.getAspectState(key);
    }

    public getStateChanges(addr: string, variable: string, key: Uint8Array): StateChanges {
        return Context.getStateChanges(addr, variable, key);
    }

    public revert(message: string): void {
        return utils.revert(message);
    }

    public currentBalance(acct: string): BigInt | null {
        return Context.currentBalance(acct);
    }

    blockHeight: i64;
    tx: AspTransaction | null;

    constructor(blockHeight: i64, tx: AspTransaction | null) {
        this.blockHeight = blockHeight;
        this.tx = tx;
    };
}

export class OnTxCommitCtx implements ScheduleCtx, TraceCtx {
    public lastBlock(): EthBlock | null {
        return Context.lastBlock();
    }

    public currentBlock(): EthBlock | null {
        return Context.currentBlock();
    }

    public localCall(input: string): string {
        return Context.localCall(input);
    }

    public getProperty(key: string): string {
        return Context.getProperty(key);
    }

    public setContext(key: string, value: string): bool {
        return Context.setContext(key, value);
    }

    public getContext(key: string): string {
        return Context.getContext(key);
    }

    public setAspectState(key: string, value: string): bool {
        return Context.setAspectState(key, value);
    }

    public getAspectState(key: string): string {
        return Context.getAspectState(key);
    }

    public scheduleTx(sch: ScheduleMsg): bool {
        return Context.scheduleTx(sch);
    }

    public getStateChanges(addr: string, variable: string, key: Uint8Array): StateChanges {
        return Context.getStateChanges(addr, variable, key);
    }

    public currentBalance(acct: string): BigInt | null {
        return Context.currentBalance(acct);
    }

    blockHeight: i64;
    tx: AspTransaction | null;

    constructor(blockHeight: i64, tx: AspTransaction | null) {
        this.blockHeight = blockHeight;
        this.tx = tx;
    };
}

export class OnBlockFinalizeCtx implements ScheduleCtx {
    public lastBlock(): EthBlock | null {
        return Context.lastBlock();
    }

    public currentBlock(): EthBlock | null {
        return Context.currentBlock();
    }

    public localCall(input: string): string {
        return Context.localCall(input);
    }

    public getProperty(key: string): string {
        return Context.getProperty(key);
    }

    public setContext(key: string, value: string): bool {
        return Context.setContext(key, value);
    }

    public getContext(key: string): string {
        return Context.getContext(key);
    }

    public setAspectState(key: string, value: string): bool {
        return Context.setAspectState(key, value);
    }

    public getAspectState(key: string): string {
        return Context.getAspectState(key);
    }

    public scheduleTx(sch: ScheduleMsg): bool {
        return Context.scheduleTx(sch);
    }

    public currentBalance(acct: string): BigInt | null {
        return Context.currentBalance(acct);
    }

    blockHeight: i64;
    tx: AspTransaction | null;

    constructor(blockHeight: i64, tx: AspTransaction | null) {
        this.blockHeight = blockHeight;
        this.tx = tx;
    };
}