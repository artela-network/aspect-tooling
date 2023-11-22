import { AspectStateReadonly, BlockContextAccessible, StaticCallable } from '../../common';
import { AspectProperty, BlockContext, ImmutableAspectState, StaticCaller } from '../../components';
import { EthTransaction } from '../../proto';

export class VerifyTxCtx implements AspectStateReadonly, StaticCallable, BlockContextAccessible {
  private readonly _tx: EthTransaction;
  constructor(tx: EthTransaction) {
    this._tx = tx;
  }

  get tx(): EthTransaction {
    return this._tx;
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
}
