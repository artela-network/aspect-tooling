import {EthTransaction} from '../../proto';
import {AspectContext, StaticCaller} from '../../system';
import {TxContext} from "../../context";

export class FilterTxCtx {
    private _tx: EthTransaction | null;

    private _aspectContext: AspectContext;
    private _staticCaller: StaticCaller;
    private _txContext: TxContext;

    constructor(tx: EthTransaction | null) {
        this._tx = tx;
        this._aspectContext = new AspectContext();
        this._staticCaller = new StaticCaller();
        this._txContext = new TxContext();
    }

    get staticCaller(): StaticCaller {
        return this._staticCaller;
    }

    get txContext(): TxContext {
        return this._txContext;
    }

    get tx(): EthTransaction {
        return this._tx!;
    }

    get aspectContext(): AspectContext {
        return this._aspectContext;
    }
}
