import { AspectContext, AspectStateReadonlyCtx, EvmCallableCtx } from '../../system';
import { EnvContext, TxContext } from '../../context';

export class FilterTxCtx implements AspectStateReadonlyCtx, EvmCallableCtx {
  private readonly _aspectContext: AspectContext;
  private readonly _txContext: TxContext;
  private readonly _env: EnvContext;

  constructor() {
    this._aspectContext = AspectContext.get();
    this._txContext = TxContext.get();
    this._env = EnvContext.get();
  }

  get tx(): TxContext {
    return this._txContext;
  }

  get aspect(): AspectContext {
    return this._aspectContext;
  }

  get env(): EnvContext {
    return this._env;
  }
}
