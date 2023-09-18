import {BlockContext, EthReceiptContext,} from "../../context";
import {EthTransaction} from "../../proto";
import {AspectContext, StaticCaller} from "../../system";
import {ScheduleManager} from "../../components/scheduler/schedule-service";

export class PostTxCommitCtx {

    private _tx: EthTransaction | null;
    private _receipt: EthReceiptContext | null;
    private _aspectContext: AspectContext | null;
    private _staticCaller: StaticCaller | null;
    private _scheduleManager: ScheduleManager;
    private _blockContext: BlockContext;


    constructor(tx: EthTransaction | null) {
        this._tx = tx;
        this._aspectContext = new AspectContext();
        this._receipt = new EthReceiptContext();
        this._staticCaller = new StaticCaller();
        this._scheduleManager = new ScheduleManager();
        this._blockContext=new BlockContext();
    };


    get blockContext(): BlockContext {
        return this._blockContext;
    }

    get scheduleManager(): ScheduleManager {
        return this._scheduleManager;
    }

    get tx(): EthTransaction | null {
        return this._tx;
    }

    get receipt(): EthReceiptContext | null {
        return this._receipt;
    }

    get aspectContext(): AspectContext | null {
        return this._aspectContext;
    }

    get staticCaller(): StaticCaller | null {
        return this._staticCaller;
    }


    get schedule(): ScheduleManager | null {
        return this._scheduleManager;
    }
}
