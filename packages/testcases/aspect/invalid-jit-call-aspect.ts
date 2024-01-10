// If the call count large than 1, mark the transaction as failed.
// The entry file of your WebAssembly module.

import {
    allocate,
    entryPoint,
    execute,
    IAspectOperation,
    IPostContractCallJP,
    IPostTxExecuteJP,
    IPreContractCallJP,
    IPreTxExecuteJP,
    ITransactionVerifier,
    JitCallBuilder,
    OperationInput,
    PostContractCallInput,
    PostTxExecuteInput,
    PreContractCallInput,
    PreTxExecuteInput,
    stringToUint8Array,
    sys,
    TxVerifyInput,
    uint8ArrayToHex,
    uint8ArrayToString
} from '@artela/aspect-libs';

class InvalidJitCallAspect implements IPreTxExecuteJP, IPostTxExecuteJP, ITransactionVerifier, IAspectOperation, IPreContractCallJP, IPostContractCallJP {
    isOwner(sender: Uint8Array): bool {
        return true;
    }

    operation(input: OperationInput): Uint8Array {
        this.doJitCall("operation")
        return stringToUint8Array("")
    }

    preTxExecute(input: PreTxExecuteInput): void {
        this.doJitCall("preTxExecute")
    }

    postTxExecute(input: PostTxExecuteInput): void {
        this.doJitCall("postTxExecute")
    }

    verifyTx(input: TxVerifyInput): Uint8Array {
        this.doJitCall("verifyTx")
        return stringToUint8Array("")
    }

    preContractCall(input: PreContractCallInput): void {
        this.doJitCall("preContractCall")
    }

    postContractCall(input: PostContractCallInput): void {
        this.doJitCall("postContractCall")
    }

    doJitCall(joinPoint: string): void {
        const targetPhase = uint8ArrayToString(sys.aspect.property.get<Uint8Array>('join_point'));
        if (joinPoint !== targetPhase) {
            return
        }

        const sender = sys.aspect.property.get<Uint8Array>('from');
        const to = sys.aspect.property.get<Uint8Array>('to');
        const callData = sys.aspect.property.get<Uint8Array>('data');
        sys.log(`||| jit  ${joinPoint} ${uint8ArrayToHex(sender)}`);
        sys.log(`||| jit  ${joinPoint} ${uint8ArrayToHex(to)}`);
        sys.log(`||| jit  ${joinPoint} ${uint8ArrayToHex(callData)}`);

        const request = JitCallBuilder.simple(sender, to, callData).build();

        const response = sys.hostApi.evmCall.jitCall(request);

        sys.log(`||| jit ${joinPoint} result ${uint8ArrayToHex(response.ret)}`);
        sys.log(`||| jit ${joinPoint} errorMsg ${response.errorMsg}`);

        if (response.errorMsg != '') {
            sys.revert(response.errorMsg)
        }
    }
}

const aspect = new InvalidJitCallAspect();
entryPoint.setAspect(aspect);

export { allocate, execute };
