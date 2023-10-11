import { AspectStateReadonly, StaticCallAble } from '../../common';
import { AspectProperty, ImmutableAspectState, StaticCaller } from '../../components';
import { EthTransaction } from '../../proto';

export class FilterTxCtx implements AspectStateReadonly, StaticCallAble {
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

  get readonlyState(): ImmutableAspectState {
    return ImmutableAspectState.instance(this);
  }

  get staticCall(): StaticCaller {
    return StaticCaller.instance(this);
  }

  __readonlyAspectStateImplemented(): void {}

  __staticCallableImplemented(): void {}
}
