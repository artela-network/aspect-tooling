// The entry file of your WebAssembly module.

import {
  BigInt,
  FilterTxCtx,
  IAspectBlock,
  IAspectTransaction,
  OnBlockFinalizeCtx,
  OnBlockInitializeCtx,
  PostContractCallCtx,
  PostTxCommitCtx,
  PostTxExecuteCtx,
  PreContractCallCtx,
  PreTxExecuteCtx,
  sys,
} from '@artela/aspect-libs';
import { HoneyPotState } from './honeypot-storage';

class GuardByCountAspect implements IAspectTransaction, IAspectBlock {
  isOwner(sender: string): bool {
    let value = sys.aspect.property.get<string>('owner');
    return !!value.includes(sender);
  }

  onContractBinding(contractAddr: string): bool {
    let value = sys.aspect.property.get<string>('binding');
    return !!value.includes(contractAddr);
  }

  onBlockFinalize(ctx: OnBlockFinalizeCtx): void {}

  onBlockInitialize(ctx: OnBlockInitializeCtx): void {}

  filterTx(ctx: FilterTxCtx): bool {
    return true;
  }

  preTxExecute(ctx: PreTxExecuteCtx): void {}

  preContractCall(ctx: PreContractCallCtx): void {}

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

  postTxExecute(ctx: PostTxExecuteCtx): void {}

  postTxCommit(ctx: PostTxCommitCtx): void {}
}

export default GuardByCountAspect;
