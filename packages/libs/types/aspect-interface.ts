import {
    OperationInput,
    PostContractCallInput,
    PostTxExecuteInput,
    PreContractCallInput,
    PreTxExecuteInput,
    TxVerifyInput,
} from '../proto';

export interface IAspectBase {
    /**
     * isOwner is used to check whether the sender is the owner of the contract.
     *
     * @param sender the sender of the transaction, hex string format with 0x prefix.
     * @returns true if the sender is the owner of the contract, otherwise false.
     */
    isOwner(sender: Uint8Array): bool;
}

export interface ITransactionVerifier extends IAspectBase {
    /**
     * verifyTx is used to verify the transaction. If the transaction is valid,
     * an ethereum address will be returned. Otherwise, you can either call revert or return empty data
     * to end the transaction.
     *
     * @param input the input for the transaction verification.
     */
    verifyTx(input: TxVerifyInput): Uint8Array;
}

export interface IPreTxExecuteJP extends IAspectBase {
    /**
     * preTxExecute will be triggered before the transaction is executed.
     *
     * @param input context information of current join point.
     */
    preTxExecute(input: PreTxExecuteInput): void;
}

export interface IPreContractCallJP extends IAspectBase {
    /**
     * preContractCall will be triggered before the contract call is executed.
     *
     * @param input context information of current join point.
     */
    preContractCall(input: PreContractCallInput): void;
}

export interface IPostContractCallJP extends IAspectBase {
    /**
     * postContractCall will be triggered after the contract call is executed.
     *
     * @param input context information of current join point.
     */
    postContractCall(input: PostContractCallInput): void;
}

export interface IPostTxExecuteJP extends IAspectBase {
    /**
     * postTxExecute will be triggered after the transaction is executed.
     *
     * @param input context information of current join point.
     */
    postTxExecute(input: PostTxExecuteInput): void;
}

export interface IAspectOperation extends IAspectBase {
    /**
     * operation is used to execute the logics within the Aspect.
     *
     * @param input input data for the operation.
     * @return the data of the operation output.
     */
    operation(input: OperationInput): Uint8Array;
}

export abstract class AspectBase implements IAspectBase, IAspectOperation, IPostTxExecuteJP, IPreTxExecuteJP, IPreContractCallJP, IPostContractCallJP, ITransactionVerifier {
    abstract isOwner(sender: Uint8Array): bool;

    abstract operation(input: OperationInput): Uint8Array;

    abstract preTxExecute(input: PreTxExecuteInput): void;

    abstract postContractCall(input: PostContractCallInput): void;

    abstract preContractCall(input: PreContractCallInput): void;

    abstract postTxExecute(input: PostTxExecuteInput): void;

    abstract verifyTx(input: TxVerifyInput): Uint8Array;

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

    static readonly FILTER_TX: string = 'filterTx';
}
