import {EthBlockHeader} from '../../proto';
import {StaticCaller} from '../../system';
import {ScheduleManager} from '../../components';
import {BlockContext} from '../../context';

export class OnBlockInitializeCtx {
    private _blockHeader: EthBlockHeader | null;
    private _staticCaller: StaticCaller;
    private _blockContext: BlockContext;
    private _schedule: ScheduleManager;

    constructor(blockHeader: EthBlockHeader | null) {
        this._blockHeader = blockHeader;
        this._staticCaller = new StaticCaller();
        this._blockContext = new BlockContext();
        this._schedule = new ScheduleManager();
    }

    get blockContext(): BlockContext {
        return this._blockContext;
    }
    get schedule(): ScheduleManager {
        return this._schedule;
    }

    get blockHeader(): EthBlockHeader | null {
        return this._blockHeader;
    }

    get staticCaller(): StaticCaller {
        return this._staticCaller;
    }


}

export class OnBlockFinalizeCtx {
    private _blockHeader: EthBlockHeader | null;
    private _schedule: ScheduleManager;
    private _staticCaller: StaticCaller;
    private _blockContext: BlockContext;

    constructor(blockHeader: EthBlockHeader | null) {
        this._blockHeader = blockHeader;
        this._schedule = new ScheduleManager();
        this._staticCaller = new StaticCaller();
        this._blockContext = new BlockContext();
    }

    get blockHeader(): EthBlockHeader | null {
        return this._blockHeader;
    }

    get blockContext(): BlockContext {
        return this._blockContext;
    }


    get schedule(): ScheduleManager {
        return this._schedule;
    }

    get staticCaller(): StaticCaller {
        return this._staticCaller;
    }
}
