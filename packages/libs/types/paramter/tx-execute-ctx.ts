import { EthTransaction } from '../../proto';
import { BlockContext } from '../../context';
import { AspectContext, StaticCaller } from '../../system';
import { StateContext } from '../../system/statedb-api';
import { TraceContext } from '../../context/tx-context';

export class PreTxExecuteCtx {
  private _tx: EthTransaction | null;
  private _aspectContext: AspectContext | null;
  private _staticCaller: StaticCaller;
  private _stateContext: StateContext;
  private _blockContext: BlockContext;

  constructor(tx: EthTransaction | null) {
    this._tx = tx;
    this._aspectContext = new AspectContext();
    this._staticCaller = new StaticCaller();
    this._stateContext = new StateContext();
    this._blockContext = new BlockContext();
  }

  get staticCaller(): StaticCaller | null {
    return this._staticCaller;
  }

  get stateContext(): StateContext | null {
    return this._stateContext;
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
  private _stateContext: StateContext;
  private _traceContext: TraceContext;
  private _blockContext: BlockContext;

  constructor(tx: EthTransaction | null) {
    this._tx = tx;
    this._aspectContext = new AspectContext();
    this._staticCaller = new StaticCaller();
    this._stateContext = new StateContext();
    this._traceContext = new TraceContext();
    this._blockContext = new BlockContext();
  }

  get staticCaller(): StaticCaller | null {
    return this._staticCaller;
  }

  get stateContext(): StateContext {
    return this._stateContext;
  }

  get traceContext(): TraceContext {
    return this._traceContext;
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
