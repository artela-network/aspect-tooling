import {AspectStateModifiableCtx, EvmCallableCtx} from '../../common';
import {BlockContext, EnvContext, TxContext} from '../../components/context';
import {AspectContext} from "../../components/aspect";

export class OperationCtx implements AspectStateModifiableCtx, EvmCallableCtx {
  private readonly _aspect: AspectContext;
  private readonly _tx: TxContext;
  private readonly _env: EnvContext;
  private readonly _block: BlockContext;

  constructor() {
    this._aspect = AspectContext.instance();
    this._tx = TxContext.instance();
    this._env = EnvContext.instance();
    this._block = BlockContext.instance();
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

  __evmCallableImplemented(): void {}

  __modifiableAspectStateImplemented(): void {}

  __readonlyAspectStateImplemented(): void {}
}
