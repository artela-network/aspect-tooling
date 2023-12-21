import {
    OnBlockFinalizeCtx,
    OnBlockInitializeCtx,
    OperationCtx,
    PostContractCallCtx,
    PostTxCommitCtx,
    PostTxExecuteCtx,
    PreContractCallCtx,
    PreTxExecuteCtx,
} from '.';
import {VerifyTxCtx} from './paramter/verify-tx-ctx';

export interface IAspectBase {
    /**
     * isOwner is used to check whether the sender is the owner of the contract.
     *
     * @param sender the sender of the transaction, hex string format with 0x prefix.
     * @returns true if the sender is the owner of the contract, otherwise false.
     */
    isOwner(sender: string): bool;
}

export interface IAspectBlock extends IAspectBase {
    /**
     * onBlockInitialize is called when the block proposal is prepared.
     *
     * @param ctx the context of the block proposal.
     */
    onBlockInitialize(ctx: OnBlockInitializeCtx): void;

    /**
     * onBlockFinalize is called when the block is finalized.
     *
     * @param ctx the context of the finalized block.
     */
    onBlockFinalize(ctx: OnBlockFinalizeCtx): void;
}

export interface ITransactionVerifier extends IAspectBase {
    /**
     * verifyTx is used to verify the transaction. If the transaction is valid,
     * an ethereum address will be returned. Otherwise, you can either call revert or return empty data
     * to end the transaction.
     *
     * @param ctx the context of the transaction to be verified.
     * @param validationData the validation data of the transaction to determine the transaction sender.
     */
    verifyTx(ctx: VerifyTxCtx, validationData: Uint8Array): Uint8Array;
}


export interface IPostTxCommitJP extends IAspectBase {

    /**
     * postTxCommit will be triggered after the transaction is committed.
     *
     * @param ctx the context of the finalized transaction and receipt.
     */
    postTxCommit(ctx: PostTxCommitCtx): void;
}

export interface IPreTxExecuteJP extends IAspectBase {

    /**
     * preTxExecute will be triggered before the transaction is executed.
     *
     * @param ctx the context of the transaction to be executed.
     */
    preTxExecute(ctx: PreTxExecuteCtx): void;
}

export interface IPreContractCallJP extends IAspectBase {

    /**
     * preContractCall will be triggered before the contract call is executed.
     *
     * @param ctx the context of the contract call.
     */
    preContractCall(ctx: PreContractCallCtx): void;
}

export interface IPostContractCallJP extends IAspectBase {

    /**
     * postContractCall will be triggered after the contract call is executed.
     *
     * @param ctx the context of the executed contract call.
     */
    postContractCall(ctx: PostContractCallCtx): void;
}

export interface IPostTxExecuteJP extends IAspectBase {

    /**
     * postTxExecute will be triggered after the transaction is executed.
     *
     * @param ctx the context of the executed transaction.
     */
    postTxExecute(ctx: PostTxExecuteCtx): void;
}


export interface IAspectOperation {
    /**
     * operation is used to execute the logics within the Aspect.
     *
     * @param ctx the context of the operation.
     * @param data the data of the operation input.
     * @return the data of the operation output.
     */
    operation(ctx: OperationCtx, data: Uint8Array): Uint8Array;
}

export class PointCutType {
    static readonly ON_TX_RECEIVE_METHOD: string = 'onTxReceive';
    static readonly ON_BLOCK_INITIALIZE_METHOD: string = 'onBlockInitialize';

    static readonly VERIFY_TX: string = 'verifyTx';

    static readonly PRE_TX_EXECUTE_METHOD: string = 'preTxExecute';
    static readonly PRE_CONTRACT_CALL_METHOD: string = 'preContractCall';
    static readonly POST_CONTRACT_CALL_METHOD: string = 'postContractCall';
    static readonly POST_TX_EXECUTE_METHOD: string = 'postTxExecute';
    static readonly POST_TX_COMMIT: string = 'postTxCommit';
    static readonly ON_BLOCK_FINALIZE_METHOD: string = 'onBlockFinalize';

    static readonly OPERATION_METHOD: string = 'operation';
    static readonly IS_OWNER_METHOD: string = 'isOwner';

    static readonly FILTER_TX: string = 'filterTx'
}
