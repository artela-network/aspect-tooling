import {
  BlockHeaderKey,
  EthTxArrayKey,
  GasMeterKey,
  LastCommitKey,
  MinGasPriceKey,
} from '../../common/key-block';
import { BlockContextAccessible, ContextKey, NotAuthorizedFail } from '../../common';

export class BlockContext {
  private static _instance: BlockContext | null;

  private constructor() {}

  get header(): BlockHeaderKey {
    return ContextKey.block.header;
  }

  //EthTxArray
  get partialBody(): EthTxArrayKey {
    return ContextKey.block.txs;
  }

  //GasMeter
  get gasMeter(): GasMeterKey {
    return ContextKey.block.gasMeter;
  }

  //MinGasPrice
  get minGasPrice(): MinGasPriceKey {
    return ContextKey.block.minGasPrice;
  }

  //LastCommitInfo
  get lastCommit(): LastCommitKey {
    return ContextKey.block.lastCommit;
  }

  public static instance(ctx: BlockContextAccessible): BlockContext {
    if (ctx == null) {
      throw NotAuthorizedFail;
    }
    if (this._instance == null) {
      this._instance = new BlockContext();
    }
    return this._instance!;
  }
}
