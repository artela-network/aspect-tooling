import {EthTransaction} from "../../proto";
import {BlockContext, EvmTxContext} from "../../context";
import {AspectContext, StaticCaller} from "../../system";

export class PreTxExecuteCtx {
    private _tx: EthTransaction | null;
    private _aspectContext: AspectContext | null;
    private _staticCaller: StaticCaller | null;
    private _evmTxContext: EvmTxContext | null;
    private _blockContext: BlockContext;

    constructor(tx: EthTransaction | null) {
        this._tx = tx;
        this._aspectContext = new AspectContext();
        this._staticCaller = new StaticCaller();
        this._evmTxContext = new EvmTxContext(tx);
        this._blockContext = new BlockContext();
    };


    get staticCaller(): StaticCaller | null {
        return this._staticCaller;
    }

    get evmTxContext(): EvmTxContext | null {
        return this._evmTxContext;
    }

    get blockContext(): BlockContext {
        return this._blockContext;
    }

    get tx(): EthTransaction | null {
        return this._tx;
    }


    get aspectContext(): AspectContext | null {
        return this._aspectContext;
    }
}

export class PostTxExecuteCtx {
    private _tx: EthTransaction | null;
    private _aspectContext: AspectContext | null;
    private _staticCaller: StaticCaller | null;
    private _evmTxContext: EvmTxContext | null;
    private _blockContext: BlockContext;

    constructor(tx: EthTransaction | null) {
        this._tx = tx;
        this._aspectContext = new AspectContext();
        this._staticCaller = new StaticCaller();
        this._evmTxContext = new EvmTxContext(tx);
        this._blockContext = new BlockContext();
    };


    get staticCaller(): StaticCaller | null {
        return this._staticCaller;
    }

    get evmTxContext(): EvmTxContext | null {
        return this._evmTxContext;
    }

    get blockContext(): BlockContext {
        return this._blockContext;
    }

    get tx(): EthTransaction | null {
        return this._tx;
    }


    get aspectContext(): AspectContext | null {
        return this._aspectContext;
    }
}
