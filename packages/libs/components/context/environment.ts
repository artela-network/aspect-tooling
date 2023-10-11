import { ContextKey, EnvContextAble, NotAuthorizedFail } from '../../common';
import { ChainConfigKey, ConsParamsKey, EnvContentKey, EvmParamsKey } from '../../common/key-env';

export class EnvContext {
  private static _instance: EnvContext | null;

  private constructor() {}

  get baseFee(): EnvContentKey {
    return ContextKey.env.baseFee;
  }

  get consensusParams(): ConsParamsKey {
    return ContextKey.env.consensusParams;
  }

  get evmParams(): EvmParamsKey {
    return ContextKey.env.evmParams;
  }

  get chainConfig(): ChainConfigKey {
    return ContextKey.env.chainConfig;
  }

  public static instance(ctx: EnvContextAble): EnvContext {
    if (ctx == null) {
      throw NotAuthorizedFail;
    }
    if (this._instance == null) {
      this._instance = new EnvContext();
    }
    return this._instance!;
  }
}
