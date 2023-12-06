import {
    FilterTxCtx,
    IAspectTransaction,
    PostContractCallCtx,
    PostTxCommitCtx,
    PostTxExecuteCtx,
    PreContractCallCtx,
    PreTxExecuteCtx,
} from "@artela/aspect-libs";


export class Aspect implements IAspectTransaction {
    filterTx(ctx: FilterTxCtx): bool {
        return true;
    }

    isOwner(sender: string): bool {
        return true;
    }

    postContractCall(ctx: PostContractCallCtx): void {
    }

    postTxCommit(ctx: PostTxCommitCtx): void {
    }

    postTxExecute(ctx: PostTxExecuteCtx): void {
    }

    preContractCall(ctx: PreContractCallCtx): void {
    }

    preTxExecute(ctx: PreTxExecuteCtx): void {
    }

}
