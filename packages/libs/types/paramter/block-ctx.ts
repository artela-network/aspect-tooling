import {EthBlockHeader} from "../../proto";
import {StaticCaller, JustInTimeCaller} from "../../system";
import {ScheduleManager} from "../../components/scheduler/schedule-service";
import {BlockContext} from "../../context";


export class OnBlockInitializeCtx {

    private _blockHeader: EthBlockHeader | null;
    private _staticCaller: StaticCaller;
    private _jitTxSender: JustInTimeCaller;
    private _blockContext: BlockContext;
    private _scheduleManager: ScheduleManager;


    constructor(blockHeader: EthBlockHeader | null) {
        this._blockHeader = blockHeader;
        this._staticCaller = new StaticCaller();
        this._jitTxSender = new JustInTimeCaller();
        this._blockContext = new BlockContext();
        this._scheduleManager = new ScheduleManager();
    };


    get scheduleManager(): ScheduleManager {
        return this._scheduleManager;
    }

    get blockContext(): BlockContext | null {
        return this._blockContext;
    }

    get blockHeader(): EthBlockHeader | null {
        return this._blockHeader;
    }


    get staticCaller(): StaticCaller | null {
        return this._staticCaller;
    }


    get jitTxSender(): JustInTimeCaller {
        return this._jitTxSender;
    }
}

export class OnBlockFinalizeCtx {
    private _blockHeader: EthBlockHeader | null;
    private _schedule: ScheduleManager | null;
    private _staticCaller: StaticCaller | null;
    private _blockContext: BlockContext | null;

    constructor(blockHeader: EthBlockHeader | null) {
        this._blockHeader = blockHeader;
        this._schedule = new ScheduleManager();
        this._staticCaller = new StaticCaller();
        this._blockContext = new BlockContext();
    };


    get blockContext(): BlockContext | null {
        return this._blockContext;
    }

    get blockHeader(): EthBlockHeader | null {
        return this._blockHeader;
    }

    get scheduleManager(): ScheduleManager | null {
        return this._schedule;
    }

    get staticCaller(): StaticCaller | null {
        return this._staticCaller;
    }

}
