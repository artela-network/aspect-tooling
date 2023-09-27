import { EthStackTransaction } from '../../proto';
import { BlockContext, EnvContext, TraceContext, TxContext } from '../../context';
import {
  AspectContext,
  AspectStateModifiableCtx,
  InherentCallableCtx,
  StateContext,
} from '../../system';

export class PreContractCallCtx implements AspectStateModifiableCtx, InherentCallableCtx {
  private readonly _innerTx: EthStackTransaction;
  private readonly _aspectContext: AspectContext;
  private readonly _blockContext: BlockContext;
  private readonly _stateContext: StateContext;
  private readonly _traceContext: TraceContext;
  private readonly _txContext: TxContext;
  private readonly _env: EnvContext;

  constructor(innerTx: EthStackTransaction) {
    this._innerTx = innerTx;
    this._aspectContext = AspectContext.get();
    this._blockContext = BlockContext.get();
    this._stateContext = StateContext.get();
    this._traceContext = TraceContext.get();
    this._txContext = TxContext.get();
    this._env = EnvContext.get();
  }

  get tx(): TxContext {
    return this._txContext;
  }

  get block(): BlockContext {
    return this._blockContext;
  }

  get currInnerTx(): EthStackTransaction {
    return this._innerTx;
  }

  get stateDB(): StateContext {
    return this._stateContext;
  }

  get trace(): TraceContext {
    return this._traceContext;
  }

  get aspect(): AspectContext {
    return this._aspectContext;
  }

  get env(): EnvContext {
    return this._env;
  }

  __inherentCallableImplemented(): void {}

  __modifiableAspectStateImplemented(): void {}

  __readonlyAspectStateImplemented(): void {}
}

export class PostContractCallCtx implements AspectStateModifiableCtx, InherentCallableCtx {
  private readonly _aspectContext: AspectContext = AspectContext.get();
  private readonly _blockContext: BlockContext = BlockContext.get();
  private readonly _stateContext: StateContext = StateContext.get();
  private readonly _traceContext: TraceContext = TraceContext.get();
  private readonly _txContext: TxContext = TxContext.get();
  private readonly _env: EnvContext = EnvContext.get();

  constructor(private readonly _currInnerTx: EthStackTransaction) {}

  get tx(): TxContext {
    return this._txContext;
  }

  get block(): BlockContext {
    return this._blockContext;
  }

  get currInnerTx(): EthStackTransaction {
    return this._currInnerTx;
  }

  get aspect(): AspectContext {
    return this._aspectContext;
  }

  get stateDB(): StateContext {
    return this._stateContext;
  }

  get trace(): TraceContext {
    return this._traceContext;
  }

  get env(): EnvContext {
    return this._env;
  }

  __inherentCallableImplemented(): void {}

  __modifiableAspectStateImplemented(): void {}

  __readonlyAspectStateImplemented(): void {}
}
