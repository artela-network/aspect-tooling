import {EthInnerTransaction, EthStackTransaction, EthTransaction} from "../../proto";
import {BlockContext,} from "../../context";
import {AspectContext, JustInTimeCaller} from "../../system";
import {StateContext} from "../../system/statedb-api";
import {TraceContext} from "../../context/tx-context";


export class PreContractCallCtx {

    private _tx: EthTransaction | null;
    private _innerTx: EthInnerTransaction | null;

    private _context: AspectContext;
    private _jitCall: JustInTimeCaller
    private _blockContext: BlockContext;
    private _stateContext:StateContext;
    private _traceContext:TraceContext;

    constructor(tx: EthTransaction | null, innerTx: EthInnerTransaction | null) {
        if (tx) {
            this._tx = tx;
        }
        if (innerTx) {
            this._innerTx = innerTx;
        }
        this._context = new AspectContext();
        this._jitCall = new JustInTimeCaller();
        this._blockContext = new BlockContext();
        this._stateContext = new StateContext();
        this._traceContext = new TraceContext();
    };


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

    get context(): AspectContext {
        return this._context;
    }

    get jitCall(): JustInTimeCaller {
        return this._jitCall;
    }
}

export class PostContractCallCtx {

    private _tx: EthTransaction | null;
    private _currInnerTx: EthStackTransaction | null;

    private _context: AspectContext;
    private _jitCall: JustInTimeCaller
    private _blockContext: BlockContext;
    private _stateContext:StateContext;
    private _traceContext:TraceContext;



    constructor(tx: EthTransaction | null, innerTx: EthStackTransaction | null) {
        if (tx) {
            this._tx = tx;
        }
        if (innerTx) {
            this._currInnerTx = innerTx;
        }
        this._context = new AspectContext();
        this._jitCall = new JustInTimeCaller();
        this._blockContext = new BlockContext();
        this._stateContext = new StateContext();
        this._traceContext = new TraceContext();

    };

    get blockContext(): BlockContext {
        return this._blockContext;
    }

    get currInnerTx(): EthStackTransaction |null {
        return this._currInnerTx;
    }

    get tx(): EthTransaction {
        return this._tx;
    }

    get jitCall(): JustInTimeCaller {
        return this._jitCall;
    }

    get context(): AspectContext {
        return this._context;
    }


    get stateContext(): StateContext {
        return this._stateContext;
    }

    get traceContext(): TraceContext {
        return this._traceContext;
    }
}
