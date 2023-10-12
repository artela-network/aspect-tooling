import {
  AspectStateModifiable,
  BlockContextAccessible,
  EnvContextAccessible,
  StateDBAccessible,
  StaticCallable,
  TraceAccessible,
  TxContextAccessible,
} from '../../common';
import {
  AspectContext,
  AspectProperty,
  BlockContext,
  EnvContext,
  MutableAspectState,
  StateContext,
  StaticCaller,
  TraceContext,
  Tx,
} from '../../components';

export class PreTxExecuteCtx
  implements
    AspectStateModifiable,
    StaticCallable,
    StateDBAccessible,
    BlockContextAccessible,
    TxContextAccessible,
    EnvContextAccessible
{
  constructor() {}

  get tx(): Tx {
    return Tx.instance(this);
  }

  get stateDB(): StateContext {
    return StateContext.instance(this);
  }

  get block(): BlockContext {
    return BlockContext.instance(this);
  }

  get aspect(): AspectContext {
    return AspectContext.instance();
  }

  get env(): EnvContext {
    return EnvContext.instance(this);
  }

  get property(): AspectProperty {
    return AspectProperty.instance();
  }

  get mutableState(): MutableAspectState {
    return MutableAspectState.instance(this);
  }

  get staticCall(): StaticCaller {
    return StaticCaller.instance(this);
  }

  __blockContextImplemented(): void {}
  __stateQueryableImplemented(): void {}

  __staticCallableImplemented(): void {}

  __modifiableAspectStateImplemented(): void {}

  __readonlyAspectStateImplemented(): void {}

  __envContextImplemented(): void {}

  __txContextImplemented(): void {}
}

export class PostTxExecuteCtx
  implements
    TraceAccessible,
    AspectStateModifiable,
    StaticCallable,
    StateDBAccessible,
    BlockContextAccessible,
    TxContextAccessible,
    EnvContextAccessible
{
  constructor() {}

  get trace(): TraceContext {
    return TraceContext.instance(this);
  }
  get tx(): Tx {
    return Tx.instance(this);
  }

  get stateDB(): StateContext {
    return StateContext.instance(this);
  }

  get block(): BlockContext {
    return BlockContext.instance(this);
  }

  get aspect(): AspectContext {
    return AspectContext.instance();
  }

  get env(): EnvContext {
    return EnvContext.instance(this);
  }

  get property(): AspectProperty {
    return AspectProperty.instance();
  }

  get mutableState(): MutableAspectState {
    return MutableAspectState.instance(this);
  }

  get staticCall(): StaticCaller {
    return StaticCaller.instance(this);
  }

  __blockContextImplemented(): void {}
  __stateQueryableImplemented(): void {}

  __staticCallableImplemented(): void {}

  __modifiableAspectStateImplemented(): void {}

  __readonlyAspectStateImplemented(): void {}

  __envContextImplemented(): void {}

  __txContextImplemented(): void {}

  __traceContextImplemented(): void {}
}
