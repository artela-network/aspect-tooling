// eslint-disable-next-line @typescript-eslint/triple-slash-reference

import {
    DataSpaceType,
    EthCallStacks,
    EthReceipt,
    EthStateChanges,
    EthTransaction,
    GasMeter,
    TxExtProperty,
} from "../proto";
import { RuntimeContextAccessor, TraceCtx, UtilityProvider} from "../system";
import {Protobuf} from "as-proto/assembly";
import {KeysBundle} from "./key-builder";

export class TraceContext implements TraceCtx {
    getCallStack(): EthCallStacks |null {
        const response = RuntimeContextAccessor.get(DataSpaceType.TX_CALL_TREE, null);
        if (!response!.result!.success) {
            return null
        }
        return Protobuf.decode<EthCallStacks>(response!.data!.value, EthCallStacks.decode);

    }

    getStateChanges(addr: string, variable: string, key: KeysBundle): EthStateChanges|null {
        const array = new Array<string>(3);
        array[0]=addr
        array[1]=variable
        array[2]=key.marshal()

        const response = RuntimeContextAccessor.get(DataSpaceType.TX_STATE_CHANGES, array);
        if (!response!.result!.success) {
            return null
        }
        return Protobuf.decode<EthStateChanges>(response!.data!.value, EthStateChanges.decode);
    }
}

class TxContext {
    public getExtProperties(): TxExtProperty | null {
        const response = RuntimeContextAccessor.get(DataSpaceType.TX_EXT_PROPERTIES, null);
        if (!response.result.success || !response.data.value) {
            return null
        }
        return Protobuf.decode<TxExtProperty>(response.data.value, TxExtProperty.decode);
    }

    public getTx(): EthTransaction | null {
        const response = RuntimeContextAccessor.get(DataSpaceType.TX_CONTENT, null);
        if (!response.result.success || !response.data.value) {
            return null
        }
        return Protobuf.decode<EthTransaction>(response.data.value, EthTransaction.decode);
    }

    public getGasMeter(): GasMeter | null {
        const response = RuntimeContextAccessor.get(DataSpaceType.TX_GAS_METER, null);
        if (!response.result.success || !response.data.value) {
            return null
        }
        return Protobuf.decode<GasMeter>(response.data.value, GasMeter.decode);
    }
}

export const TxContextProvider = new TxContext()


export class EthReceiptContext {
    public get(): EthReceipt | null {
        const response = RuntimeContextAccessor.get(DataSpaceType.TX_RECEIPT, null);
        if (!response.result.success || !response.data.value) {
            return null
        }
        return Protobuf.decode<EthReceipt>(response.data.value, EthReceipt.decode);
    }
}
