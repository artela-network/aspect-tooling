import { BlockContext, EnvContext, TraceContext, TxContext } from '../../context';
import {
  AspectContext,
  AspectStateModifiableCtx,
  EvmCallableCtx,
  InherentCallableCtx,
  StateContext,
} from '../../system';

export class PreTxExecuteCtx
  implements EvmCallableCtx, InherentCallableCtx, AspectStateModifiableCtx
{
  private readonly _aspectContext: AspectContext;
  private readonly _stateContext: StateContext;
  private readonly _blockContext: BlockContext;
  private readonly _txContext: TxContext;
  private readonly _env: EnvContext;

  constructor() {
    this._aspectContext = AspectContext.get();
    this._stateContext = StateContext.get();
    this._blockContext = BlockContext.get();
    this._txContext = TxContext.get();
    this._env = EnvContext.get();
  }

  get tx(): TxContext {
    return this._txContext;
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

  __evmCallableImplemented(): void {}

  __inherentCallableImplemented(): void {}

  __modifiableAspectStateImplemented(): void {}

  __readonlyAspectStateImplemented(): void {}
}

export class PostTxExecuteCtx
  implements EvmCallableCtx, InherentCallableCtx, AspectStateModifiableCtx
{
  private readonly _aspectContext: AspectContext;
  private readonly _stateContext: StateContext;
  private readonly _traceContext: TraceContext;
  private readonly _blockContext: BlockContext;
  private readonly _txContext: TxContext;
  private readonly _env: EnvContext;

  constructor() {
    this._aspectContext = AspectContext.get();
    this._stateContext = StateContext.get();
    this._traceContext = TraceContext.get();
    this._blockContext = BlockContext.get();
    this._txContext = TxContext.get();
    this._env = EnvContext.get();
  }

  get tx(): TxContext {
    return this._txContext;
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

  __evmCallableImplemented(): void {}

  __inherentCallableImplemented(): void {}

  __modifiableAspectStateImplemented(): void {}

  __readonlyAspectStateImplemented(): void {}
}
