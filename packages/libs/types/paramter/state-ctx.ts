import {EthTransaction} from "../../proto";
import {AspectContext, StaticCaller} from "../../system";


export class OperationCtx {
    private _input: Uint8Array
    private _context: AspectContext | null;
    private _staticCaller: StaticCaller;


    constructor(tx: EthTransaction | null) {
        this._input = tx!.input;
        this._context = new AspectContext();
        this._staticCaller=new StaticCaller();
    };


    get staticCaller(): StaticCaller {
        return this._staticCaller;
    }


    get input(): Uint8Array {
        return this._input;
    }

    get context(): AspectContext | null {
        return this._context;
    }
}