import { BlockContext, EnvContext } from '../../context';
import { AspectStateModifiableCtx, EvmCallableCtx } from '../../system';

export class OnBlockInitializeCtx implements EvmCallableCtx, AspectStateModifiableCtx {
  private readonly _blockContext: BlockContext;
  private readonly _env: EnvContext;

  constructor() {
    this._blockContext = BlockContext.get();
    this._env = EnvContext.get();
  }

  get block(): BlockContext {
    return this._blockContext;
  }

  get env(): EnvContext {
    return this._env;
  }

  __evmCallableImplemented(): void {}

  __modifiableAspectStateImplemented(): void {}

  __readonlyAspectStateImplemented(): void {}
}

export class OnBlockFinalizeCtx implements EvmCallableCtx, AspectStateModifiableCtx {
  private readonly _blockContext: BlockContext;
  private readonly _env: EnvContext;

  constructor() {
    this._blockContext = BlockContext.get();
    this._env = EnvContext.get();
  }

  get block(): BlockContext {
    return this._blockContext;
  }

  get env(): EnvContext {
    return this._env;
  }

  __evmCallableImplemented(): void {}

  __modifiableAspectStateImplemented(): void {}

  __readonlyAspectStateImplemented(): void {}
}
