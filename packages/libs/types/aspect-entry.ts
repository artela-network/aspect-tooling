import {AString} from './';

import {IAspectBlock, IAspectOperation, IAspectTransaction, OperationCtx} from '../types';
import {
    FilterTxCtx,
    OnBlockInitializeCtx,

    PreTxExecuteCtx,
    PreContractCallCtx,
    PostContractCallCtx,
    PostTxExecuteCtx,
    PostTxCommitCtx,
    OnBlockFinalizeCtx,
} from ".";
import {PointCutType} from "./aspect-interface";
import {
    DefAspectResponse, ErrAspectResponse, ErrorRunResult,
    LoadEthBlockAspect,
    LoadEthTxAspect,
    LoadInputString, MessageUrlType, NewDataResponse,
    StoreAspectResponse,
    StoreOutputBool
} from "./message-helper";
import {AspectResponse, BoolData, EthInnerTransaction,} from "../proto";
import {UtilityProvider} from "../system";

export class Entry {
    blockAspect: IAspectBlock | null;
    transactionAspect: IAspectTransaction | null;
    operationAspect: IAspectOperation | null;

    constructor(blockAspect: IAspectBlock | null, transactionAspect: IAspectTransaction | null, operationAspect: IAspectOperation | null) {
        if (blockAspect != null) {
            this.blockAspect = blockAspect;
        }
        if (transactionAspect != null) {
            this.transactionAspect = transactionAspect;
        }
        if (operationAspect != null) {
            this.operationAspect = operationAspect;
        }
    }

    public isBlockLevel(): i32 {
        return StoreOutputBool(this.blockAspect != null);
    }

    public isTransactionLevel(): i32 {
        return StoreOutputBool(this.transactionAspect != null);
    }

    public execute(methodPtr: i32, argPtr: i32): i32 {
        const methodArg = new AString();
        methodArg.load(methodPtr);
        const method = methodArg.get();
        UtilityProvider.sLog(method)

        if (method == PointCutType.ON_CONTRACT_BINDING_METHOD && this.transactionAspect) {
            const arg = LoadInputString(argPtr);
            const out = this.transactionAspect!.onContractBinding(arg);
            return StoreOutputBool(out);
        }
        if (method == PointCutType.IS_OWNER_METHOD) {
            const arg = LoadInputString(argPtr);
            if (this.transactionAspect) {
                const out = this.transactionAspect!.isOwner(arg);
                return StoreOutputBool(out);
            }
            if (this.blockAspect != null) {
                const out = this.blockAspect!.isOwner(arg);
                return StoreOutputBool(out);
            }
        }

        let out: AspectResponse;
        if (method == PointCutType.ON_TX_RECEIVE_METHOD) {
            const arg = LoadEthTxAspect(argPtr);
            const ctx = new FilterTxCtx(arg.tx);
            const isFilter = this.transactionAspect!.filterTx(ctx);
            const boolData = new BoolData(isFilter);
            out = NewDataResponse(true, "success", MessageUrlType.BoolData, boolData, BoolData.encode)

        } else if (method == PointCutType.PRE_TX_EXECUTE_METHOD) {
            const arg = LoadEthTxAspect(argPtr);

            const ctx = new PreTxExecuteCtx(arg.tx);
            this.transactionAspect!.preTxExecute(ctx)
            out = DefAspectResponse();

        } else if (method == PointCutType.PRE_CONTRACT_CALL_METHOD) {
            const arg = LoadEthTxAspect(argPtr);
            if (arg.currInnerTx == null) {
                out = ErrAspectResponse("currInnerTx is null")
            } else {
                const ethInnerTransaction = new EthInnerTransaction(
                    arg.currInnerTx!.from,
                    arg.currInnerTx!.to,
                    arg.currInnerTx!.data,
                    arg.currInnerTx!.value,
                    arg.currInnerTx!.gas);

                const ctx = new PreContractCallCtx(arg.tx, ethInnerTransaction);

                this.transactionAspect!.preContractCall(ctx);

                out = DefAspectResponse();
            }


        } else if (method == PointCutType.POST_CONTRACT_CALL_METHOD) {
            const arg = LoadEthTxAspect(argPtr);

            const ctx = new PostContractCallCtx(arg.tx, arg.currInnerTx);
            this.transactionAspect!.postContractCall(ctx);
            out = DefAspectResponse();


        } else if (method == PointCutType.POST_TX_EXECUTE_METHOD) {
            const arg = LoadEthTxAspect(argPtr);

            const ctx = new PostTxExecuteCtx(arg.tx);
            this.transactionAspect!.postTxExecute(ctx);
            out = DefAspectResponse();


        } else if (method == PointCutType.ON_TX_COMMIT_METHOD) {
            const arg = LoadEthTxAspect(argPtr);

            const ctx = new PostTxCommitCtx(arg.tx);
            this.transactionAspect!.postTxCommit(ctx);
            out = DefAspectResponse();

        } else if (method == PointCutType.OPERATION_METHOD) {
            const arg = LoadEthTxAspect(argPtr);
            const ctx = new OperationCtx(arg.tx);
            out = this.operationAspect!.operation(ctx)
        } else if (method == PointCutType.ON_BLOCK_INITIALIZE_METHOD) {
            // block level aspect
            const block = LoadEthBlockAspect(argPtr);
            const ctx = new OnBlockInitializeCtx(block.header);
            this.blockAspect!.onBlockInitialize(ctx);
            out = DefAspectResponse();
        } else if (method == PointCutType.ON_BLOCK_FINALIZE_METHOD) {
            const block = LoadEthBlockAspect(argPtr);
            const ctx = new OnBlockFinalizeCtx(block.header);
            this.blockAspect!.onBlockFinalize(ctx);
            out = DefAspectResponse();
        } else {
            out = ErrAspectResponse("method " + method + " not found or not implemented");
        }

        return StoreAspectResponse(out);
    }
}

