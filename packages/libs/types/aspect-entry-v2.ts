import { Protobuf } from 'as-proto/assembly';
import {
  FilterTxCtx,
  OnBlockFinalizeCtx,
  OnBlockInitializeCtx,
  PostContractCallCtx,
  PostTxCommitCtx,
  PostTxExecuteCtx,
  PreContractCallCtx,
  PreTxExecuteCtx,
} from '.';
import { AString, MessageUtil } from '../common';
import { Any, AspectResponse, BoolData, BytesData, RunResult } from '../proto';
import { IAspectBlock, IAspectOperation, IAspectTransaction, OperationCtx } from '../types';
import { ITransactionVerifier, PointCutType } from './aspect-interface';
import { VerifyTxCtx } from './paramter/verify-tx-ctx';

const messageUtil = MessageUtil.instance();

export class Entry {
  private readonly blockAspect: IAspectBlock | null;
  private readonly transactionAspect: IAspectTransaction | null;
  private readonly operationAspect: IAspectOperation | null;
  private readonly transactionVerifier: ITransactionVerifier | null;

  constructor(
    blockAspect: IAspectBlock | null,
    transactionAspect: IAspectTransaction | null,
    operationAspect: IAspectOperation | null,
    transactionVerifier: ITransactionVerifier | null,
  ) {
    this.blockAspect = blockAspect;
    this.transactionAspect = transactionAspect;
    this.operationAspect = operationAspect;
    this.transactionVerifier = transactionVerifier;
  }

  public isBlockLevel(): i32 {
    return messageUtil.StoreOutputBool(this.blockAspect != null);
  }

  public isTransactionLevel(): i32 {
    return messageUtil.StoreOutputBool(this.transactionAspect != null);
  }

  public isTransactionVerifier(): i32 {
    return messageUtil.StoreOutputBool(this.transactionVerifier != null);
  }

  public execute(methodPtr: i32, argPtr: i32): i32 {
    const methodArg = new AString();
    methodArg.load(methodPtr);
    const method = methodArg.get();

    if (method == PointCutType.IS_OWNER_METHOD) {
      const arg = messageUtil.LoadInputString(argPtr);
      if (this.transactionAspect) {
        const out = this.transactionAspect!.isOwner(arg);
        return messageUtil.StoreOutputBool(out);
      }
      if (this.blockAspect != null) {
        const out = this.blockAspect!.isOwner(arg);
        return messageUtil.StoreOutputBool(out);
      }
    }

    let out: AspectResponse;
    if (method == PointCutType.ON_TX_RECEIVE_METHOD) {
      const arg = messageUtil.LoadEthTxAspect(argPtr);
      if (arg.tx == null) {
        out = messageUtil.ErrAspectResponse('tx is null');
      } else {
        const ctx = new FilterTxCtx(arg.tx!);
        const isFilter = this.transactionAspect!.filterTx(ctx);
        const boolData = new BoolData(isFilter);
        out = messageUtil.NewDataResponse(
          true,
          'success',
          messageUtil.BoolData,
          boolData,
          BoolData.encode,
        );
      }
    } else if (method == PointCutType.ON_TX_VERIFY_METHOD) {
      const arg = messageUtil.LoadEthTxAspect(argPtr);
      const ctx = new VerifyTxCtx();
      let validationBytes = new Uint8Array(0);
      if (arg.callData) {
        validationBytes = arg.callData!.value;
      }
      const validationData = Protobuf.decode<BytesData>(validationBytes, BytesData.decode);
      const sender = this.transactionVerifier!.verifyTx(ctx, validationData.data);
      const bytesData = new BytesData(sender);
      out = messageUtil.NewDataResponse(
        true,
        'success',
        messageUtil.BytesData,
        bytesData,
        BytesData.encode,
      );
    } else if (method == PointCutType.PRE_TX_EXECUTE_METHOD) {
      const ctx = new PreTxExecuteCtx();
      this.transactionAspect!.preTxExecute(ctx);
      out = messageUtil.DefAspectResponse();
    } else if (method == PointCutType.PRE_CONTRACT_CALL_METHOD) {
      const arg = messageUtil.LoadEthTxAspect(argPtr);
      if (arg.currInnerTx == null) {
        out = messageUtil.ErrAspectResponse('currInnerTx is null');
      } else {
        const ctx = new PreContractCallCtx(arg.currInnerTx!);
        this.transactionAspect!.preContractCall(ctx);
        out = messageUtil.DefAspectResponse();
      }
    } else if (method == PointCutType.POST_CONTRACT_CALL_METHOD) {
      const arg = messageUtil.LoadEthTxAspect(argPtr);
      if (arg.currInnerTx == null) {
        out = messageUtil.ErrAspectResponse('currInnerTx is null');
      } else {
        const ctx = new PostContractCallCtx(arg.currInnerTx!);
        this.transactionAspect!.postContractCall(ctx);
        out = messageUtil.DefAspectResponse();
      }
    } else if (method == PointCutType.POST_TX_EXECUTE_METHOD) {
      const ctx = new PostTxExecuteCtx();
      this.transactionAspect!.postTxExecute(ctx);
      out = messageUtil.DefAspectResponse();
    } else if (method == PointCutType.ON_TX_COMMIT_METHOD) {
      const arg = messageUtil.LoadEthTxAspect(argPtr);
      if (arg.tx == null) {
        out = messageUtil.ErrAspectResponse('tx is null');
      } else {
        const ctx = new PostTxCommitCtx();
        this.transactionAspect!.postTxCommit(ctx);
        out = messageUtil.DefAspectResponse();
      }
    } else if (method == PointCutType.OPERATION_METHOD) {
      const arg = messageUtil.LoadEthTransaction(argPtr);
      const ctx = new OperationCtx();
      const ret = this.operationAspect!.operation(ctx, arg.input);
      const bytesData = new BytesData(ret);
      const encodeData = Protobuf.encode(bytesData, BytesData.encode);
      const any = new Any(messageUtil.BytesData, encodeData);
      const runResult = new RunResult(true, 'success');
      out = new AspectResponse(runResult, messageUtil.BytesData, any);
    } else if (method == PointCutType.ON_BLOCK_INITIALIZE_METHOD) {
      // block level aspect
      const ctx = new OnBlockInitializeCtx();
      this.blockAspect!.onBlockInitialize(ctx);
      out = messageUtil.DefAspectResponse();
    } else if (method == PointCutType.ON_BLOCK_FINALIZE_METHOD) {
      const ctx = new OnBlockFinalizeCtx();
      this.blockAspect!.onBlockFinalize(ctx);
      out = messageUtil.DefAspectResponse();
    } else {
      out = messageUtil.ErrAspectResponse('method ' + method + ' not found or not implemented');
    }

    return messageUtil.StoreAspectResponse(out);
  }
}


