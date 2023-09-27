import {
  EthBlockHeader,
  EthTxArray,
  GasMeter,
  LastCommitInfo,
  MinGasPrice,
} from '../proto';
import { Protobuf } from 'as-proto/assembly';
import { ErrLoadRuntimeCtxValue, CtxKey, RuntimeContext } from '../system';

export class BlockContext {
  private static _instance: BlockContext | null;

  private constructor() {}

  get header(): EthBlockHeader {
    const headerPath = CtxKey.block.header
    const response = RuntimeContext.get(headerPath);
    if (!response.data || !response.data.value) {
      throw ErrLoadRuntimeCtxValue;
    }
    return Protobuf.decode<EthBlockHeader>(response.data.value, EthBlockHeader.decode);
  }

  get partialBody(): EthTxArray {
    const bodyPath = CtxKey.block.txs;
    const response = RuntimeContext.get(bodyPath);
    if (!response.data || !response.data.value) {
      throw ErrLoadRuntimeCtxValue;
    }
    return Protobuf.decode<EthTxArray>(response.data.value, EthTxArray.decode);
  }

  get gasMeter(): GasMeter {
    const getKey = CtxKey.block.gasMeter;
    const response = RuntimeContext.get(getKey);
    if (!response.data || !response.data.value) {
      throw ErrLoadRuntimeCtxValue;
    }
    return Protobuf.decode<GasMeter>(response.data.value, GasMeter.decode);
  }

  get minGasPrice(): MinGasPrice {
    const getKey = CtxKey.block.minGasPrice;
    const response = RuntimeContext.get(getKey);
    if (!response.data || !response.data.value) {
      throw ErrLoadRuntimeCtxValue;
    }
    return Protobuf.decode<MinGasPrice>(response.data.value, MinGasPrice.decode);
  }

  get lastCommit(): LastCommitInfo {
    const getKey = CtxKey.block.lastCommit;
    const response = RuntimeContext.get(getKey);
    if (!response.data || !response.data.value) {
      throw ErrLoadRuntimeCtxValue;
    }
    return Protobuf.decode<LastCommitInfo>(response.data.value, LastCommitInfo.decode);
  }

  public static get(): BlockContext {
    if (this._instance == null) {
      this._instance = new BlockContext();
    }
    return this._instance!;
  }
}
