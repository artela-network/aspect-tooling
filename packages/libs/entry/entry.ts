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
    let encodedArg = new AUint8Array();
    encodedArg.load(argPtr);
    return Protobuf.decode<AspectInput>(encodedArg.get(), AspectInput.decode);
  }

  loadInputString(argPtr: i32): string {
    let arg = new AString();
    arg.load(argPtr);
    return arg.get();
  }

  storeOutputBool(out: bool): i32 {
    let b = new ABool();
    b.set(out);
    return b.store();
  }

  storeAspectOutput(output: AspectOutput): i32 {
    let encodedOutput = Protobuf.encode(output, AspectOutput.encode);
    let ret = new AUint8Array();
    ret.set(encodedOutput);
    return ret.store();
  }

  public execute(methodPtr: i32, argPtr: i32): i32 {
    let methodArg = new AString();
    methodArg.load(methodPtr);
    let method = methodArg.get();

    if (this.blockAspect == null && this.transactionAspect == null) {
      throw new Error('invalid aspect code');
    }

    if (this.transactionAspect) {
      let arg: string;
      let out: bool;

      switch (method) {
        case 'onContractBinding':
          arg = this.loadInputString(argPtr);
          out = this.transactionAspect.onContractBinding(new StateCtx(), arg);
          return this.storeOutputBool(out);
        case 'isOwner':
          arg = this.loadInputString(argPtr);
          if (this.transactionAspect != null) {
            out = this.transactionAspect.isOwner(new StateCtx(), arg);
            return this.storeOutputBool(out);
          }

          out =  this.blockAspect.isOwner(new StateCtx(), arg);
          return this.storeOutputBool(out);
      }
    }

    let arg = this.loadAspectInput(argPtr);
    let out: AspectOutput;
    if (this.transactionAspect) {
      switch (method) {
        case 'onTxReceive':
          const onTxReceiveCtx = new OnTxReceiveCtx(arg.blockHeight, arg.tx);
          out = this.transactionAspect.onTxReceive(onTxReceiveCtx);
          break;
        case 'onTxVerify':
          const onTxVerifyCtx = new OnTxVerifyCtx(arg.blockHeight, arg.tx);
          out = this.transactionAspect.onTxVerify(onTxVerifyCtx);
          break;
        case 'onAccountVerify':
          const onAccountVerifyCtx = new OnAccountVerifyCtx(arg.blockHeight, arg.tx);
          out = this.transactionAspect.onAccountVerify(onAccountVerifyCtx);
          break;
        case 'onGasPayment':
          const ctx = new OnGasPaymentCtx(arg.blockHeight, arg.tx);
          out = this.transactionAspect.onGasPayment(ctx);
          break;
        case 'preTxExecute':
          const ctx = new PreTxExecuteCtx(arg.blockHeight, arg.tx);
          out = this.transactionAspect.preTxExecute(ctx);
          break;
        case 'preContractCall':
          const ctx = new PreContractCallCtx(arg.blockHeight, arg.tx);
          out = this.transactionAspect.preContractCall(ctx);
          break;
        case 'postContractCall':
          const ctx = new PostContractCallCtx(arg.blockHeight, arg.tx);
          out = this.transactionAspect.postContractCall(ctx);
          break;
        case 'postTxExecute':
          const ctx = new PostTxExecuteCtx(arg.blockHeight, arg.tx);
          out = this.transactionAspect.postTxExecute(ctx);
          break;
        case 'onTxCommit':
          const ctx = new OnTxCommitCtx(arg.blockHeight, arg.tx);
          out = this.transactionAspect.onTxCommit(ctx);
          break;
        default:
          throw new Error("method " + method + " not found or not implemented");
      }
    } else {
      switch (method) {
        case 'onBlockInitialize':
          const ctx = new OnBlockInitializeCtx(arg.blockHeight, arg.tx);
          out = this.blockAspect.onBlockInitialize(ctx);
          break;
        case 'onBlockFinalize':
          const ctx = new OnBlockFinalizeCtx(arg.blockHeight, arg.tx);
          out = this.blockAspect.onBlockFinalize(ctx);

          break;
        default:
          throw new Error("method " + method + " not found or not implemented");
      }
    }

    return this.storeAspectOutput(out);
  }
}
