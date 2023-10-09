import {AspectStateModifiable, EvmCallableCtx, StaticCallAble} from '../../common';
import { AspectProperty,  ImmutableAspectState, StaticCaller} from "../../components";
import {EthTransaction} from "../../proto";

export class FilterTxCtx implements AspectStateModifiable, EvmCallableCtx,StaticCallAble {
  private readonly _tx: EthTransaction;
  private readonly _aspectProperty: AspectProperty;
  private readonly _immutableAspectState: ImmutableAspectState
  private readonly _staticCall: StaticCaller;

  constructor(tx: EthTransaction) {
    this._aspectProperty = AspectProperty.instance();
    this._tx = tx;
    this._immutableAspectState = ImmutableAspectState.instance(this);
    this._staticCall = StaticCaller.instance(this);
  }
  get tx(): EthTransaction {
    return this._tx;
  }

  get property(): AspectProperty {
    return this._aspectProperty;
  }

  get readonlyState(): ImmutableAspectState {
    return this._immutableAspectState;
  }

  get staticCall(): StaticCaller {
    return this._staticCall;
  }

  __readonlyAspectStateImplemented(): void {}

  __evmCallableImplemented(): void {}

  __modifiableAspectStateImplemented(): void {}

  __staticCallableImplemented(): void {
  }
}
