import {EthInnerTransaction, EthStackTransaction, EthTransaction} from "../../proto";
import {BlockContext, EvmInnerTxContext,} from "../../context";
import {AspectContext, JustInTimeCaller} from "../../system";


export class PreContractCallCtx {

    private _tx: EthTransaction | null;
    private _innerTx: EthInnerTransaction | null;

    private _innerTxContext: EvmInnerTxContext | null;
    private _context: AspectContext;
    private _jitCall: JustInTimeCaller
    private _blockContext: BlockContext;

    constructor(tx: EthTransaction | null, innerTx: EthInnerTransaction | null) {
        if (tx) {
            this._tx = tx;
        }
        if (innerTx) {
            this._innerTx = innerTx;
        }
        this._context = new AspectContext();
        this._jitCall = new JustInTimeCaller();
        this._innerTxContext = new EvmInnerTxContext(innerTx);
        this._blockContext = new BlockContext();
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

    get innerTxContext(): EvmInnerTxContext | null {
        return this._innerTxContext;
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
    private _innerTx: EthStackTransaction | null;

    private _innerTxContext: EvmInnerTxContext | null;
    private _context: AspectContext;
    private _jitCall: JustInTimeCaller
    private _blockContext: BlockContext;


    constructor(tx: EthTransaction | null, innerTx: EthStackTransaction | null) {
        if (tx) {
            this._tx = tx;
        }
        if (innerTx) {
            this._innerTx = innerTx;
            const transaction = new EthInnerTransaction(innerTx.from, innerTx.to, innerTx.data, innerTx.value, innerTx.gas);
            this._innerTxContext = new EvmInnerTxContext(transaction);
        }
        this._context = new AspectContext();
        this._jitCall = new JustInTimeCaller();
        this._blockContext = new BlockContext();
    };

    get blockContext(): BlockContext {
        return this._blockContext;
    }

    get currInnerTx(): EthStackTransaction |null {
        return this._innerTx;
    }

    get tx(): EthTransaction {
        return this._tx;
    }


    get innerTxContext(): EvmInnerTxContext | null {
        return this._innerTxContext;
    }

    get jitCall(): JustInTimeCaller {
        return this._jitCall;
    }

    get context(): AspectContext {
        return this._context;
    }

}
