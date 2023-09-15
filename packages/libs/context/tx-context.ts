// eslint-disable-next-line @typescript-eslint/triple-slash-reference

import {
    GasMeter,
    TxExtProperty,
    DataSpaceType,
    EthCallStacks,
    EthInnerTransaction,
    EthReceipt,
    EthStateChanges,
    EthTransaction,
} from "../proto";
import {RuntimeContextAccessor, StateDbAccessor, TraceCtx, UtilityProvider} from "../system";
import {Protobuf} from "as-proto/assembly";

export class EvmInnerTxContext {
    tx: EthInnerTransaction | null;

    constructor(tx: EthInnerTransaction | null) {
        this.tx = tx;
    }


    public callTree(): EthCallStacks {
        const response = RuntimeContextAccessor.get(DataSpaceType.TX_CALL_TREE, null);
        if (!response.result.success || !response.data.value) {
            return null
        }
        return Protobuf.decode<EthCallStacks>(response.data.value, EthCallStacks.decode);
    }


    public getState(hash: string): string {
        return StateDbAccessor.getState(this.tx!.to, hash)
    }

    public getRefund(): i64 {
        return StateDbAccessor.getRefund()
    }

    public getCodeHash(): string {
        return StateDbAccessor.getCodeHash(this.tx!.to)
    }

    public getNonce(): i64 {
        return StateDbAccessor.getNonce(this.tx!.from)
    }
}

export class TraceContext implements TraceCtx {
    getCallStack(): EthCallStacks {
        const response = RuntimeContextAccessor.get(DataSpaceType.TX_CALL_TREE, null);
        if (!response.result.success || !response.data.value) {
            return null
        }
        return Protobuf.decode<EthCallStacks>(response.data.value, EthCallStacks.decode);

    }

    getStateChanges(addr: string, variable: string, key: Uint8Array): EthStateChanges {
        const array = Array<string>();
        array.push(addr)
        array.push(variable)
        const keyStr = UtilityProvider.uint8ArrayToHex(key);
        array.push(keyStr)

        const response = RuntimeContextAccessor.get(DataSpaceType.TX_STATE_CHANGES, array);
        if (!response.result.success || !response.data.value) {
            return null
        }
        return Protobuf.decode<EthStateChanges>(response.data.value, EthStateChanges.decode);
    }
}

export class EvmTxContext {
    tx: EthTransaction | null;

    constructor(tx: EthTransaction | null) {
        this.tx = tx;
    }

    public getState(hash: string): string {
        return StateDbAccessor.getState(this.tx!.to, hash)
    }

    public getRefund(): i64 {
        return StateDbAccessor.getRefund()
    }

    public getCodeHash(): string {
        return StateDbAccessor.getCodeHash(this.tx!.to)
    }

    public getNonce(): i64 {
        return StateDbAccessor.getNonce(this.tx!.from)
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
