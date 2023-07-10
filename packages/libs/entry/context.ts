import {AspTransaction, StateChanges, ScheduleMsg, InnerTransaction} from "../proto";
import { Context } from "../host";
import { utils } from "../common";
import { UniversalApi,DefaultApi } from "./context_parent";
export interface ScheduleCtx {
    scheduleTx(sch: ScheduleMsg): bool;
}

export interface TraceCtx {
    getStateChanges(addr: string, variable: string, key: Uint8Array): StateChanges;
}
export class OnTxReceiveCtx extends DefaultApi{

    public localCall(input: string): string {
        return Context.localCall(input);
    }

    blockHeight: i64;
    tx: AspTransaction | null;

    constructor(blockHeight: i64, tx: AspTransaction | null) {
        super();
        this.blockHeight = blockHeight;
        this.tx = tx;
    };
}

export class OnBlockInitializeCtx extends UniversalApi implements ScheduleCtx{

    public scheduleTx(sch: ScheduleMsg): bool {
        return Context.scheduleTx(sch);
    }

    public revert(message: string): void {
        return utils.revert(message);
    }
    public localCall(input: string): string {
        return Context.localCall(input);
    }

    blockHeight: i64;
    tx: AspTransaction | null;

    constructor(blockHeight: i64, tx: AspTransaction | null) {
        super();
        this.blockHeight = blockHeight;
        this.tx = tx;
    };
}

export class OnTxVerifyCtx  extends UniversalApi{


    public revert(message: string): void {
        return utils.revert(message);
    }
    public localCall(input: string): string {
        return Context.localCall(input);
    }
    blockHeight: i64;
    tx: AspTransaction | null;

    constructor(blockHeight: i64, tx: AspTransaction | null) {
        super();
        this.blockHeight = blockHeight;
        this.tx = tx;
    };
}

export class OnAccountVerifyCtx  extends UniversalApi{


    public revert(message: string): void {
        return utils.revert(message);
    }
    public localCall(input: string): string {
        return Context.localCall(input);
    }

    blockHeight: i64;
    tx: AspTransaction | null;

    constructor(blockHeight: i64, tx: AspTransaction | null) {
        super();
        this.blockHeight = blockHeight;
        this.tx = tx;
    };
}

export class OnGasPaymentCtx extends UniversalApi{


    public revert(message: string): void {
        return utils.revert(message);
    }
    public localCall(input: string): string {
        return Context.localCall(input);
    }

    blockHeight: i64;
    tx: AspTransaction | null;

    constructor(blockHeight: i64, tx: AspTransaction | null) {
        super();
        this.blockHeight = blockHeight;
        this.tx = tx;
    };
}

export class PreTxExecuteCtx extends UniversalApi{

    public revert(message: string): void {
        return utils.revert(message);
    }

    public localCall(input: string): string {
        return Context.localCall(input);
    }
    blockHeight: i64;
    tx: AspTransaction | null;

    constructor(blockHeight: i64, tx: AspTransaction | null) {
        super();
        this.blockHeight = blockHeight;
        this.tx = tx;
    };
}

export class PreContractCallCtx  extends UniversalApi implements TraceCtx{


    public getStateChanges(addr: string, variable: string, key: Uint8Array): StateChanges {
        return Context.getStateChanges(addr, variable, key);
    }

    public revert(message: string): void {
        return utils.revert(message);
    }

    blockHeight: i64;
    originalTx: AspTransaction | null;
    currInnerTx:InnerTransaction | null ;

    constructor(blockHeight: i64, tx: AspTransaction | null,innerTx :InnerTransaction | null) {
        super();
        this.blockHeight = blockHeight;
        this.originalTx = tx;
        this.currInnerTx=innerTx;
    };
}

export class PostContractCallCtx extends UniversalApi implements TraceCtx{


    public getStateChanges(addr: string, variable: string, key: Uint8Array): StateChanges {
        return Context.getStateChanges(addr, variable, key);
    }

    public revert(message: string): void {
        return utils.revert(message);
    }


    blockHeight: i64;
    originalTx: AspTransaction | null;
    currInnerTx:InnerTransaction | null ;

    constructor(blockHeight: i64, tx: AspTransaction | null,currInnerTx:InnerTransaction | null) {
        super();
        this.blockHeight = blockHeight;
        this.originalTx = tx;
        this.currInnerTx=currInnerTx;
    };
}

export class PostTxExecuteCtx  extends UniversalApi implements TraceCtx{

    public getStateChanges(addr: string, variable: string, key: Uint8Array): StateChanges {
        return Context.getStateChanges(addr, variable, key);
    }

    public revert(message: string): void {
        return utils.revert(message);
    }

    blockHeight: i64;
    tx: AspTransaction | null;

    constructor(blockHeight: i64, tx: AspTransaction | null) {
        super();
        this.blockHeight = blockHeight;
        this.tx = tx;
    };
}

export class OnTxCommitCtx extends UniversalApi implements TraceCtx,ScheduleCtx{

    public localCall(input: string): string {
        return Context.localCall(input);
    }

    public scheduleTx(sch: ScheduleMsg): bool {
        return Context.scheduleTx(sch);
    }

    public getStateChanges(addr: string, variable: string, key: Uint8Array): StateChanges {
        return Context.getStateChanges(addr, variable, key);
    }



    blockHeight: i64;
    tx: AspTransaction | null;

    constructor(blockHeight: i64, tx: AspTransaction | null) {
        super();
        this.blockHeight = blockHeight;
        this.tx = tx;
    };
}

export class OnBlockFinalizeCtx extends UniversalApi implements ScheduleCtx{

    public localCall(input: string): string {
        return Context.localCall(input);
    }
    public scheduleTx(sch: ScheduleMsg): bool {
        return Context.scheduleTx(sch);
    }

    blockHeight: i64;
    tx: AspTransaction | null;

    constructor(blockHeight: i64, tx: AspTransaction | null) {
        super();
        this.blockHeight = blockHeight;
        this.tx = tx;
    };
}