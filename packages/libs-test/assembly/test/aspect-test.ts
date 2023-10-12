// The entry file of your WebAssembly module.

import {
  Entry,
  FilterTxCtx,
  IAspectTransaction,
  PostContractCallCtx,
  PostTxCommitCtx,
  PostTxExecuteCtx,
  PreContractCallCtx,
  PreTxExecuteCtx,
  sys,
} from '@artela/aspect-libs';

class AspectTest implements IAspectTransaction {
  filterTx(ctx: FilterTxCtx): bool {
    /*    ctx.readonlyState.get<string>("k2")
         sys.aspect.readonlyState(ctx).get<string>("k1")

      ctx.staticCall.submit()
         ctx.tx.nonce
         ctx.property.get()*/

    return true;
  }

  isOwner(sender: string): bool {
    sys.require(sender != null, 'isOwner sender is empty');
    return true;
  }

  onContractBinding(contractAddr: string): bool {
    sys.require(contractAddr != null, 'onContractBinding contractAddr is empty');
    return true;
  }

  postTxCommit(ctx: PostTxCommitCtx): void {
    sys.require(ctx.tx != null, 'postTxCommit tx is empty');
    sys.require(ctx.receipt != null, 'postTxCommit receipt is empty');
    sys.require(ctx.aspect != null, 'postTxCommit context is empty');
    sys.require(ctx.block != null, 'postTxCommit staticCaller is empty');
    sys.require(ctx.env != null, 'postTxCommit evmTxContext is empty');
  }

  postTxExecute(ctx: PostTxExecuteCtx): void {
    sys.require(ctx.tx != null, 'PostTxExecuteCtx tx is empty');
    sys.require(ctx.aspect != null, 'PostTxExecuteCtx aspect is empty');
    sys.require(ctx.stateDB != null, 'PostTxExecuteCtx stateDB is empty');
    sys.require(ctx.trace != null, 'PostTxExecuteCtx trace is empty');
    sys.require(ctx.block != null, 'PostTxExecuteCtx block is empty');
    sys.require(ctx.env != null, 'PostTxExecuteCtx env is empty');
  }

  preContractCall(ctx: PreContractCallCtx): void {
    var findCall = ctx.trace.findCall(1);
    var findCall1 = sys.context.trace(ctx).findCall(1);
    //sys.hostApi.runtimeContext;

    sys.require(ctx.tx != null, 'preContractCall tx is empty');
    sys.require(ctx.currentCall != null, 'preContractCall receipt is empty');
    sys.require(ctx.aspect != null, 'preContractCall context is empty');
    sys.require(ctx.block != null, 'preContractCall staticCaller is empty');
    sys.require(ctx.stateDB != null, 'preContractCall justInTimeCaller is empty');
    sys.require(ctx.trace != null, 'preContractCall justInTimeCaller is empty');
    sys.require(ctx.env != null, 'preContractCall justInTimeCaller is empty');
  }
  postContractCall(ctx: PostContractCallCtx): void {
    ctx.aspect.transientStorage<string>('k1').set<string>('v1');

    let gas = ctx.block.header.unwrap();
    sys.require(ctx.tx != null, 'postContractCall tx is empty');
    sys.require(ctx.currentCall != null, 'postContractCall currentCall is empty');
    sys.require(ctx.aspect != null, 'postContractCall aspect is empty');
    sys.require(ctx.block != null, 'postContractCall block is empty');
    sys.require(ctx.stateDB != null, 'postContractCall stateDB is empty');
    sys.require(ctx.trace != null, 'postContractCall trace is empty');
    sys.require(ctx.env != null, 'postContractCall env is empty');
  }

  preTxExecute(ctx: PreTxExecuteCtx): void {
    const ethBlockHeader = ctx.block.header.unwrap();
    const number = ctx.block.header.gasUsed.unwrap();

    sys.require(ctx.tx != null, 'preTxExecute tx is empty');
    sys.require(ctx.aspect != null, 'preTxExecute context is empty');
  }
}

export function execute(methodPtr: i32, argPtr: i32): i32 {
  const aspect = new AspectTest();
  const entry = new Entry(null, aspect, null);
  return entry.execute(methodPtr, argPtr);
}

export function allocate(size: i32): i32 {
  return sys.alloc(size);
}
