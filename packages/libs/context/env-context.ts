import { ErrLoadRuntimeCtxValue, RuntimeContext } from '../system';
import { ChainConfig, ConsParams, DataSpaceType, EnvContent, EvmParams } from '../proto';
import { Protobuf } from 'as-proto/assembly';

export class EnvContext {
  private static _instance: EnvContext;

  private constructor() {}

  public getBaseFee(): EnvContent {
    const response = RuntimeContext.get(DataSpaceType.ENV_BASE_INFO);
    if (!response.data || !response.data.value) {
      throw ErrLoadRuntimeCtxValue;
    }
    return Protobuf.decode<EnvContent>(response.data.value, EnvContent.decode);
  }

  public consParams(): ConsParams {
    //   ENV_CONS_PARAMS = 7;
    const response = RuntimeContext.get(DataSpaceType.ENV_CONS_PARAMS);
    if (!response.data || !response.data.value) {
      throw ErrLoadRuntimeCtxValue;
    }
    return Protobuf.decode<ConsParams>(response.data.value, ConsParams.decode);
  }

  public evmParams(): EvmParams {
    //   ENV_EVM_PARAMS = 9;
    const response = RuntimeContext.get(DataSpaceType.ENV_EVM_PARAMS);
    if (!response.data || !response.data.value) {
      throw ErrLoadRuntimeCtxValue;
    }
    return Protobuf.decode<EvmParams>(response.data.value, EvmParams.decode);
  }

  public chainConfig(): ChainConfig {
    //   ENV_CHAIN_CONFIG = 8;
    const response = RuntimeContext.get(DataSpaceType.ENV_CHAIN_CONFIG);
    if (!response.data || !response.data.value) {
      throw ErrLoadRuntimeCtxValue;
    }
    return Protobuf.decode<ChainConfig>(response.data.value, ChainConfig.decode);
  }

  public static get(): EnvContext {
    EnvContext._instance ||= new EnvContext();
    return EnvContext._instance;
  }
}
