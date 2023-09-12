import {RuntimeContextAccessor} from "../system";
import {DataSpaceType, EnvContent, ConsParams, EvmParams, ChainConfig} from "../proto";
import {Protobuf} from "as-proto/assembly";


class EnvContext {
    public getBaseFee(): EnvContent {
        const response = RuntimeContextAccessor.get(DataSpaceType.ENV_BASE_INFO, null);
        if (!response.data.value) {
            return null
        }
        return Protobuf.decode<EnvContent>(response.data.value, EnvContent.decode);
    }

    public consParams(): ConsParams {
//   ENV_CONS_PARAMS = 7;
        const response = RuntimeContextAccessor.get(DataSpaceType.ENV_CONS_PARAMS, null);
        if (!response.data.value) {
            return null
        }
        return Protobuf.decode<ConsParams>(response.data.value, ConsParams.decode);
    }

    public evmParams(): EvmParams {
//   ENV_EVM_PARAMS = 9;
        const response = RuntimeContextAccessor.get(DataSpaceType.ENV_EVM_PARAMS, null);
        if (!response.data.value) {
            return null
        }
        return Protobuf.decode<EvmParams>(response.data.value, EvmParams.decode);
    }

    public chainConfig(): ChainConfig {
        //   ENV_CHAIN_CONFIG = 8;
        const response = RuntimeContextAccessor.get(DataSpaceType.ENV_CHAIN_CONFIG, null);
        if (!response.data.value) {
            return null
        }
        return Protobuf.decode<ChainConfig>(response.data.value, ChainConfig.decode);
    }
}

export const EnvContextProvider = new EnvContext()