import {  AspectOutput } from '../proto';

import {

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
} from "../entry/context";

import {  StateCtx} from "../entry/context_parent"

export interface IAspectBlock {
  isOwner(ctx: StateCtx, sender: string): bool
  onBlockInitialize(ctx: OnBlockInitializeCtx): AspectOutput
  onBlockFinalize(ctx: OnBlockFinalizeCtx): AspectOutput
}

export interface IAspectTransaction {
  isOwner(ctx: StateCtx, sender: string): bool
  onContractBinding(ctx: StateCtx, contractAddr: string): bool
  onTxReceive(ctx: OnTxReceiveCtx): AspectOutput
  onTxVerify(ctx: OnTxVerifyCtx): AspectOutput
  onAccountVerify(ctx: OnAccountVerifyCtx): AspectOutput
  onGasPayment(ctx: OnGasPaymentCtx): AspectOutput
  preTxExecute(ctx: PreTxExecuteCtx): AspectOutput
  preContractCall(ctx: PreContractCallCtx): AspectOutput
  postContractCall(ctx: PostContractCallCtx): AspectOutput
  postTxExecute(ctx: PostTxExecuteCtx): AspectOutput
  onTxCommit(ctx: OnTxCommitCtx): AspectOutput
}

