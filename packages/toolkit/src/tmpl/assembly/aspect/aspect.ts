// The entry file of your WebAssembly module.
export const  AspectTmpl=`
import { AspectOutput } from "@artela/aspect-libs";
import { IAspectBlock, IAspectTransaction } from "@artela/aspect-libs";
import { debug } from "@artela/aspect-libs";
import { BigInt } from "@artela/aspect-libs";

import { HoneyPot } from "./honeypot";
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
  OnBlockFinalizeCtx,
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
    return new AspectOutput(true);
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

    let ret = new AspectOutput(true);
    let message = "";
    if (ctx.currInnerTx != null) {
      // the object to visit to the traced changes.
      // 'traced changes' refers to all the cached world state change values during the execution process of trasaction in EVM.
      let balances = new HoneyPot.balances(ctx, ctx.currInnerTx!.to);

      let BalanceCtxKey = "original_balance";

      // step 2. restore original balance of attach account save in step 1.
      // getContext: Store/retireve a key-value pair in the blockchain state, all aspect shares.
      let originalBalanceCtx = ctx.getContext(BalanceCtxKey);
      let fromAddr = ethereum.Address.fromHexString(ctx.currInnerTx!.from);

      // set first balance value
      let originalBalance = BigInt.ZERO;
      if (originalBalanceCtx != "") {
        originalBalance = BigInt.fromString(originalBalanceCtx, 10);
      } else {
        // step 1. get the original balance of pointed account, attach account here, by traced state changes.
        // and save the context.
        // balance.before: get the original value of 'fromAddr' of traced balances changes.
        //   'trace' refers to all the cached world state change values during the execution process of trasaction in EVM.
        let fromBeforeBalance = balances.before(fromAddr);
        if (fromBeforeBalance) {
          ctx.setContext(BalanceCtxKey, fromBeforeBalance.change.toString(10));
          originalBalance = fromBeforeBalance.change;
        }
      }

      // step 3. Get the changed amount of "attach" account
      // balances.diff: return the difference between the latest value and the original value of tranced balances changes.
      let fromBalanceChange = balances.diff(fromAddr);
      if (!fromBalanceChange) {
        return ret;
      }
      let BalanceChangeCtxKey = "sum_balance_change_value";

      // getContext: retireve a key-value pair in the blockchain state, all aspect shares.
      let fromChangeBalance = ctx.getContext(BalanceChangeCtxKey);
      let last_change_from_balance = BigInt.ZERO;
      if (fromChangeBalance != "") {
        last_change_from_balance = BigInt.fromString(fromChangeBalance, 10);
      }
      last_change_from_balance = last_change_from_balance.add(fromBalanceChange);

      // step 4. Store all the changes of "attach" account
      // setContext: store a key-value pair in the blockchain state, all aspect shares.
      ctx.setContext(BalanceChangeCtxKey, last_change_from_balance.toString(10));
      let resultBalance = originalBalance.add(last_change_from_balance);

      // property means the aspect property, depolyed along with aspect.
      let honeyPotAddr = ctx.getProperty("HoneyPotAddr");

      // currentBalance: Always return the latest balance value, and if there is a transaction execution in progress, return the temporarily stored value.
      let contractBalance = ctx.currentBalance(honeyPotAddr);
      let fromBalance = ctx.currentBalance(ctx.currInnerTx!.from);
      if (contractBalance && fromBalance) {
        debug.log(
          "original_balance is: " +
            originalBalance.toString(10) +
            " diff_Balance is: " +
            fromBalanceChange.toString(10) +
            " last_change_from_balance is: " +
            last_change_from_balance.toString(10) +
            " result_balance is: " +
            resultBalance.toString(10) +
            " honeyPotAddr CurrentBalance is:" +
            contractBalance.toString(10) +
            " fromBalance CurrentBalance is:" +
            fromBalance.toString(10)
        );
      }

      // step 5. Check the sum of changed amount more than original balance, mark the tx failed.
      if (resultBalance.compareTo(BigInt.fromInt32(0)) < 0) {
        ret.success = false;
        ret.message = "balance is less than zero";
        return ret;
      }
    }

    return ret;
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