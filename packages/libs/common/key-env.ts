import {Key, ResultNotImplemented} from './key-path';
import {ChainConfig, ConsParams, EnvContent, EvmParams,} from "../proto";


export class EnvKey extends Key<ResultNotImplemented> {
    constructor() {
        super('env');
    }

    get consensusParams(): ConsParamsKey {
        return new Key('consensusParams', this.parts);
    }

    get chainConfig(): ChainConfigKey {
        return new Key('chainConfig', this.parts);
    }

    get evmParams(): EvmParamsKey {
        return new Key('evmParams', this.parts);
    }

    get baseFee(): EnvContentKey {
        return new Key('content', this.parts);
    }
}

export class EnvContentKey extends Key<EnvContent> {

}

export class ConsParamsKey extends Key<ConsParams> {

}

export class EvmParamsKey extends Key<EvmParams> {

}

export class ChainConfigKey extends Key<ChainConfig> {

}
