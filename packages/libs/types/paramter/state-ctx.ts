import {EthTransaction} from '../../proto';
import {StaticCaller} from '../../system';
import {ScheduleManager} from "../../components";

export class OperationCtx {
    private _input: Uint8Array | null;
    private _staticCaller: StaticCaller;
    private _schedule: ScheduleManager;

    constructor(tx: EthTransaction | null) {
        if (tx != null) {
            this._input = tx.input;
        }
        this._staticCaller = new StaticCaller();
        this._schedule = new ScheduleManager();
    }

    get staticCaller(): StaticCaller {
        return this._staticCaller;
    }

    get input(): Uint8Array | null {
        return this._input;
    }

    get schedule(): ScheduleManager {
        return this._schedule;
    }
}
