import { ContextKey, ErrLoadRuntimeCtxValue, RuntimeContext } from '../system';
import { ChainConfig, ConsParams, EnvContent, EvmParams } from '../proto';
import { Protobuf } from 'as-proto/assembly';

export class EnvContext {
  private static _instance: EnvContext | null;

  private constructor() {}

  get baseFee(): EnvContent {
    const key = ContextKey.env.baseFee.toString();
    const response = RuntimeContext.get(key);
    if (!response.data || !response.data.value) {
      throw ErrLoadRuntimeCtxValue;
    }
    return Protobuf.decode<EnvContent>(response.data.value, EnvContent.decode);
  }

  get consensusParams(): ConsParams {
    //   ENV_CONS_PARAMS = 7;
    const key = ContextKey.env.consensusParams.toString();
    const response = RuntimeContext.get(key);
    if (!response.data || !response.data.value) {
      throw ErrLoadRuntimeCtxValue;
    }
    return Protobuf.decode<ConsParams>(response.data.value, ConsParams.decode);
  }

  get evmParams(): EvmParams {
    //   ENV_EVM_PARAMS = 9;
    const key = ContextKey.env.evmParams.toString();
    const response = RuntimeContext.get(key);
    if (!response.data || !response.data.value) {
      throw ErrLoadRuntimeCtxValue;
    }
    return Protobuf.decode<EvmParams>(response.data.value, EvmParams.decode);
  }

  get chainConfig(): ChainConfig {
    //   ENV_CHAIN_CONFIG = 8;
    const key = ContextKey.env.chainConfig.toString();
    const response = RuntimeContext.get(key);
    if (!response.data || !response.data.value) {
      throw ErrLoadRuntimeCtxValue;
    }
    return Protobuf.decode<ChainConfig>(response.data.value, ChainConfig.decode);
  }

  public static get(): EnvContext {
    if (this._instance == null) {
      this._instance = new EnvContext();
    }
    return this._instance!;
  }
}
