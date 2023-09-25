import {BlockContext, EnvContext, TraceContext, TxContext} from '../../context';
import {AspectContext, JustInTimeCaller, StateContext, StaticCaller} from '../../system';

export class PreTxExecuteCtx {
  private readonly _aspectContext: AspectContext;
  private readonly _staticCaller: StaticCaller;
  private readonly _stateContext: StateContext;
  private readonly _blockContext: BlockContext;
  private readonly _txContext: TxContext;
  private readonly _env: EnvContext;
  private readonly _jitCall: JustInTimeCaller;

  constructor() {
    this._aspectContext = AspectContext.get();
    this._staticCaller = StaticCaller.get();
    this._stateContext = StateContext.get();
    this._blockContext = BlockContext.get();
    this._txContext = TxContext.get();
    this._env = EnvContext.get();
    this._jitCall = JustInTimeCaller.get();
  }

  get tx(): TxContext {
    return this._txContext;
  }

  get evm(): StaticCaller {
    return this._staticCaller;
  }

  get stateDB(): StateContext {
    return this._stateContext;
  }

  get block(): BlockContext {
    return this._blockContext;
  }

  get aspect(): AspectContext {
    return this._aspectContext;
  }

  get env(): EnvContext {
    return this._env;
  }

  get inherent(): JustInTimeCaller {
    return this._jitCall;
  }
}

export class PostTxExecuteCtx {
  private readonly _aspectContext: AspectContext;
  private readonly _staticCaller: StaticCaller;
  private readonly _stateContext: StateContext;
  private readonly _traceContext: TraceContext;
  private readonly _blockContext: BlockContext;
  private readonly _txContext: TxContext;
  private readonly _env: EnvContext;
  private readonly _jitCall: JustInTimeCaller;

  constructor() {
    this._aspectContext = AspectContext.get();
    this._staticCaller = StaticCaller.get();
    this._stateContext = StateContext.get();
    this._traceContext = TraceContext.get();
    this._blockContext = BlockContext.get();
    this._txContext = TxContext.get();
    this._env = EnvContext.get();
    this._jitCall = JustInTimeCaller.get();
  }

  get tx(): TxContext {
    return this._txContext;
  }

  get evm(): StaticCaller {
    return this._staticCaller;
  }

  get stateDB(): StateContext {
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

  get env(): EnvContext {
    return this._env;
  }

  get inherent(): JustInTimeCaller {
    return this._jitCall;
  }
}
