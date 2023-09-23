import {
  DataSpaceType,
  EthCallStacks,
  EthReceipt,
  EthStateChangeIndices,
  EthStateChanges,
  EthTransaction,
  GasMeter,
  TxExtProperty,
} from '../proto';
import { ErrLoadRuntimeCtxValue, RuntimeContext, utils } from '../system';
import { Protobuf } from 'as-proto/assembly';

export class TraceContext {
  private static _instance: TraceContext;

  private constructor() {}

  get callTree(): EthCallStacks {
    const response = RuntimeContext.get(DataSpaceType.TX_CALL_TREE);
    if (!response.data || !response.data.value) {
      throw ErrLoadRuntimeCtxValue;
    }
    return Protobuf.decode<EthCallStacks>(response.data.value, EthCallStacks.decode);
  }

  stateChanges(addr: string, variable: string, indices: Uint8Array[]): EthStateChanges {
    const array = new Array<string>(2 + indices.length);
    array[0] = addr;
    array[1] = variable;
    for (let i = 0; i < indices.length; i++) {
      array[2 + i] = utils.uint8ArrayToHex(indices[i]);
    }

    const response = RuntimeContext.get(DataSpaceType.TX_STATE_CHANGES, array);
    if (!response.data || !response.data.value) {
      throw ErrLoadRuntimeCtxValue;
    }

    return Protobuf.decode<EthStateChanges>(response.data.value, EthStateChanges.decode);
  }

  stateChangeIndices(addr: string, variable: string, indices: Uint8Array[]): EthStateChangeIndices {
    const array = new Array<string>(2 + indices.length);
    array[0] = addr;
    array[1] = variable;
    for (let i = 0; i < indices.length; i++) {
      array[2 + i] = utils.uint8ArrayToHex(indices[i]);
    }

    const response = RuntimeContext.get(DataSpaceType.TX_STATE_CHANGES, array);
    if (!response.data || !response.data.value) {
      throw ErrLoadRuntimeCtxValue;
    }

    return Protobuf.decode<EthStateChangeIndices>(
      response.data.value,
      EthStateChangeIndices.decode,
    );
  }

  public static get(): TraceContext {
    this._instance ||= new TraceContext();
    return this._instance;
  }
}

export class TxContext {
  private static _instance: TxContext;

  private constructor() {}

  get extProperties(): TxExtProperty {
    const response = RuntimeContext.get(DataSpaceType.TX_EXT_PROPERTIES);
    if (!response.data || !response.data.value) {
      throw ErrLoadRuntimeCtxValue;
    }
    return Protobuf.decode<TxExtProperty>(response.data.value, TxExtProperty.decode);
  }

  get content(): EthTransaction {
    const response = RuntimeContext.get(DataSpaceType.TX_CONTENT);
    if (!response.data || !response.data.value) {
      throw ErrLoadRuntimeCtxValue;
    }
    return Protobuf.decode<EthTransaction>(response.data.value, EthTransaction.decode);
  }

  get gasMeter(): GasMeter {
    const response = RuntimeContext.get(DataSpaceType.TX_GAS_METER);
    if (!response.data || !response.data.value) {
      throw ErrLoadRuntimeCtxValue;
    }
    return Protobuf.decode<GasMeter>(response.data.value, GasMeter.decode);
  }

  public static get(): TxContext {
    this._instance ||= new TxContext();
    return this._instance;
  }
}

export class EthReceiptContext {
  private static _instance: EthReceiptContext;

  private constructor() {}

  public get(): EthReceipt {
    const response = RuntimeContext.get(DataSpaceType.TX_RECEIPT);
    if (!response.data || !response.data.value) {
      throw ErrLoadRuntimeCtxValue;
    }
    return Protobuf.decode<EthReceipt>(response.data.value, EthReceipt.decode);
  }

  public static get(): EthReceiptContext {
    this._instance ||= new EthReceiptContext();
    return this._instance;
  }
}
