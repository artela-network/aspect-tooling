import {
  DataSpaceType,
  EthCallStacks,
  EthReceipt,
  EthStateChanges,
  EthTransaction,
  GasMeter,
  TxExtProperty,
  EthStateChangeIndices,
} from '../proto';
import { RuntimeContextAccessor, TraceCtx, UtilityProvider } from '../system';
import { Protobuf } from 'as-proto/assembly';

export class TraceContext implements TraceCtx {
  getCallStack(): EthCallStacks | null {
    const response = RuntimeContextAccessor.get(DataSpaceType.TX_CALL_TREE, null);
    if (!response!.result!.success) {
      return null;
    }
    return Protobuf.decode<EthCallStacks>(response!.data!.value, EthCallStacks.decode);
  }

  getStateChanges(addr: string, variable: string, indices: Uint8Array[]): EthStateChanges | null {
    const array = new Array<string>(2 + indices.length);
    array[0] = addr;
    array[1] = variable;
    for (let i = 0; i < indices.length; i++) {
      array[2 + i] = UtilityProvider.uint8ArrayToString(indices[i], false);
    }

    const response = RuntimeContextAccessor.get(DataSpaceType.TX_STATE_CHANGES, array);
    if (!response!.result!.success) {
      return null;
    }

    return Protobuf.decode<EthStateChanges>(response!.data!.value, EthStateChanges.decode);
  }

  getStateChangeIndices(
    addr: string,
    variable: string,
    indices: Uint8Array[],
  ): EthStateChangeIndices | null {
    const array = new Array<string>(2 + indices.length);
    array[0] = addr;
    array[1] = variable;
    for (let i = 0; i < indices.length; i++) {
      array[2 + i] = UtilityProvider.uint8ArrayToString(indices[i], false);
    }

    const response = RuntimeContextAccessor.get(DataSpaceType.TX_STATE_CHANGES, array);
    if (!response!.result!.success) {
      return null;
    }

    return Protobuf.decode<EthStateChangeIndices>(
      response!.data!.value,
      EthStateChangeIndices.decode,
    );
  }
}

class TxContext {
  public getExtProperties(): TxExtProperty | null {
    const response = RuntimeContextAccessor.get(DataSpaceType.TX_EXT_PROPERTIES, null);
    if (!response.result.success || !response.data.value) {
      return null;
    }
    return Protobuf.decode<TxExtProperty>(response.data.value, TxExtProperty.decode);
  }

  public getTx(): EthTransaction | null {
    const response = RuntimeContextAccessor.get(DataSpaceType.TX_CONTENT, null);
    if (!response.result.success || !response.data.value) {
      return null;
    }
    return Protobuf.decode<EthTransaction>(response.data.value, EthTransaction.decode);
  }

  public getGasMeter(): GasMeter | null {
    const response = RuntimeContextAccessor.get(DataSpaceType.TX_GAS_METER, null);
    if (!response.result.success || !response.data.value) {
      return null;
    }
    return Protobuf.decode<GasMeter>(response.data.value, GasMeter.decode);
  }
}

export const TxContextProvider = new TxContext();

export class EthReceiptContext {
  public get(): EthReceipt | null {
    const response = RuntimeContextAccessor.get(DataSpaceType.TX_RECEIPT, null);
    if (!response.result.success || !response.data.value) {
      return null;
    }
    return Protobuf.decode<EthReceipt>(response.data.value, EthReceipt.decode);
  }
}
