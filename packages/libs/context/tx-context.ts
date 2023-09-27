import {
  EthCallStacks,
  EthReceipt,
  EthStateChangeIndices,
  EthStateChanges,
  EthTransaction,
  GasMeter,
  TxExtProperty,
} from '../proto';
import {tx, ErrLoadRuntimeCtxValue, NewMessageError, RuntimeContext} from '../system';
import {Protobuf} from 'as-proto/assembly';

export class TraceContext {
  private static _instance: TraceContext | null;

  private constructor() {}

  callTree(value:i64=-1): EthCallStacks {
    const idx = tx.callStack.callIndex(value).toString();
    const response = RuntimeContext.get(idx);
    if (!response.data || !response.data!.value) {
      throw ErrLoadRuntimeCtxValue;
    }
    return Protobuf.decode<EthCallStacks>(response.data!.value, EthCallStacks.decode);
  }

  stateChanges(addr: string, variable: string, indices: Array<Uint8Array>): EthStateChanges {
    const statePath = tx.stateChanges.account(addr).variable(variable).indices(indices).toString();
    const response = RuntimeContext.get(statePath)
    if (!response.result!.success) {
      throw NewMessageError(response.result!.message);
    }

    return Protobuf.decode<EthStateChanges>(response.data!.value, EthStateChanges.decode);
  }

  stateChangeIndices(addr: string, variable: string, indices:  Array<Uint8Array>): EthStateChangeIndices {
    const statePath = tx.stateChanges.account(addr).variable(variable).indices(indices).getIndices();
    const response = RuntimeContext.get(statePath)
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
    const key = tx.extProperties.toString()
    const response = RuntimeContext.get(key);
    if (!response.data || !response.data!.value) {
      throw ErrLoadRuntimeCtxValue;
    }
    return Protobuf.decode<TxExtProperty>(response.data!.value, TxExtProperty.decode);
  }

  get content(): EthTransaction {
    const key = tx.content;
    const response = RuntimeContext.get(key);
    if (!response.data || !response.data!.value) {
      throw ErrLoadRuntimeCtxValue;
    }
    return Protobuf.decode<EthTransaction>(response.data!.value, EthTransaction.decode);
  }

  get gasMeter(): GasMeter {
    const key = tx.gasMeter;
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
    const key = tx.receipt;
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
