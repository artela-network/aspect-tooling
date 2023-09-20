import {EthTransaction} from '../../proto';
import {StaticCaller} from '../../system';

export class OperationCtx {
    private _input: Uint8Array;
    private _staticCaller: StaticCaller;

    constructor(tx: EthTransaction | null) {
        this._input = tx!.input;
        this._staticCaller = new StaticCaller();
    }

    get staticCaller(): StaticCaller {
        return this._staticCaller;
    }

    get input(): Uint8Array {
        return this._input;
    }

}
