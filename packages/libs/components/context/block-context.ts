import {EthBlockHeader, EthTxArray, GasMeter, LastCommitInfo, MinGasPrice} from '../../proto';
import {Protobuf} from 'as-proto/assembly';
import {ContextKey, ErrLoadRuntimeCtxValue} from '../../common';
import {RuntimeContextApi} from "../../hostapi";
import {BlockKey} from "../../common/key-block";

const runtimeContext = RuntimeContextApi.instance();
export class BlockContext {
  private static _instance: BlockContext | null;

  private constructor() {}

  public  header= new BlockKey().header


  // get header(): EthBlockHeader {
  //   const headerPath = ContextKey.block.header.toString();
  //   const response = runtimeContext.get(headerPath);
  //   if (!response.data || !response.data.value) {
  //     throw ErrLoadRuntimeCtxValue;
  //   }
  //   return Protobuf.decode<EthBlockHeader>(response.data.value, EthBlockHeader.decode);
  // }

  get partialBody(): EthTxArray {
    const bodyPath = ContextKey.block.txs.toString();
    const response = runtimeContext.get(bodyPath);
    if (!response.data || !response.data.value) {
      throw ErrLoadRuntimeCtxValue;
    }
    return Protobuf.decode<EthTxArray>(response.data.value, EthTxArray.decode);
  }

  get gasMeter(): GasMeter {
    const getKey = ContextKey.block.gasMeter.toString();
    const response = runtimeContext.get(getKey);
    if (!response.data || !response.data.value) {
      throw ErrLoadRuntimeCtxValue;
    }
    return Protobuf.decode<GasMeter>(response.data.value, GasMeter.decode);
  }


  get minGasPrice(): MinGasPrice {
    const getKey = ContextKey.block.minGasPrice.toString();
    const response = runtimeContext.get(getKey);
    if (!response.data || !response.data.value) {
      throw ErrLoadRuntimeCtxValue;
    }
    return Protobuf.decode<MinGasPrice>(response.data.value, MinGasPrice.decode);
  }

  get lastCommit(): LastCommitInfo {
    const getKey = ContextKey.block.lastCommit.toString();
    const response = runtimeContext.get(getKey);
    if (!response.data || !response.data.value) {
      throw ErrLoadRuntimeCtxValue;
    }
    return Protobuf.decode<LastCommitInfo>(response.data.value, LastCommitInfo.decode);
  }

  public static instance(): BlockContext {
    if (this._instance == null) {
      this._instance = new BlockContext();
    }
    return this._instance!;
  }
}
