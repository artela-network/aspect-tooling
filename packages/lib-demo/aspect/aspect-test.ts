// The entry file of your WebAssembly module.

import {
    entryPoint,execute, allocate,
    IPostContractCallJP,
    IPostTxCommitJP,
    IPostTxExecuteJP,
    IPreContractCallJP,
    IPreTxExecuteJP,
    PostContractCallCtx,
    PostTxCommitCtx,
    PostTxExecuteCtx,
    PreContractCallCtx,
    PreTxExecuteCtx,
    sys,
} from '@artela/aspect-libs';

class AspectTest implements IPreTxExecuteJP, IPostTxExecuteJP, IPreContractCallJP, IPostContractCallJP, IPostTxCommitJP {


    isOwner(sender: string): bool {
        sys.require(sender != null, 'isOwner sender is empty');
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
        const findCall = ctx.trace.findCall(1);
        const findCall1 = sys.context.trace(ctx).findCall(1);
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

// 2.register aspect Instance
const aspect = new AspectTest()
entryPoint.setAspect(aspect)

// 3.must export it
export {execute, allocate}

