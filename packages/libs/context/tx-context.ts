import {
  EthCallStacks,
  EthReceipt,
  EthStateChangeIndices,
  EthStateChanges,
  EthTransaction,
  GasMeter,
  QueryNameSpace,
  SateChangeQuery,
  TxExtProperty,
} from '../proto';
import {CtxKey, ErrLoadRuntimeCtxValue, NewMessageError, RuntimeContext} from '../system';
import {Protobuf} from 'as-proto/assembly';
import {MessageUrlType, ToAny} from "../types/message-helper";

export class TraceContext {
  private static _instance: TraceContext | null;

  private constructor() {}

  get callTree(): EthCallStacks {

    const response = RuntimeContext.query(QueryNameSpace.CallTree,);
    if (!response.data || !response.data!.value) {
      throw ErrLoadRuntimeCtxValue;
    }
    return Protobuf.decode<EthCallStacks>(response.data!.value, EthCallStacks.decode);
  }

  stateChanges(addr: string, variable: string, indices: Array<Uint8Array>): EthStateChanges {

    const sateChangeQuery = new SateChangeQuery(addr,variable,indices);
    const query = ToAny<SateChangeQuery>(MessageUrlType.SateChangeQuery,sateChangeQuery,SateChangeQuery.encode);
    const response = RuntimeContext.query(QueryNameSpace.StateChanges, query);
    if (!response.result!.success) {
      throw NewMessageError(response.result!.message);
    }

    return Protobuf.decode<EthStateChanges>(response.data!.value, EthStateChanges.decode);
  }

  stateChangeIndices(addr: string, variable: string, indices:  Array<Uint8Array>): EthStateChangeIndices {
    const sateChangeQuery = new SateChangeQuery(addr,variable,indices);
    const query = ToAny<SateChangeQuery>(MessageUrlType.SateChangeQuery,sateChangeQuery,SateChangeQuery.encode);
    const response = RuntimeContext.query(QueryNameSpace.StateChangeChildKeys, query);
    if (!response.result!.success) {
      throw NewMessageError(response.result!.message);
    }

    if (!response.result!.success) {
      throw NewMessageError(response.result!.message);
    }
    return Protobuf.decode<EthStateChangeIndices>(
      response.data!.value,
      EthStateChangeIndices.decode,
    );
  }

  public static get(): TraceContext {
    if (!this._instance) {
      this._instance = new TraceContext();
    }
    return this._instance!;
  }
}

export class TxContext {
  private static _instance: TxContext | null;

  private constructor() {}

  get extProperties(): TxExtProperty {
    const key = CtxKey.tx.extProperties.toString();
    const response = RuntimeContext.get(key);
    if (!response.data || !response.data!.value) {
      throw ErrLoadRuntimeCtxValue;
    }
    return Protobuf.decode<TxExtProperty>(response.data!.value, TxExtProperty.decode);
  }

  get content(): EthTransaction {
    const key = CtxKey.tx.content;
    const response = RuntimeContext.get(key);
    if (!response.data || !response.data!.value) {
      throw ErrLoadRuntimeCtxValue;
    }
    return Protobuf.decode<EthTransaction>(response.data!.value, EthTransaction.decode);
  }

  get gasMeter(): GasMeter {
    const key = CtxKey.tx.gasMeter;
    const response = RuntimeContext.get(key);
    if (!response.data || !response.data!.value) {
      throw ErrLoadRuntimeCtxValue;
    }
    return Protobuf.decode<GasMeter>(response.data!.value, GasMeter.decode);
  }

  public static get(): TxContext {
    if (!this._instance) {
      this._instance = new TxContext();
    }
    return this._instance!;
  }
}

export class EthReceiptContext {
  private static _instance: EthReceiptContext | null;

  private constructor() {}

  public get(): EthReceipt {
    const key = CtxKey.tx.receipt;
    const response = RuntimeContext.get(key);
    if (!response.data || !response.data!.value) {
      throw ErrLoadRuntimeCtxValue;
    }
    return Protobuf.decode<EthReceipt>(response.data!.value, EthReceipt.decode);
  }

  public static get(): EthReceiptContext {
    if (!this._instance) {
      this._instance = new EthReceiptContext();
    }
    return this._instance!;
  }
}
