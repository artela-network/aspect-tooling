import {EthTransaction} from "../../proto";
import {AspectContext, StaticCaller} from "../../system";


export class FilterTxCtx {

    private _tx: EthTransaction | null;

    private _context: AspectContext;
    private _staticCaller: StaticCaller;

    constructor(tx: EthTransaction | null) {
        this._tx = tx;
        this._context = new AspectContext();
        this._staticCaller = new StaticCaller();
    };


    get staticCaller(): StaticCaller {
        return this._staticCaller;
    }

    get tx(): EthTransaction {
        return this._tx;
    }

    get context(): AspectContext {
        return this._context;
    }
}
