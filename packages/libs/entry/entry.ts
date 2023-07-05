import { ABool, AString, AUint8Array } from '../message';
import { AspectInput, AspectOutput } from '../proto';

import { IAspectBlock, IAspectTransaction } from '../types';
import { Protobuf } from 'as-proto/assembly';
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
} from "./context";
export class Entry {
  private readonly blockAspect: IAspectBlock;
  private readonly transactionAspect: IAspectTransaction;

  constructor(blockAspect: IAspectBlock, transactionAspect: IAspectTransaction) {
    this.blockAspect = blockAspect;
    this.transactionAspect = transactionAspect;
  }

  public isBlockLevel(): i32 {
    return this.storeOutputBool(this.blockAspect != null);
  }

  public isTransactionLevel(): i32 {
    return this.storeOutputBool(this.transactionAspect != null);
  }

  loadAspectInput(argPtr: i32): AspectInput {
    const encodedArg = new AUint8Array();
    encodedArg.load(argPtr);
    return Protobuf.decode<AspectInput>(encodedArg.get(), AspectInput.decode);
  }

  loadInputString(argPtr: i32): string {
    const arg = new AString();
    arg.load(argPtr);
    return arg.get();
  }

  storeOutputBool(out: bool): i32 {
    const b = new ABool();
    b.set(out);
    return b.store();
  }

  storeAspectOutput(output: AspectOutput): i32 {
    const encodedOutput = Protobuf.encode(output, AspectOutput.encode);
    const ret = new AUint8Array();
    ret.set(encodedOutput);
    return ret.store();
  }

  public execute(methodPtr: i32, argPtr: i32): i32 {
    const methodArg = new AString();
    methodArg.load(methodPtr);
    const method = methodArg.get();

    if (this.blockAspect == null && this.transactionAspect == null) {
      throw new Error("invalid aspect code");
    }

    if (method == "onContractBinding" && this.transactionAspect != null) {
      const arg = this.loadInputString(argPtr);
      const out = this.transactionAspect.onContractBinding(new StateCtx(), arg);
      return this.storeOutputBool(out);
    } if (method == "isOwner") {
      const arg = this.loadInputString(argPtr);
      if (this.transactionAspect != null) {
        const out = this.transactionAspect.isOwner(new StateCtx(), arg);
        return this.storeOutputBool(out);
      }

      const out = this.blockAspect.isOwner(new StateCtx(), arg);
      return this.storeOutputBool(out);
    }

    const arg = this.loadAspectInput(argPtr);
    let out: AspectOutput;
    if (method == "onTxReceive" && this.transactionAspect != null) {
      const ctx = new OnTxReceiveCtx(arg.blockHeight, arg.tx);
      out = this.transactionAspect.onTxReceive(ctx);

    } else if (method == "onBlockInitialize" && this.blockAspect != null) {
      const ctx = new OnBlockInitializeCtx(arg.blockHeight, arg.tx);
      out = this.blockAspect.onBlockInitialize(ctx);

    } else if (method == "onTxVerify" && this.transactionAspect != null) {
      const ctx = new OnTxVerifyCtx(arg.blockHeight, arg.tx);
      out = this.transactionAspect.onTxVerify(ctx);

    } else if (method == "onAccountVerify" && this.transactionAspect != null) {
      const ctx = new OnAccountVerifyCtx(arg.blockHeight, arg.tx);
      out = this.transactionAspect.onAccountVerify(ctx);

    } else if (method == "onGasPayment" && this.transactionAspect != null) {
      const ctx = new OnGasPaymentCtx(arg.blockHeight, arg.tx);
      out = this.transactionAspect.onGasPayment(ctx);

    } else if (method == "preTxExecute" && this.transactionAspect != null) {
      const ctx = new PreTxExecuteCtx(arg.blockHeight, arg.tx);
      out = this.transactionAspect.preTxExecute(ctx);

    } else if (method == "preContractCall" && this.transactionAspect != null) {
      const ctx = new PreContractCallCtx(arg.blockHeight, arg.tx,arg.currInnerTx);
      out = this.transactionAspect.preContractCall(ctx);

    } else if (method == "postContractCall" && this.transactionAspect != null) {
      const ctx = new PostContractCallCtx(arg.blockHeight, arg.tx,arg.currInnerTx);
      out = this.transactionAspect.postContractCall(ctx);

    } else if (method == "postTxExecute" && this.transactionAspect != null) {
      const ctx = new PostTxExecuteCtx(arg.blockHeight, arg.tx);
      out = this.transactionAspect.postTxExecute(ctx);

    } else if (method == "onTxCommit" && this.transactionAspect != null) {
      const ctx = new OnTxCommitCtx(arg.blockHeight, arg.tx);
      out = this.transactionAspect.onTxCommit(ctx);

    } else if (method == "onBlockFinalize" && this.blockAspect != null) {
      const ctx = new OnBlockFinalizeCtx(arg.blockHeight, arg.tx);
      out = this.blockAspect.onBlockFinalize(ctx);

    } else {
      throw new Error("method " + method + " not found or not implemented");
    }
    return this.storeAspectOutput(out);
  }
}

