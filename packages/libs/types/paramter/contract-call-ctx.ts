import {EthStackTransaction} from '../../proto';
import {BlockContext, EnvContext, TraceContext, TxContext} from '../../components/context';
import {AspectStateModifiable, InherentCallableCtx,} from '../../common';
import {AspectContext} from "../../components/aspect";
import {StateDbApi} from "../../hostapi";

export class PreContractCallCtx implements AspectStateModifiable, InherentCallableCtx {
  private readonly _innerTx: EthStackTransaction;
  private readonly _aspectContext: AspectContext;
  private readonly _blockContext: BlockContext;
  private readonly _stateContext: StateDbApi;
  private readonly _traceContext: TraceContext;
  private readonly _txContext: TxContext;
  private readonly _env: EnvContext;

  constructor(innerTx: EthStackTransaction) {
    this._innerTx = innerTx;
    this._aspectContext = AspectContext.instance();
    this._blockContext = BlockContext.instance();
    this._stateContext = StateDbApi.instance();
    this._traceContext = TraceContext.instance();
    this._txContext = TxContext.instance();
    this._env = EnvContext.instance();
  }

  get tx(): TxContext {
    return this._txContext;
  }

  get block(): BlockContext {
    return this._blockContext;
  }

  get currentCall(): EthStackTransaction {
    return this._innerTx;
  }

  get stateDB(): StateDbApi {
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

export class PostContractCallCtx implements AspectStateModifiable, InherentCallableCtx {
  private readonly _aspectContext: AspectContext = AspectContext.instance();
  private readonly _blockContext: BlockContext = BlockContext.instance();
  private readonly _stateContext: StateDbApi = StateDbApi.instance();
  private readonly _traceContext: TraceContext = TraceContext.instance();
  private readonly _txContext: TxContext = TxContext.instance();
  private readonly _env: EnvContext = EnvContext.instance();

  constructor(private readonly _currInnerTx: EthStackTransaction) {}

  get tx(): TxContext {
    return this._txContext;
  }

  get block(): BlockContext {
    return this._blockContext;
  }

  get currentCall(): EthStackTransaction {
    return this._currInnerTx;
  }

  get aspect(): AspectContext {
    return this._aspectContext;
  }

  get stateDB(): StateDbApi {
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
