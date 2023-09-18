import {EthTransaction} from "../../proto";
import {AspectContext, StaticCaller} from "../../system";


export class VerifyTxCtx {
    private _tx: EthTransaction | null;
    private _context: AspectContext | null;
    private _staticCaller: StaticCaller;


    constructor(tx: EthTransaction | null) {
        this._tx = tx;
        this._context = new AspectContext();
        this._staticCaller = new StaticCaller();
    };


    get staticCaller(): StaticCaller {
        return this._staticCaller;
    }


    get tx(): EthTransaction | null {
        return this._tx;
    }

    get context(): AspectContext | null {
        return this._context;
    }
}

export class VerifyAccountCtx {
    private _tx: EthTransaction | null;
    private _context: AspectContext | null;
    private _staticCaller: StaticCaller;


    constructor(tx: EthTransaction | null) {
        this._tx = tx;
        this._context = new AspectContext();
        this._staticCaller = new StaticCaller();
    };


    get staticCaller(): StaticCaller {
        return this._staticCaller;
    }


    get tx(): EthTransaction | null {
        return this._tx;
    }


    get context(): AspectContext | null {
        return this._context;
    }
}
