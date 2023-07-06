// The entry file of your WebAssembly module.
export const  AspectTmpl=`
// The entry file of your WebAssembly module.
import { AspectOutput } from "@artela/aspect-libs";
import { IAspectBlock, IAspectTransaction } from "@artela/aspect-libs";
import { debug } from "@artela/aspect-libs";
import { BigInt } from "@artela/aspect-libs";

import { HoneyPot } from "./honeypot"
import {
    StateCtx,
    OnTxReceiveCtx,
    OnBlockInitializeCtx,
    OnTxVerifyCtx,
    OnAccountVerifyCtx,
    OnGasPaymentCtx,
    PreTxExecuteCtx,
    PreContractCallCtx,
    PostContractCallCtx,
    PostTxExecuteCtx,
    OnTxCommitCtx,
    OnBlockFinalizeCtx
} from "@artela/aspect-libs";
import { ethereum } from "@artela/aspect-libs";

class GuardByTraceAspect implements IAspectTransaction, IAspectBlock {
    isOwner(ctx: StateCtx, sender: string): bool {
        // to retrieve the properties of an aspect, pass the key "owner" associated with the aspect,
        // which is deployed together with it.
        // the properity is depoly like 'properties: [{ 'key': 'owner', 'value': AspectDeployer }...'
        let value = ctx.getProperty("owner");
        if (value.includes(sender)) {
            return true;
        }
        return false;
    }

    onContractBinding(ctx: StateCtx, contractAddr: string): bool {
        // to retrieve the properties of current aspect, pass the key "binding" associated with the aspect,
        // which is deployed together with it.
        let value = ctx.getProperty("binding");
        if (value.includes(contractAddr)) {
            return true;
        }
        return false;
    }


    onTxReceive(ctx: OnTxReceiveCtx): AspectOutput {
        return new AspectOutput(true);
    }

    onBlockInitialize(ctx: OnBlockInitializeCtx): AspectOutput {
        return new AspectOutput(true);
    }

    onTxVerify(ctx: OnTxVerifyCtx): AspectOutput {
        return new AspectOutput(true);;
    }

    onAccountVerify(ctx: OnAccountVerifyCtx): AspectOutput {
        return new AspectOutput(true);
    }

    onGasPayment(ctx: OnGasPaymentCtx): AspectOutput {
        return new AspectOutput(true);
    }

    preTxExecute(ctx: PreTxExecuteCtx): AspectOutput {

        return new AspectOutput(true);
    }

    preContractCall(ctx: PreContractCallCtx): AspectOutput {
        return new AspectOutput(true);
    }

    postContractCall(ctx: PostContractCallCtx): AspectOutput {
        // NOTE:
        // During the attack process, this method will be called multiple times.
        // The following commented steps are arranged in chronological order based on the called sequence.

        let sysBalance = new HoneyPot.SysBalance(ctx, ctx.currInnerTx!.to);
        var sysBalanceDiff = sysBalance.diff();

        let balanceMonitor = new HoneyPot.balances(ctx, ctx.currInnerTx!.to);
        let fromAddr = ethereum.Address.fromHexString(ctx.currInnerTx!.from);
        let fromAddrBalanceDiff = balanceMonitor.diff(fromAddr);
        if(!fromAddrBalanceDiff){
            return  new AspectOutput(true);
        }
        if(sysBalanceDiff.compareTo(fromAddrBalanceDiff)!=0){
            return new AspectOutput(false,"Balance change check failed");
        }
        return new AspectOutput(true);

    }

    postTxExecute(ctx: PostTxExecuteCtx): AspectOutput {
        return new AspectOutput(true);
    }

    onTxCommit(ctx: OnTxCommitCtx): AspectOutput {
        return new AspectOutput(true);
    }

    onBlockFinalize(ctx: OnBlockFinalizeCtx): AspectOutput {
        return new AspectOutput(true);
    }
}

export default GuardByTraceAspect;


`