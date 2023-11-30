import {
  AspectStateReadonly,
  BlockContextAccessible,
  StaticCallable,
  TxContextAccessible,
} from '../../common';
import {
  AspectProperty,
  BlockContext,
  ImmutableAspectState,
  StaticCaller,
  TxContext,
} from '../../components';

export class VerifyTxCtx
  implements TxContextAccessible, AspectStateReadonly, StaticCallable, BlockContextAccessible
{
  get tx(): TxContext {
    return TxContext.instance(this);
  }

  get property(): AspectProperty {
    return AspectProperty.instance();
  }

  get block(): BlockContext {
    return BlockContext.instance(this);
  }

  get state(): ImmutableAspectState {
    return ImmutableAspectState.instance(this);
  }

  get staticCall(): StaticCaller {
    return StaticCaller.instance(this);
  }

  __readonlyAspectStateImplemented(): void {}

  __staticCallableImplemented(): void {}

  __blockContextImplemented(): void {}

  __txContextImplemented(): void {}
}
