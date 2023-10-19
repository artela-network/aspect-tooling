import {Key, ResultUnwrap} from './key-path';
import {
  BytesData, ChainConfig, ConsParams, EnvContent,
  EthBlockHeader,
  EthReceipt,
  EthTransaction,
  EthTxArray, EvmParams, GasMeter,
  IntData, LastCommitInfo, MinGasPrice,
  StringData,
  TxExtProperty
} from '../proto';
import {Protobuf} from 'as-proto/assembly';

export class EthBlockHeaderUnwrap implements ResultUnwrap<EthBlockHeader> {
  public decode(u: Uint8Array): EthBlockHeader {
    return Protobuf.decode<EthBlockHeader>(u, EthBlockHeader.decode);
  }
}

export class StringUnwrap implements ResultUnwrap<string> {
  public decode(u: Uint8Array): string {
    const stringData = Protobuf.decode<StringData>(u, StringData.decode);
    return stringData.data;
  }
}

export class Uint64Unwrap implements ResultUnwrap<u64> {
  public decode(u: Uint8Array): u64 {
    const intData = Protobuf.decode<IntData>(u, IntData.decode);
    return <u64>intData.data;
  }
}

export class Uint8ArrayUnwrap implements ResultUnwrap<Uint8Array> {
  public decode(u: Uint8Array): Uint8Array {
    const bytesData = Protobuf.decode<BytesData>(u, BytesData.decode);
    return bytesData.data;
  }
}

export class TxExtPropertyUnwrap implements ResultUnwrap<TxExtProperty> {
  public decode(u: Uint8Array): TxExtProperty {
    return Protobuf.decode<TxExtProperty>(u, TxExtProperty.decode);
  }
}

export class EthTransactionUnwrap implements ResultUnwrap<EthTransaction> {
  public decode(u: Uint8Array): EthTransaction {
    return Protobuf.decode<EthTransaction>(u, EthTransaction.decode);
  }
}

export class EthReceiptUnwrap implements ResultUnwrap<EthReceipt> {
  public decode(u: Uint8Array): EthReceipt {
    return Protobuf.decode<EthReceipt>(u, EthReceipt.decode);
  }
}
export class EthTxArrayUnwrap implements ResultUnwrap<EthTxArray> {
  public decode(u: Uint8Array): EthTxArray {
    return Protobuf.decode<EthTxArray>(u, EthTxArray.decode);
  }
}
export class GasMeterUnwrap implements ResultUnwrap<GasMeter> {
  public decode(u: Uint8Array): GasMeter {
    return Protobuf.decode<GasMeter>(u, GasMeter.decode);
  }
}
export class MinGasPriceUnwrap implements ResultUnwrap<MinGasPrice> {
  public decode(u: Uint8Array): MinGasPrice {
    return Protobuf.decode<MinGasPrice>(u, MinGasPrice.decode);
  }
}
export class LastCommitInfoUnwrap implements ResultUnwrap<LastCommitInfo> {
  public decode(u: Uint8Array): LastCommitInfo {
    return Protobuf.decode<LastCommitInfo>(u, LastCommitInfo.decode);
  }
}

export class ChainConfigUnwrap implements ResultUnwrap<ChainConfig> {
  public decode(u: Uint8Array): ChainConfig {
    return Protobuf.decode<ChainConfig>(u, ChainConfig.decode);
  }
}
export class EvmParamsUnwrap implements ResultUnwrap<EvmParams> {
  public decode(u: Uint8Array): EvmParams {
    return Protobuf.decode<EvmParams>(u, EvmParams.decode);
  }
}
export class ConsParamsUnwrap implements ResultUnwrap<ConsParams> {
  public decode(u: Uint8Array): ConsParams {
    return Protobuf.decode<ConsParams>(u, ConsParams.decode);
  }
}
export class EnvContentUnwrap implements ResultUnwrap<EnvContent> {
  public decode(u: Uint8Array): EnvContent {
    return Protobuf.decode<EnvContent>(u, EnvContent.decode);
  }
}
