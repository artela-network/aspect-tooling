// The entry file of your WebAssembly module.

import {
    allocate,
    entryPoint,
    execute,
    IPostContractCallJP,
    IPreContractCallJP,
    PostContractCallCtx,
    PreContractCallCtx,
    sys,
} from '@artela/aspect-libs';

class GuardByCountAspect implements IPostContractCallJP, IPreContractCallJP {
    isOwner(sender: string): bool {
        const value = sys.aspect.property.get<string>('owner');
        return !!value.includes(sender);
    }


    _CONTEXT_KEY: string = '{InnerTxToAddr}_LOCK';
    _NOT_ENTERED: string = '0';
    _ENTERED: string = '1';

    preContractCall(ctx: PreContractCallCtx): void {
        const curContract = ctx.currentCall.to.toString();
        const reentKey = this._CONTEXT_KEY.replace('{InnerTxToAddr}', curContract);

        // 2.Check if another transaction has already occupied.
        if (this._ENTERED == ctx.aspect.transientStorage<string>(reentKey).unwrap()) {
            sys.revert('revert');
        }
        // 3.Set reentrant lock entered.
        ctx.aspect.transientStorage<string>(reentKey).set<string>(this._ENTERED);
    }

    postContractCall(ctx: PostContractCallCtx): void {
        // 1.Get reentrant lock key of current contract.
        const curContract = ctx.currentCall.to.toString();
        const reentKey = this._CONTEXT_KEY.replace('{InnerTxToAddr}', curContract);

        // 2.Set reentrant lock not entered.
        ctx.aspect.transientStorage<string>(reentKey).set<string>(this._NOT_ENTERED);
    }

}

// 2.register aspect Instance
const aspect = new GuardByCountAspect()
entryPoint.setAspect(aspect)

// 3.must export it
export {execute, allocate}
