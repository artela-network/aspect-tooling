import {BlockContext, EnvContext, TraceContext, TxContext} from '../../components/context';
import {AspectStateModifiableCtx, EvmCallableCtx, InherentCallableCtx,} from '../../common';
import {AspectContext} from "../../components/aspect";
import {StateDbApi} from "../../hostapi";


export class PreTxExecuteCtx
  implements EvmCallableCtx, InherentCallableCtx, AspectStateModifiableCtx
{
  private readonly _aspectContext: AspectContext;
  private readonly _stateContext: StateDbApi;
  private readonly _blockContext: BlockContext;
  private readonly _txContext: TxContext;
  private readonly _env: EnvContext;

  constructor() {
    this._aspectContext = AspectContext.instance();
    this._stateContext = StateDbApi.instance();
    this._blockContext = BlockContext.instance();
    this._txContext = TxContext.instance();
    this._env = EnvContext.instance();
  }

  get tx(): TxContext {
    return this._txContext;
  }

  get stateDB(): StateDbApi {
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
  private readonly _stateContext: StateDbApi;
  private readonly _traceContext: TraceContext;
  private readonly _blockContext: BlockContext;
  private readonly _txContext: TxContext;
  private readonly _env: EnvContext;

  constructor() {
    this._aspectContext = AspectContext.instance();
    this._stateContext = StateDbApi.instance();
    this._traceContext = TraceContext.instance();
    this._blockContext = BlockContext.instance();
    this._txContext = TxContext.instance();
    this._env = EnvContext.instance();
  }

  get tx(): TxContext {
    return this._txContext;
  }

  get stateDB(): StateDbApi {
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
