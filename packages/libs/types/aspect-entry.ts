import { Protobuf } from 'as-proto/assembly';
import { IAspectOperation, IPostContractCallJP, IPostTxExecuteJP } from '.';
import { AString, AUint8Array, MessageUtil } from '../common';
import {
  InitInput,
  OperationInput,
  PostContractCallInput,
  PostTxExecuteInput,
  PreContractCallInput,
  PreTxExecuteInput,
  TxVerifyInput,
} from '../proto';
import {
  IAspectBase,
  IPreContractCallJP,
  IPreTxExecuteJP,
  ITransactionVerifier,
  PointCutType,
} from './aspect-interface';

const messageUtil = MessageUtil.instance();

export class EntryPoint {
  private aspectBase: IAspectBase | null = null;
  private aspectOperation: IAspectOperation | null = null;

  constructor() { }

  public setAspect(aspectBase: IAspectBase): void {
    this.aspectBase = aspectBase;
  }

  public setOperationAspect(aspect: IAspectOperation): void {
    this.aspectOperation = aspect;
  }

  public getAspect(): IAspectBase | null {
    return this.aspectBase;
  }

  public execute(methodPtr: i32, argPtr: i32): i32 {
    const methodArg = new AString();
    methodArg.load(methodPtr);
    const method = methodArg.get();

    if (method == PointCutType.IS_OWNER_METHOD) {
      return this.isOwner(argPtr);
    }

    const input = new AUint8Array();
    input.load(argPtr);

    if (method == PointCutType.VERIFY_TX) {
      const output = this.verifyTx(input.get());
      const outputPtr = new AUint8Array(output);
      return outputPtr.store();
    }
    if (method == PointCutType.PRE_TX_EXECUTE_METHOD) {
      this.preTxExecute(input.get());
      return 0;
    }
    if (method == PointCutType.PRE_CONTRACT_CALL_METHOD) {
      this.preContractCall(input.get());
      return 0;
    }
    if (method == PointCutType.POST_CONTRACT_CALL_METHOD) {
      this.postContractCall(input.get());
      return 0;
    }
    if (method == PointCutType.POST_TX_EXECUTE_METHOD) {
      this.postTxExecute(input.get());
      return 0;
    }
    if (method == PointCutType.OPERATION_METHOD) {
      const output = this.operation(input.get());
      const outputPtr = new AUint8Array(output);
      return outputPtr.store();
    }
    if (method == PointCutType.INIT_METHOD) {
      this.init(input.get());
      return 0;
    }

    throw new Error('method ' + method + ' not found or not implemented');
  }

  private isOwner(argPtr: i32): i32 {
    if (this.aspectBase != null) {
      const arg = messageUtil.LoadInputBytes(argPtr);
      const out = this.aspectBase!.isOwner(arg);
      return messageUtil.StoreOutputBool(out);
    }
    return 0;
  }

  private verifyTx(rawInput: Uint8Array): Uint8Array {
    if (this.aspectBase == null) {
      throw new Error('aspect is not initialized');
    }

    const input = Protobuf.decode<TxVerifyInput>(rawInput, TxVerifyInput.decode);
    const transactionVerifier = this.aspectBase as ITransactionVerifier;
    return transactionVerifier.verifyTx(input);
  }

  private preTxExecute(rawInput: Uint8Array): void {
    if (this.aspectBase == null) {
      throw new Error('aspect is not initialized');
    }

    const input = Protobuf.decode<PreTxExecuteInput>(rawInput, PreTxExecuteInput.decode);
    const preTxExecute = this.aspectBase as IPreTxExecuteJP;
    preTxExecute.preTxExecute(input);
  }

  private preContractCall(rawInput: Uint8Array): void {
    if (this.aspectBase == null) {
      throw new Error('aspect is not initialized');
    }

    const input = Protobuf.decode<PreContractCallInput>(rawInput, PreContractCallInput.decode);
    const preContractCall = this.aspectBase as IPreContractCallJP;
    preContractCall.preContractCall(input);
  }

  private postContractCall(rawInput: Uint8Array): void {
    if (this.aspectBase == null) {
      throw new Error('aspect is not initialized');
    }

    const input = Protobuf.decode<PostContractCallInput>(rawInput, PostContractCallInput.decode);
    const postContractCall = this.aspectBase as IPostContractCallJP;
    postContractCall.postContractCall(input);
  }

  private postTxExecute(rawInput: Uint8Array): void {
    if (this.aspectBase == null) {
      throw new Error('aspect is not initialized');
    }

    const input = Protobuf.decode<PostTxExecuteInput>(rawInput, PostTxExecuteInput.decode);
    const postTxExecute = this.aspectBase as IPostTxExecuteJP;
    postTxExecute.postTxExecute(input);
  }

  private operation(rawInput: Uint8Array): Uint8Array {
    if (this.aspectOperation == null) {
      throw new Error('aspect is not initialized');
    }

    const input = Protobuf.decode<OperationInput>(rawInput, OperationInput.decode);
    const operation = this.aspectOperation as IAspectOperation;
    return operation.operation(input);
  }

  private init(rawInput: Uint8Array): void {
    const input = Protobuf.decode<InitInput>(rawInput, InitInput.decode);

    if (this.aspectBase != null) {
      this.aspectBase!.init(input);
      return;
    }

    if (this.aspectOperation != null) {
      this.aspectOperation!.init(input);
      return;
    }

    throw new Error('aspect is not initialized');
  }
}
