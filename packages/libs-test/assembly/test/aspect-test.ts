// The entry file of your WebAssembly module.

import {
    FilterTxCtx,
    GetPayMasterCtx,
    IAspectTransaction,
    PostContractCallCtx, PostTxCommitCtx, PostTxExecuteCtx, PreContractCallCtx, PreTxExecuteCtx,
    VerifyAccountCtx, VerifyTxCtx
} from "@artela/aspect-libs/types";
import {UtilityProvider} from "@artela/aspect-libs/system";
import {Entry} from "@artela/aspect-libs/types/aspect-entry";

function AssertTrue(cond: bool, msg: string): void {
    if (!cond) {
        UtilityProvider.revert(msg)
    }
}

class AspectTest implements IAspectTransaction {

    filterTx(ctx: FilterTxCtx): bool {

        AssertTrue(ctx.tx != null, 'FilterTxCtx tx is empty')
        AssertTrue(ctx.context != null, "FilterTxCtx context is empty")

        return true;
    }

    getPayMaster(ctx: GetPayMasterCtx): string {

        AssertTrue(ctx.tx != null, 'GetPayMasterCtx tx is empty')
        AssertTrue(ctx.context != null, "GetPayMasterCtx context is empty")

        return "test";
    }

    isOwner(sender: string): bool {
        AssertTrue(sender != null, "isOwner sender is empty")
        return true;
    }

    onContractBinding(contractAddr: string): bool {
        AssertTrue(contractAddr != null, "onContractBinding contractAddr is empty")
        return true;
    }

    postContractCall(ctx: PostContractCallCtx): void {
        AssertTrue(ctx.tx != null, 'postContractCall tx is empty')
        AssertTrue(ctx.jitCall != null, "postContractCall call is empty")
        AssertTrue(ctx.context != null, "postContractCall context is empty")
        AssertTrue(ctx.innerTx != null, "postContractCall innerTx is empty")
        AssertTrue(ctx.innerTxContext != null, "postContractCall innerTxContext is empty")
    }

    postTxCommit(ctx: PostTxCommitCtx): void {
        AssertTrue(ctx.tx != null, 'postTxCommit tx is empty')
        AssertTrue(ctx.receipt != null, "postTxCommit receipt is empty")
        AssertTrue(ctx.aspectContext != null, "postTxCommit context is empty")
        AssertTrue(ctx.staticCaller != null, "postTxCommit staticCaller is empty")
        AssertTrue(ctx.evmTxContext != null, "postTxCommit evmTxContext is empty")
        AssertTrue(ctx.scheduleManager != null, "postTxCommit scheduleManager is empty")

    }

    postTxExecute(ctx: PostTxExecuteCtx): void {
        AssertTrue(ctx.tx != null, 'postTxExecute tx is empty')
        AssertTrue(ctx.aspectContext != null, "postTxExecute aspectContext is empty")
        AssertTrue(ctx.evmTxContext != null, "postTxExecute evmTxContext is empty")
        AssertTrue(ctx.staticCaller != null, "postTxExecute staticCaller is empty")
        AssertTrue(ctx.blockContext != null, "postTxExecute blockContext is empty")

    }

    preContractCall(ctx: PreContractCallCtx): void {

        AssertTrue(ctx.tx != null, 'preContractCall tx is empty')
        AssertTrue(ctx.innerTx != null, "preContractCall receipt is empty")
        AssertTrue(ctx.context != null, "preContractCall context is empty")
        AssertTrue(ctx.innerTxContext != null, "preContractCall staticCaller is empty")
        AssertTrue(ctx.jitCall != null, "preContractCall justInTimeCaller is empty")

    }

    preTxExecute(ctx: PreTxExecuteCtx): void {
        AssertTrue(ctx.tx != null, 'preTxExecute tx is empty')
        AssertTrue(ctx.aspectContext != null, "preTxExecute context is empty")
    }

    verifyAccount(ctx: VerifyAccountCtx): bool {

        AssertTrue(ctx.tx != null, 'verifyAccount tx is empty')
        AssertTrue(ctx.context != null, "verifyAccount context is empty")
        return true;
    }

    verifyTx(ctx: VerifyTxCtx): bool {

        AssertTrue(ctx.tx != null, 'VerifyTxCtx tx is empty')
        AssertTrue(ctx.context != null, "VerifyTxCtx context is empty")
        return true;
    }

}


export function execute(methodPtr: i32, argPtr: i32): i32 {
    const aspect = new AspectTest()
    const entry = new Entry(null, aspect, null);
    return entry.execute(methodPtr, argPtr);
}

export function allocate(size: i32): i32 {
    return UtilityProvider.alloc(size);
}