import {EthInnerTransaction, EthStackTransaction, EthTransaction} from "../../proto";
import {BlockContext, TraceContext, TxContext} from "../../context";
import {AspectContext, JustInTimeCaller,StateContext} from "../../system";


export class PreContractCallCtx {

    private _tx: EthTransaction | null;
    private _innerTx: EthInnerTransaction | null;

    private _aspectContext: AspectContext;
    private _jitCall: JustInTimeCaller
    private _blockContext: BlockContext;
    private _stateContext:StateContext;
    private _traceContext:TraceContext;
    private _txContext:TxContext;


    constructor(tx: EthTransaction | null, innerTx: EthInnerTransaction | null) {
        if (tx) {
            this._tx = tx;
        }
        if (innerTx) {
            this._innerTx = innerTx;
        }
        this._aspectContext = new AspectContext();
        this._jitCall = new JustInTimeCaller();
        this._blockContext = new BlockContext();
        this._stateContext = new StateContext();
        this._traceContext = new TraceContext();
        this._txContext = new TxContext();
    };


    get txContext(): TxContext {
        return this._txContext;
    }

    get blockContext(): BlockContext {
        return this._blockContext;
    }

    get tx(): EthTransaction | null {
        return this._tx;
    }

    get currInnerTx(): EthInnerTransaction | null {
        return this._innerTx;
    }

    get stateContext(): StateContext {
        return this._stateContext;
    }

    get traceContext(): TraceContext {
        return this._traceContext;
    }

    get aspectContext(): AspectContext {
        return this._aspectContext;
    }

    get jitCall(): JustInTimeCaller {
        return this._jitCall;
    }
}

export class PostContractCallCtx {

    private _tx: EthTransaction | null;
    private _currInnerTx: EthStackTransaction | null;

    private _aspectContext: AspectContext;
    private _jitCall: JustInTimeCaller
    private _blockContext: BlockContext;
    private _stateContext:StateContext;
    private _traceContext:TraceContext;
    private _txContext:TxContext;


    constructor(tx: EthTransaction | null, innerTx: EthStackTransaction | null) {
        if (tx) {
            this._tx = tx;
        }
        if (innerTx) {
            this._currInnerTx = innerTx;
        }
        this._aspectContext = new AspectContext();
        this._jitCall = new JustInTimeCaller();
        this._blockContext = new BlockContext();
        this._stateContext = new StateContext();
        this._traceContext = new TraceContext();
        this._txContext = new TxContext();
    };


    get txContext(): TxContext {
        return this._txContext;
    }

    get blockContext(): BlockContext {
        return this._blockContext;
    }

    get currInnerTx(): EthStackTransaction |null {
        return this._currInnerTx;
    }

    get tx(): EthTransaction|null {
        return this._tx;
    }

    get jitCall(): JustInTimeCaller {
        return this._jitCall;
    }

    get aspectContext(): AspectContext {
        return this._aspectContext;
    }

    get stateContext(): StateContext {
        return this._stateContext;
    }

    get traceContext(): TraceContext {
        return this._traceContext;
    }
}
