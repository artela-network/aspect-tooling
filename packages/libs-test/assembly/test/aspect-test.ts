// The entry file of your WebAssembly module.

import {
    FilterTxCtx,
    IAspectTransaction,
    PostContractCallCtx,
    PostTxCommitCtx,
    PostTxExecuteCtx,
    PreContractCallCtx,
    PreTxExecuteCtx,
    Entry, sys,
} from '@artela/aspect-libs';


class AspectTest implements IAspectTransaction {
    filterTx(ctx: FilterTxCtx): bool {
        sys.vm.require(ctx.tx != null, 'FilterTxCtx tx is empty');
        sys.vm.require(ctx.aspect != null, 'FilterTxCtx context is empty');

        return true;
    }


    isOwner(sender: string): bool {
        sys.vm.require(sender != null, 'isOwner sender is empty');
        return true;
    }

    onContractBinding(contractAddr: string): bool {
        sys.vm.require(contractAddr != null, 'onContractBinding contractAddr is empty');
        return true;
    }



    postTxCommit(ctx: PostTxCommitCtx): void {
        sys.vm.require(ctx.tx != null, 'postTxCommit tx is empty');
        sys.vm.require(ctx.receipt != null, 'postTxCommit receipt is empty');
        sys.vm.require(ctx.aspect != null, 'postTxCommit context is empty');
        sys.vm.require(ctx.block != null, 'postTxCommit staticCaller is empty');
        sys.vm.require(ctx.env != null, 'postTxCommit evmTxContext is empty');


    }

    postTxExecute(ctx: PostTxExecuteCtx): void {
        sys.vm.require(ctx.tx != null, 'PostTxExecuteCtx tx is empty');
        sys.vm.require(ctx.aspect != null, 'PostTxExecuteCtx aspect is empty');
        sys.vm.require(ctx.stateDB != null, 'PostTxExecuteCtx stateDB is empty');
        sys.vm.require(ctx.trace != null, 'PostTxExecuteCtx trace is empty');
        sys.vm.require(ctx.block != null, 'PostTxExecuteCtx block is empty');
        sys.vm.require(ctx.env != null, 'PostTxExecuteCtx env is empty');
    }

    preContractCall(ctx: PreContractCallCtx): void {
        sys.vm.require(ctx.tx != null, 'preContractCall tx is empty');
        sys.vm.require(ctx.currentCall != null, 'preContractCall receipt is empty');
        sys.vm.require(ctx.aspect != null, 'preContractCall context is empty');
        sys.vm.require(ctx.block != null, 'preContractCall staticCaller is empty');
        sys.vm.require(ctx.stateDB != null, 'preContractCall justInTimeCaller is empty');
        sys.vm.require(ctx.trace != null, 'preContractCall justInTimeCaller is empty');
        sys.vm.require(ctx.env != null, 'preContractCall justInTimeCaller is empty');

    }
    postContractCall(ctx: PostContractCallCtx): void {
        sys.vm.require(ctx.tx != null, 'postContractCall tx is empty');
        sys.vm.require(ctx.currentCall != null, 'postContractCall currentCall is empty');
        sys.vm.require(ctx.aspect != null, 'postContractCall aspect is empty');
        sys.vm.require(ctx.block != null, 'postContractCall block is empty');
        sys.vm.require(ctx.stateDB != null, 'postContractCall stateDB is empty');
        sys.vm.require(ctx.trace != null, 'postContractCall trace is empty');
        sys.vm.require(ctx.env != null, 'postContractCall env is empty');
    }

    preTxExecute(ctx: PreTxExecuteCtx): void {
        sys.vm.require(ctx.tx != null, 'preTxExecute tx is empty');
        sys.vm.require(ctx.aspect != null, 'preTxExecute context is empty');
    }

}

export function execute(methodPtr: i32, argPtr: i32): i32 {
    const aspect = new AspectTest();
    const entry = new Entry(null, aspect, null);
    return entry.execute(methodPtr, argPtr);
}

export function allocate(size: i32): i32 {
    return sys.vm.alloc(size);
}