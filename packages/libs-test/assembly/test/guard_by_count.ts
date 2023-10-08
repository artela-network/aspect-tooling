// If the call count large than 1, mark the transaction as failed.
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
    let value = sys.aspect.property.get<string>("owner");
    return value.includes(sender);
  }
  onContractBinding(contractAddr: string): bool {
    let value = sys.aspect.property.get<string>("binding");
    return value.includes(contractAddr);
  }
  onBlockFinalize(ctx: OnBlockFinalizeCtx): void {
  }

  onBlockInitialize(ctx: OnBlockInitializeCtx): void {
  }

  filterTx(ctx: FilterTxCtx): bool {
    return true;
  }
  CONTEXT_KEY: String = "{InnerTxToAddr}_CALL_COUNT";
  preTxExecute(ctx: PreTxExecuteCtx): void {
  }
  preContractCall(ctx: PreContractCallCtx): void {
    let contextKey = this.CONTEXT_KEY.replace("{InnerTxToAddr}", ctx.currentCall.to.toString());
    let callCount = ctx.aspect.transientStorage<u64>(contextKey).unwrap();
    callCount = callCount+1;
    ctx.aspect.transientStorage<u64>(contextKey).set<u64>(callCount);
  }
  postContractCall(ctx: PostContractCallCtx): void {
    let contextKey = this.CONTEXT_KEY.replace("{InnerTxToAddr}", ctx.currentCall.to.toString());
    let callCount = ctx.aspect.transientStorage<u64>(contextKey).unwrap();
    // If the call count large than 1, mark the transaction as failed.
    if (callCount > 1) {
      vm.revert( "multiple inner tx calls");
    }
  }

  postTxExecute(ctx: PostTxExecuteCtx): void {

  }


  postTxCommit(ctx: PostTxCommitCtx): void {
  }


}

export default GuardByCountAspect;
