import { EthInnerTransaction, EthStackTransaction } from '../../proto';
import { BlockContext, EnvContext, TraceContext, TxContext } from '../../context';
import { AspectContext, JustInTimeCaller, StateContext } from '../../system';

export class PreContractCallCtx {
  private readonly _innerTx: EthInnerTransaction;
  private readonly _aspectContext: AspectContext;
  private readonly _jitCall: JustInTimeCaller;
  private readonly _blockContext: BlockContext;
  private readonly _stateContext: StateContext;
  private readonly _traceContext: TraceContext;
  private readonly _txContext: TxContext;
  private readonly _env: EnvContext;

  constructor(innerTx: EthInnerTransaction) {
    this._innerTx = innerTx;
    this._aspectContext = AspectContext.get();
    this._jitCall = JustInTimeCaller.get();
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

  get currInnerTx(): EthInnerTransaction | null {
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

  get jitCall(): JustInTimeCaller {
    return this._jitCall;
  }

  get env(): EnvContext {
    return this._env;
  }
}

export class PostContractCallCtx {
  private readonly _aspectContext: AspectContext = AspectContext.get();
  private readonly _jitCall: JustInTimeCaller = JustInTimeCaller.get();
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

  get inherent(): JustInTimeCaller {
    return this._jitCall;
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
}
