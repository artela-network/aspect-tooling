import {Protobuf} from 'as-proto/assembly';
import {
  IAspectOperation,
  IPostContractCallJP,
  IPostTxExecuteJP,
  OnBlockFinalizeCtx,
  OnBlockInitializeCtx,
  PostContractCallCtx,
  PostTxCommitCtx,
  PostTxExecuteCtx,
  PreContractCallCtx,
  PreTxExecuteCtx,
} from '.';
import {AString, MessageUtil} from '../common';
import {Any, AspectResponse, BytesData, RunResult} from '../proto';
import {IBlockJP, OperationCtx} from '../types';
import {
  IAspectBase,
  IPostTxCommitJP,
  IPreContractCallJP,
  IPreTxExecuteJP,
  ITransactionVerifier,
  PointCutType
} from './aspect-interface';
import {VerifyTxCtx} from './paramter/verify-tx-ctx';

const messageUtil = MessageUtil.instance();


export class EntryPoint {
  private aspectBase: IAspectBase | null = null;
  private methodMap = new Map<string, (argPtr: i32) => i32>()

  constructor() {
    this.methodMap.set(PointCutType.IS_OWNER_METHOD, this.isOwner)
    this.methodMap.set(PointCutType.ON_TX_VERIFY_METHOD, this.verifyTx)
    this.methodMap.set(PointCutType.PRE_TX_EXECUTE_METHOD, this.preTxExecute)
    this.methodMap.set(PointCutType.PRE_CONTRACT_CALL_METHOD, this.preContractCall)
    this.methodMap.set(PointCutType.POST_CONTRACT_CALL_METHOD, this.postContractCall)
    this.methodMap.set(PointCutType.POST_TX_EXECUTE_METHOD, this.postTxExecute)
    this.methodMap.set(PointCutType.ON_TX_COMMIT_METHOD, this.postTxCommit)
    this.methodMap.set(PointCutType.OPERATION_METHOD, this.operation)
    this.methodMap.set(PointCutType.ON_BLOCK_INITIALIZE_METHOD, this.onBlockInitialize)
    this.methodMap.set(PointCutType.ON_BLOCK_FINALIZE_METHOD, this.onBlockFinalize)
  }

  public setAspect(aspectBase: IAspectBase) {
    this.aspectBase = aspectBase
  }

  public getAspect(): IAspectBase | null {
    return this.aspectBase
  }

  private isOwner(argPtr: i32): i32 {
    if (this.aspectBase == null) {
      return 0;
    }
    const arg = messageUtil.LoadInputString(argPtr);
    const out = this.aspectBase.isOwner(arg);
    return messageUtil.StoreOutputBool(out);
  }

  private verifyTx(argPtr: i32): i32 {
    if (this.aspectBase == null) {
      return 0;
    }
    let out: AspectResponse = messageUtil.DefAspectResponse();
    const arg = messageUtil.LoadEthTxAspect(argPtr);
    const ctx = new VerifyTxCtx();
    if (!arg.callData) {
      return messageUtil.StoreAspectResponse(out);
    }
    const validationData = Protobuf.decode<BytesData>(arg.callData.value, BytesData.decode);
    if (this.aspectBase instanceof ITransactionVerifier) {
      const transactionVerifier = this.aspectBase as ITransactionVerifier;
      const sender = transactionVerifier.verifyTx(ctx, validationData.data);
      const bytesData = new BytesData(sender);
      out= messageUtil.NewDataResponse(
          true,
          'success',
          messageUtil.BytesData,
          bytesData,
          BytesData.encode,
      );
    }
    return messageUtil.StoreAspectResponse(out);
  }

  private preTxExecute(argPtr: i32): i32 {
    if (this.aspectBase == null || argPtr <= 0) {
      return 0;
    }
    const out: AspectResponse = messageUtil.DefAspectResponse();
    const ctx = new PreTxExecuteCtx();
    if (this.aspectBase instanceof IPreTxExecuteJP) {
      const transactionAspect = this.aspectBase as IPreTxExecuteJP;
      transactionAspect.preTxExecute(ctx);
    }
    return messageUtil.StoreAspectResponse(out);
  }

  private preContractCall(argPtr: i32): i32 {
    if (this.aspectBase == null || argPtr <= 0) {
      return 0;
    }
    let out: AspectResponse = messageUtil.DefAspectResponse();
    const arg = messageUtil.LoadEthTxAspect(argPtr);
    if (arg.currInnerTx == null) {
      out = messageUtil.ErrAspectResponse('currInnerTx is null');
    } else {
      const ctx = new PreContractCallCtx(arg.currInnerTx!);
      if (this.aspectBase instanceof IPreContractCallJP) {
        const transactionAspect = this.aspectBase as IPreContractCallJP
        transactionAspect.preContractCall(ctx);
        out = messageUtil.DefAspectResponse();
      }
    }
    return messageUtil.StoreAspectResponse(out);
  }

  private postContractCall(argPtr: i32): i32 {
    if (this.aspectBase == null || argPtr <= 0) {
      return 0;
    }
    let out: AspectResponse = messageUtil.DefAspectResponse();
    const arg = messageUtil.LoadEthTxAspect(argPtr);
    if (arg.currInnerTx == null) {
      out = messageUtil.ErrAspectResponse('currInnerTx is null');
    } else {
      const ctx = new PostContractCallCtx(arg.currInnerTx!);
      if (this.aspectBase instanceof IPostContractCallJP) {
        const transactionAspect = this.aspectBase as IPostContractCallJP
        transactionAspect!.postContractCall(ctx);
      }
    }
    return messageUtil.StoreAspectResponse(out);
  }

  private postTxExecute(argPtr: i32): i32 {
    if (this.aspectBase == null || argPtr <= 0) {
      return 0;
    }
    const out: AspectResponse = messageUtil.DefAspectResponse();
    const ctx = new PostTxExecuteCtx();
    if (this.aspectBase instanceof IPostTxExecuteJP) {
      const transactionAspect = this.aspectBase as IPostTxExecuteJP
      transactionAspect!.postTxExecute(ctx);
    }
    return messageUtil.StoreAspectResponse(out);
  }

  private postTxCommit(argPtr: i32): i32 {
    if (this.aspectBase == null || argPtr <= 0) {
      return 0;
    }
    let out: AspectResponse = messageUtil.DefAspectResponse();
    const arg = messageUtil.LoadEthTxAspect(argPtr);
    if (arg.tx == null) {
      out = messageUtil.ErrAspectResponse('tx is null');
    } else {
      const ctx = new PostTxCommitCtx();
      if (this.aspectBase instanceof IPostTxCommitJP) {
        const transactionAspect = this.aspectBase as IPostTxCommitJP
        transactionAspect!.postTxCommit(ctx);
      }
    }
    return messageUtil.StoreAspectResponse(out);
  }

  private operation(argPtr: i32): i32 {
    if (this.aspectBase == null || argPtr <= 0) {
      return 0;
    }
    let out: AspectResponse = messageUtil.DefAspectResponse();
    const arg = messageUtil.LoadEthTransaction(argPtr);
    const ctx = new OperationCtx();
    if (this.aspectBase instanceof IAspectOperation) {
      const operationAspect = this.aspectBase as IAspectOperation
      const ret = operationAspect!.operation(ctx, arg.input);
      const bytesData = new BytesData(ret);
      const encodeData = Protobuf.encode(bytesData, BytesData.encode);
      const any = new Any(messageUtil.BytesData, encodeData);
      const runResult = new RunResult(true, 'success');
      out = new AspectResponse(runResult, messageUtil.BytesData, any);
    }
    return messageUtil.StoreAspectResponse(out);
  }

  private onBlockInitialize(argPtr: i32): i32 {
    if (this.aspectBase == null || argPtr <= 0) {
      return 0;
    }
    const out: AspectResponse = messageUtil.DefAspectResponse();
    const ctx = new OnBlockInitializeCtx();
    if (this.aspectBase instanceof IBlockJP) {
      const blockAspect = this.aspectBase as IBlockJP
      blockAspect!.onBlockInitialize(ctx);
    }
    return messageUtil.StoreAspectResponse(out);
  }

  private onBlockFinalize(argPtr: i32): i32 {
    if (this.aspectBase == null || argPtr <= 0) {
      return 0;
    }
    const out: AspectResponse = messageUtil.DefAspectResponse();
    const ctx = new OnBlockFinalizeCtx();
    if (this.aspectBase instanceof IBlockJP) {
      const blockAspect = this.aspectBase as IBlockJP
      blockAspect!.onBlockFinalize(ctx);
    }
    return messageUtil.StoreAspectResponse(out);
  }
  public execute(methodPtr: i32, argPtr: i32): i32 {
    const methodArg = new AString();
    methodArg.load(methodPtr);
    const method = methodArg.get();

    // Error if method is not registered
    if (!this.methodMap.has(method)) {
      const response = messageUtil.ErrAspectResponse('method ' + method + ' not found or not implemented');
      return messageUtil.StoreAspectResponse(response);
    }
    // Call function associated to received method string
    return this.methodMap.get(method)(argPtr)
  }
}


