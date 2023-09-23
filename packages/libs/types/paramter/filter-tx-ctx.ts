import { AspectContext, StaticCaller } from '../../system';
import { TxContext } from '../../context';

export class FilterTxCtx {
  private readonly _aspectContext: AspectContext;
  private readonly _staticCaller: StaticCaller;
  private readonly _txContext: TxContext;

  constructor() {
    this._aspectContext = AspectContext.get();
    this._staticCaller = StaticCaller.get();
    this._txContext = TxContext.get();
  }

  get evm(): StaticCaller {
    return this._staticCaller;
  }

  get tx(): TxContext {
    return this._txContext;
  }

  get aspect(): AspectContext {
    return this._aspectContext;
  }
}
