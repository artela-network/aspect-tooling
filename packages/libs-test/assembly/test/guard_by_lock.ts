// The entry file of your WebAssembly module.

import {
    FilterTxCtx,
    IAspectBlock,
    IAspectTransaction,
    OnBlockFinalizeCtx,
    OnBlockInitializeCtx,
    PostContractCallCtx,
    PostTxCommitCtx,
    PostTxExecuteCtx,
    PreContractCallCtx,
    PreTxExecuteCtx, sys,
} from "@artela/aspect-libs";

class GuardByCountAspect implements IAspectTransaction, IAspectBlock {


    isOwner(sender: string): bool {
        const value = sys.aspect.property.get<string>("owner");
        return !!value.includes(sender);
    }

    onContractBinding(contractAddr: string): bool {
        const value = sys.aspect.property.get<string>("binding");
        return !!value.includes(contractAddr);
    }

    onBlockFinalize(ctx: OnBlockFinalizeCtx): void {
    }

    onBlockInitialize(ctx: OnBlockInitializeCtx): void {
    }

    filterTx(ctx: FilterTxCtx): bool {
        return true;
    }

    preTxExecute(ctx: PreTxExecuteCtx): void {
    }

    _CONTEXT_KEY = "{InnerTxToAddr}_LOCK";
    _NOT_ENTERED = "0";
    _ENTERED = "1";

    preContractCall(ctx: PreContractCallCtx): void {

        const curContract = ctx.currentCall.to.toString();
        const reentKey = this._CONTEXT_KEY.replace("{InnerTxToAddr}", curContract);

        // 2.Check if another transaction has already occupied.
        if (this._ENTERED == ctx.aspect.transientStorage<string>(reentKey).unwrap()) {
          sys.common.revert("revert")
        }
        // 3.Set reentrant lock entered.
        ctx.aspect.transientStorage<string>(reentKey).set<string>(this._ENTERED);
    }

    postContractCall(ctx: PostContractCallCtx): void {

        // 1.Get reentrant lock key of current contract.
        const curContract = ctx.currentCall.to.toString();
        const reentKey = this._CONTEXT_KEY.replace("{InnerTxToAddr}", curContract);

        // 2.Set reentrant lock not entered.
        ctx.aspect.transientStorage<string>(reentKey).set<string>(this._NOT_ENTERED);
    }

    postTxExecute(ctx: PostTxExecuteCtx): void {

    }


    postTxCommit(ctx: PostTxCommitCtx): void {
    }


}

export default GuardByCountAspect;