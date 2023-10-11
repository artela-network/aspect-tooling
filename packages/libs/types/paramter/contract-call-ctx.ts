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
  BlockContextAble,
  EnvContextAble,
  JustInTimeCallAble,
  StateContextAble,
  TraceContextAble,
  TxContextAble,
} from '../../common';

export class PreContractCallCtx
  implements
    JustInTimeCallAble,
    AspectStateModifiable,
    BlockContextAble,
    StateContextAble,
    TraceContextAble,
    TxContextAble,
    EnvContextAble
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
    JustInTimeCallAble,
    AspectStateModifiable,
    BlockContextAble,
    StateContextAble,
    TraceContextAble,
    TxContextAble,
    EnvContextAble
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
