import { AspectContext, AspectStateModifiableCtx, EvmCallableCtx } from '../../system';
import { BlockContext, EnvContext, TxContext } from '../../context';

export class OperationCtx implements AspectStateModifiableCtx, EvmCallableCtx {
  private readonly _aspect: AspectContext;
  private readonly _tx: TxContext;
  private readonly _env: EnvContext;
  private readonly _block: BlockContext;

  constructor() {
    this._aspect = AspectContext.get();
    this._tx = TxContext.get();
    this._env = EnvContext.get();
    this._block = BlockContext.get();
  }

  get tx(): TxContext {
    return this._tx;
  }

  get aspect(): AspectContext {
    return this._aspect;
  }

  get env(): EnvContext {
    return this._env;
  }

  get block(): BlockContext {
    return this._block;
  }
}
