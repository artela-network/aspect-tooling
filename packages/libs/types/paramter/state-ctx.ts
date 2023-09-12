import {EthTransaction} from "../../proto";
import {AspectContext, StaticCaller} from "../../system";


export class OperationCtx {
    private input: uint8Array
    private _context: AspectContext | null;
    private _staticCaller: StaticCaller;


    constructor(tx: EthTransaction | null) {
        this.input = tx?.input;
        this._context = new AspectContext();
        this._staticCaller=new StaticCaller();
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