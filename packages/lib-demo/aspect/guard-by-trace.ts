// The entry file of your WebAssembly module.

import {
    allocate,
    BigInt,
    entryPoint,
    execute,
    IPostContractCallJP,
    PostContractCallCtx,
    sys
} from '@artela/aspect-libs';
import {HoneyPotState} from './honeypot-storage';

class GuardByCountAspect implements IPostContractCallJP {
    isOwner(sender: string): bool {
        const value = sys.aspect.property.get<string>('owner');
        return !!value.includes(sender);
    }

    postContractCall(ctx: PostContractCallCtx): void {
        // 1.Calculate the eth balance change of DeFi SmartContract(HoneyPot) before and after tx.
        const sysBalance = new HoneyPotState._balance_(ctx.trace, ctx.currentCall.to);
        const deltaSys = sysBalance.current()!.sub(sysBalance.original());

        // 2.Calculate the financial change of withdrawer in DeFi SmartContract(HoneyPot) before and after tx.
        const contractState = new HoneyPotState.balances(ctx.trace, ctx.currentCall.to);

        let deltaUser = BigInt.ZERO;
        const fromState = contractState.get(ctx.currentCall.from);
        const current = fromState.current();
        const original = fromState.original();
        if (current && original) {
            deltaUser = current.sub(original);
        }
        // 3.Verify if the above two values are equal.
        if (deltaSys.compareTo(deltaUser) != 0) {
            sys.revert('risky transaction');
        }
    }
}

// 2.register aspect Instance
const aspect = new GuardByCountAspect()
entryPoint.setAspect(aspect)

// 3.must export it
export {execute, allocate}
