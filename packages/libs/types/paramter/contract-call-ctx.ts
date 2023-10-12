import { EthStackTransaction } from '../../proto';
import {
  AspectContext,
  AspectProperty,
  BlockContext,
  EnvContext,
  JustInTimeCaller,
  MutableAspectState,
  StateContext,
  TraceContext,
  Tx,
} from '../../components';
import {
  AspectStateModifiable,
  BlockContextAccessible,
  EnvContextAccessible,
  JustInTimeCallable,
  StateDBAccessible,
  TraceAccessible,
  TxContextAccessible,
} from '../../common';

export class PreContractCallCtx
  implements
    JustInTimeCallable,
    AspectStateModifiable,
    BlockContextAccessible,
    StateDBAccessible,
    TraceAccessible,
    TxContextAccessible,
    EnvContextAccessible
{
  private readonly _innerTx: EthStackTransaction;

  constructor(innerTx: EthStackTransaction) {
    this._innerTx = innerTx;
  }
  get property(): AspectProperty {
    return AspectProperty.instance();
  }
  get mutableState(): MutableAspectState {
    return MutableAspectState.instance(this);
  }
  get stateDB(): StateContext {
    return StateContext.instance(this);
  }
  get jitCall(): JustInTimeCaller {
    return JustInTimeCaller.instance(this);
  }
  get tx(): Tx {
    return Tx.instance(this);
  }
  get block(): BlockContext {
    return BlockContext.instance(this);
  }
  get currentCall(): EthStackTransaction {
    return this._innerTx;
  }
  get trace(): TraceContext {
    return TraceContext.instance(this);
  }
  get aspect(): AspectContext {
    return AspectContext.instance();
  }
  get env(): EnvContext {
    return EnvContext.instance(this);
  }

  __modifiableAspectStateImplemented(): void {}

  __readonlyAspectStateImplemented(): void {}

  __blockContextImplemented(): void {}

  __envContextImplemented(): void {}

  __justInTimeCallableImplemented(): void {}

  __stateQueryableImplemented(): void {}

  __traceContextImplemented(): void {}

  __txContextImplemented(): void {}
}

export class PostContractCallCtx
  implements
    JustInTimeCallable,
    AspectStateModifiable,
    BlockContextAccessible,
    StateDBAccessible,
    TraceAccessible,
    TxContextAccessible,
    EnvContextAccessible
{
  private readonly _innerTx: EthStackTransaction;
  constructor(innerTx: EthStackTransaction) {
    this._innerTx = innerTx;
  }
  get property(): AspectProperty {
    return AspectProperty.instance();
  }
  get mutableState(): MutableAspectState {
    return MutableAspectState.instance(this);
  }
  get stateDB(): StateContext {
    return StateContext.instance(this);
  }
  get jitCall(): JustInTimeCaller {
    return JustInTimeCaller.instance(this);
  }
  get tx(): Tx {
    return Tx.instance(this);
  }
  get block(): BlockContext {
    return BlockContext.instance(this);
  }
  get currentCall(): EthStackTransaction {
    return this._innerTx;
  }
  get trace(): TraceContext {
    return TraceContext.instance(this);
  }
  get aspect(): AspectContext {
    return AspectContext.instance();
  }
  get env(): EnvContext {
    return EnvContext.instance(this);
  }
  __modifiableAspectStateImplemented(): void {}

  __readonlyAspectStateImplemented(): void {}

  __blockContextImplemented(): void {}

  __envContextImplemented(): void {}

  __justInTimeCallableImplemented(): void {}

  __stateQueryableImplemented(): void {}

  __traceContextImplemented(): void {}

  __txContextImplemented(): void {}
}
