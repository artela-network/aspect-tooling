import { BlockContext, TraceContext, TxContext } from '../../context';
import { AspectContext, StateContext, StaticCaller } from '../../system';

export class PreTxExecuteCtx {
  private readonly _aspectContext: AspectContext;
  private readonly _staticCaller: StaticCaller;
  private readonly _stateContext: StateContext;
  private readonly _blockContext: BlockContext;
  private readonly _txContext: TxContext;

  constructor() {
    this._aspectContext = AspectContext.get();
    this._staticCaller = StaticCaller.get();
    this._stateContext = StateContext.get();
    this._blockContext = BlockContext.get();
    this._txContext = TxContext.get();
  }

  get tx(): TxContext {
    return this._txContext;
  }

  get evm(): StaticCaller {
    return this._staticCaller;
  }

  get state(): StateContext {
    return this._stateContext;
  }

  get block(): BlockContext {
    return this._blockContext;
  }

  get aspect(): AspectContext {
    return this._aspectContext;
  }
}

export class PostTxExecuteCtx {
  private readonly _aspectContext: AspectContext;
  private readonly _staticCaller: StaticCaller;
  private readonly _stateContext: StateContext;
  private readonly _traceContext: TraceContext;
  private readonly _blockContext: BlockContext;
  private readonly _txContext: TxContext;

  constructor() {
    this._aspectContext = AspectContext.get();
    this._staticCaller = StaticCaller.get();
    this._stateContext = StateContext.get();
    this._traceContext = TraceContext.get();
    this._blockContext = BlockContext.get();
    this._txContext = TxContext.get();
  }

  get tx(): TxContext {
    return this._txContext;
  }

  get evm(): StaticCaller {
    return this._staticCaller;
  }

  get state(): StateContext {
    return this._stateContext;
  }

  get trace(): TraceContext {
    return this._traceContext;
  }

  get block(): BlockContext {
    return this._blockContext;
  }

  get aspect(): AspectContext {
    return this._aspectContext;
  }
}
