import {
    IAspectOperation,
    OperationCtx,
    PostContractCallCtx,
    PostTxCommitCtx,
    PostTxExecuteCtx,
    PreContractCallCtx,
    PreTxExecuteCtx,
    sys,entryPoint,execute, allocate,
    VerifyTxCtx,
} from "@artela/aspect-libs";
import {ITransactionVerifier} from "@artela/aspect-libs/types/aspect-interface";

/**
 * There are two types of Aspect: Transaction-Level Aspect and Block-Level Aspect.
 * Transaction-Level Aspect will be triggered whenever there is a transaction calling the bound smart contract.
 * Block-Level Aspect will be triggered whenever there is a new block generated.
 *
 * An Aspect can be Transaction-Level, Block-Level,IAspectOperation or both.
 * You can implement corresponding interfaces: IAspectTransaction, IAspectBlock,IAspectOperation or both to tell Artela which
 * type of Aspect you are implementing.
 */
 class Aspect implements  IAspectOperation, ITransactionVerifier {
    verifyTx(ctx: VerifyTxCtx, validationData: Uint8Array): Uint8Array {

        return sys.utils.hexToUint8Array("0x89bD10F4BEd107104b68a9C09890eE6FB3F0D95e")
    }

    /**
     * isOwner is the governance account implemented by the Aspect, when any of the governance operation
     * (including upgrade, config, destroy) is made, isOwner method will be invoked to check
     * against the initiator's account to make sure it has the permission.
     *
     * @param ctx context of Aspect state
     * @param sender address of the operation initiator
     * @return true if check success, false if check fail
     */
    isOwner(sender: string): bool {
        // always return false on isOwner can make the Aspect immutable
        return true;
    }


    /**
     * preTxExecute is a join-point which will be invoked before the transaction execution.
     *
     * @param ctx context of the given join-point
     * @return result of Aspect execution
     */
    preTxExecute(ctx: PreTxExecuteCtx): void {
        // Implement me...
        let key = "num";
        ctx.mutableState.get<String>(key).set<string>("10");
        let value = ctx.mutableState.get<string>(key).unwrap()
        sys.require(value == "10", "==state check===preTxExecute state error=== " + value)
    }

    /**
     * preContractCall is a join-point which will be invoked before the contract call is executed.
     *
     * @param ctx context of the given join-point
     * @return result of Aspect execution
     */
    preContractCall(ctx: PreContractCallCtx): void {
        let key = "num";

        let value = ctx.mutableState.get<i32>(key).unwrap()
        sys.require(value == 10, "==state check===preContractCall state error===" + value.toString(10))
        let newval = value + 10
        ctx.mutableState.get<string>(key).set<string>(newval.toString(10));

    }

    /**
     * postContractCall is a join-point which will be invoked after a contract has finished.
     *
     * @param ctx context of the given join-point
     * @return result of Aspect execution
     */
    postContractCall(ctx: PostContractCallCtx): void {
        // Implement me...
        let key = "num";

        let value = ctx.mutableState.get<i32>(key).unwrap()
        sys.require(value == 20, "==state check===postContractCall state error===" + value.toString(10))
        let newval = value + 10
        ctx.mutableState.get<string>(key).set<string>(newval.toString(10));
    }


    /**
     * postTxExecute is a join-point which will be invoked when the transaction execution is finished but state is not committed.
     *
     * @param ctx context of the given join-point
     * @return result of Aspect execution
     */
    postTxExecute(ctx: PostTxExecuteCtx): void {
        // Implement me...
        let key = "num";

        let value = ctx.mutableState.get<i32>(key).unwrap()
        sys.require(value == 30, "==state check===postContractCall state error===" + value.toString(10))
        let newval = value + 10
        ctx.mutableState.get<string>(key).set<string>(newval.toString(10));
    }

    /**
     * onTxCommit is a join-point which will be invoked after the state of the transaction is committed.
     *
     * @param ctx context of the given join-point
     * @return result of Aspect execution
     */
    postTxCommit(ctx: PostTxCommitCtx): void {
        let key = "num";

        let value = ctx.mutableState.get<i32>(key).unwrap()
        sys.require(value == 40, "==state check===postTxCommit state error===" + value.toString(10))
        let newval = value + 10
        ctx.mutableState.get<string>(key).set<string>(newval.toString(10));
    }


    /**
     * operation is a Aspect call.
     *
     * @param ctx  tx input
     * @return result of operation execution
     */
    operation(ctx: OperationCtx, data: Uint8Array): Uint8Array {
        let key = "operation";
        let value = ctx.mutableState.get<i64>(key).unwrap();
        value += 10;
        ctx.mutableState.get<i64>(key).set<i64>(value);
        return sys.utils.stringToUint8Array(value.toString(10));
    }
}
// 2.register aspect Instance
const aspect = new Aspect()
entryPoint.setAspect(aspect)

// 3.must export it
export {execute, allocate}