// If the call count large than 1, mark the transaction as failed.
// The entry file of your WebAssembly module.

import {
    PostContractCallCtx,
    PreContractCallCtx,
    sys, entryPoint, execute, allocate, IPostContractCallJP, IPreContractCallJP,
} from '@artela/aspect-libs';

class GuardByCountAspect implements IPostContractCallJP, IPreContractCallJP {
    isOwner(sender: string): bool {
        const value = sys.aspect.property.get<string>('owner');
        return value.includes(sender);
    }


    CONTEXT_KEY: String = '{InnerTxToAddr}_CALL_COUNT';

    preContractCall(ctx: PreContractCallCtx): void {
        const contextKey = this.CONTEXT_KEY.replace('{InnerTxToAddr}', ctx.currentCall.to.toString());
        let callCount = ctx.aspect.transientStorage<u64>(contextKey).unwrap();
        callCount = callCount + 1;
        ctx.aspect.transientStorage<u64>(contextKey).set<u64>(callCount);
    }

    postContractCall(ctx: PostContractCallCtx): void {
        const contextKey = this.CONTEXT_KEY.replace('{InnerTxToAddr}', ctx.currentCall.to.toString());
        const callCount = ctx.aspect.transientStorage<u64>(contextKey).unwrap();
        // If the call count large than 1, mark the transaction as failed.
        if (callCount > 1) {
            sys.revert('multiple inner tx calls');
        }
    }

}

// 2.register aspect Instance
const aspect = new GuardByCountAspect()
entryPoint.setAspect(aspect)

// 3.must export it
export {execute, allocate}