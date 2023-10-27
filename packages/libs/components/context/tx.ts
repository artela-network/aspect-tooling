import {EthCallStacks, EthStackTransaction, EthStateChangeIndices, EthStateChanges, TxExtProperty,} from '../../proto';
import {
  ContextKey,
  NewMessageError,
  NotAuthorizedFail,
  ReceiptContextAccessible,
  TraceAccessible,
  TraceCtx,
  TxContextAccessible,
} from '../../common';
import {Protobuf} from 'as-proto/assembly';
import {RuntimeContextApi} from '../../hostapi';
import {EthReceiptKey, TxContentKey} from '../../common/key-tx';
import {GasMeterKey} from '../../common/key-block';

const runtimeContext = RuntimeContextApi.instance();

export class TraceContext implements TraceCtx {
  private static _instance: TraceContext | null;

  private constructor() {}

  findCall(index: u64): EthStackTransaction | null {
    const callIndexKey = ContextKey.tx.callTree.callIndex(index).toString();
    const response = runtimeContext.get(callIndexKey);
    if (!response.result!.success) {
      throw NewMessageError('Err load calltree');
    }
    if (response.data == null) {
      return new EthStackTransaction()
    }
    return Protobuf.decode<EthCallStacks>(response.data!.value, EthCallStacks.decode).calls.get(
      index,
    );
  }

  callTree(): EthCallStacks {
    const callTreeKey = ContextKey.tx.callTree.toString();
    const response = runtimeContext.get(callTreeKey);
    if (!response.result!.success) {
      throw NewMessageError('Err load calltree');
    }
    if (response.data == null) {
      return new EthCallStacks()
    }
    return Protobuf.decode<EthCallStacks>(response.data!.value, EthCallStacks.decode);
  }

  stateChanges(addr: string, variable: string, indices: Array<Uint8Array>): EthStateChanges {
    const statePath = ContextKey.tx.stateChanges
      .account(addr)
      .variable(variable)
      .indices(indices)
      .toString();
    const response = runtimeContext.get(statePath);
    if (!response.result!.success) {
      throw NewMessageError(response.result!.message);
    }
    if (response.data == null) {
      return new EthStateChanges()
    }

    return Protobuf.decode<EthStateChanges>(response.data!.value, EthStateChanges.decode);
  }

  stateChangeIndices(
    addr: string,
    variable: string,
    indices: Array<Uint8Array>,
  ): EthStateChangeIndices {
    const statePath = ContextKey.tx.stateChanges
      .account(addr)
      .variable(variable)
      .indices(indices)
      .toString();
    const response = runtimeContext.get(statePath);
    if (!response.result!.success) {
      throw NewMessageError(response.result!.message);
    }

    if (!response.result!.success) {
      throw NewMessageError(response.result!.message);
    }
    if (response.data == null) {
      return new EthStateChangeIndices()
    }

    return Protobuf.decode<EthStateChangeIndices>(
      response.data!.value,
      EthStateChangeIndices.decode,
    );
  }

  public static instance(ctx: TraceAccessible): TraceContext {
    if (ctx == null) {
      throw NotAuthorizedFail;
    }
    if (!this._instance) {
      this._instance = new TraceContext();
    }
    return this._instance!;
  }
}

export class Tx {
  private static _instance: Tx | null;

  private constructor() {}

  get extProperties(): TxExtProperty {
    return ContextKey.tx.extProperties.unwrap();
  }

  get content(): TxContentKey {
    return ContextKey.tx.content;
  }

  get gasMeter(): GasMeterKey {
    return ContextKey.tx.gasMeter;
  }

  public static instance(ctx: TxContextAccessible): Tx {
    if (ctx == null) {
      throw NotAuthorizedFail;
    }
    if (!this._instance) {
      this._instance = new Tx();
    }
    return this._instance!;
  }
}

export class ReceiptContext {
  private static _instance: ReceiptContext | null;

  private constructor() {}

  public get(): EthReceiptKey {
    return ContextKey.tx.receipt;
  }

  public static instance(ctx: ReceiptContextAccessible): ReceiptContext {
    if (ctx == null) {
      throw NotAuthorizedFail;
    }
    if (!this._instance) {
      this._instance = new ReceiptContext();
    }
    return this._instance!;
  }
}
