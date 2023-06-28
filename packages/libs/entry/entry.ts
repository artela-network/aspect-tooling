import { ABool, AString, AUint8Array } from '../message';
import { AspectInput, AspectOutput } from '../proto';

import { IAspectBlock, IAspectTransaction } from '../types';
import { Protobuf } from 'as-proto/assembly';

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
          out = this.transactionAspect.onContractBinding(arg);
          return this.storeOutputBool(out);
        case 'isOwner':
          arg = this.loadInputString(argPtr);
          if (this.transactionAspect != null) {
            out = this.transactionAspect.isOwner(arg);
            return this.storeOutputBool(out);
          }

          out = this.blockAspect.isOwner(arg);
          return this.storeOutputBool(out);
      }
    }

    let arg = this.loadAspectInput(argPtr);
    let out: AspectOutput;
    if (this.transactionAspect) {
      switch (method) {
        case 'onTxReceive':
          out = this.transactionAspect.onTxReceive(arg);
          break;
        case 'onTxVerify':
          out = this.transactionAspect.onTxVerify(arg);
          break;
        case 'onAccountVerify':
          out = this.transactionAspect.onAccountVerify(arg);
          break;
        case 'onGasPayment':
          out = this.transactionAspect.onGasPayment(arg);
          break;
        case 'preTxExecute':
          out = this.transactionAspect.preTxExecute(arg);
          break;
        case 'preContractCall':
          out = this.transactionAspect.preContractCall(arg);
          break;
        case 'postContractCall':
          out = this.transactionAspect.postContractCall(arg);
          break;
        case 'postTxExecute':
          out = this.transactionAspect.postTxExecute(arg);
          break;
        case 'onTxCommit':
          out = this.transactionAspect.onTxCommit(arg);
          break;
        default:
          throw new Error('method ' + method + ' not found');
      }
    } else {
      switch (method) {
        case 'onBlockInitialize':
          out = this.blockAspect.onBlockInitialize(arg);
          break;
        case 'onBlockFinalize':
          out = this.blockAspect.onBlockFinalize(arg);
          break;
        default:
          throw new Error('method ' + method + ' not found');
      }
    }

    return this.storeAspectOutput(out);
  }
}
