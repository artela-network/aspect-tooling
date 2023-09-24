import {
  DataSpaceType,
  EthBlockHeader,
  EthTxArray,
  Evidence,
  GasMeter,
  LastCommitInfo,
  MinGasPrice,
} from '../proto';
import { Protobuf } from 'as-proto/assembly';
import { ErrLoadRuntimeCtxValue, RuntimeContext } from '../system';

export class BlockContext {
  private static _instance: BlockContext | null;

  private constructor() {}

  get header(): EthBlockHeader {
    const response = RuntimeContext.get(DataSpaceType.BLOCK_HEADER);
    if (!response.data || !response.data.value) {
      throw ErrLoadRuntimeCtxValue;
    }
    return Protobuf.decode<EthBlockHeader>(response.data.value, EthBlockHeader.decode);
  }

  get partialBody(): EthTxArray {
    const response = RuntimeContext.get(DataSpaceType.BLOCK_TXS);
    if (!response.data || !response.data.value) {
      throw ErrLoadRuntimeCtxValue;
    }
    return Protobuf.decode<EthTxArray>(response.data.value, EthTxArray.decode);
  }

  get gasMeter(): GasMeter {
    const response = RuntimeContext.get(DataSpaceType.BLOCK_GAS_METER);
    if (!response.data || !response.data.value) {
      throw ErrLoadRuntimeCtxValue;
    }
    return Protobuf.decode<GasMeter>(response.data.value, GasMeter.decode);
  }

  get minGasPrice(): MinGasPrice {
    const response = RuntimeContext.get(DataSpaceType.BLOCK_MIN_GAS_PRICE);
    if (!response.data || !response.data.value) {
      throw ErrLoadRuntimeCtxValue;
    }
    return Protobuf.decode<MinGasPrice>(response.data.value, MinGasPrice.decode);
  }

  get lastCommit(): LastCommitInfo {
    const response = RuntimeContext.get(DataSpaceType.BLOCK_LAST_COMMIT);
    if (!response.data || !response.data.value) {
      throw ErrLoadRuntimeCtxValue;
    }
    return Protobuf.decode<LastCommitInfo>(response.data.value, LastCommitInfo.decode);
  }

  get evidences(): Evidence {
    const response = RuntimeContext.get(DataSpaceType.BLOCK_EVIDENCE);
    if (!response.data || !response.data.value) {
      throw ErrLoadRuntimeCtxValue;
    }
    return Protobuf.decode<Evidence>(response.data.value, Evidence.decode);
  }

  public static get(): BlockContext {
    if (this._instance == null) {
      this._instance = new BlockContext();
    }
    return this._instance!;
  }
}
