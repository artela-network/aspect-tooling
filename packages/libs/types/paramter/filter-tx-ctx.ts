import {AspectStateModifiableCtx, EvmCallableCtx} from '../../common';
import {EnvContext, TxContext} from '../../components/context';
import {AspectContext} from "../../components/aspect";


export class FilterTxCtx implements AspectStateModifiableCtx, EvmCallableCtx {
  private readonly _aspectContext: AspectContext;
  private readonly _txContext: TxContext;
  private readonly _env: EnvContext;

  constructor() {
    this._aspectContext = AspectContext.instance();
    this._txContext = TxContext.instance();
    this._env = EnvContext.instance();
  }

  __readonlyAspectStateImplemented(): void {}

  get tx(): TxContext {
    return this._txContext;
  }

  get aspect(): AspectContext {
    return this._aspectContext;
  }

  get env(): EnvContext {
    return this._env;
  }
  __evmCallableImplemented(): void {}

  __modifiableAspectStateImplemented(): void {}
}
