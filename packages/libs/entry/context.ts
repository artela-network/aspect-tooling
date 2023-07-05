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