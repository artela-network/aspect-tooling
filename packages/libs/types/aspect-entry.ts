import { AString } from './';

import { IAspectBlock, IAspectOperation, IAspectTransaction, OperationCtx } from '../types';
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
import { PointCutType } from './aspect-interface';
import {
  DefAspectResponse,
  ErrAspectResponse,
  LoadEthTransaction,
  LoadEthTxAspect,
  LoadInputString,
  MessageUrlType,
  NewDataResponse,
  StoreAspectResponse,
  StoreOutputBool,
} from './message-helper';
import { Any, AspectResponse, BoolData, BytesData, EthInnerTransaction, RunResult } from '../proto';
import { Protobuf } from 'as-proto/assembly';

export class Entry {
  private readonly blockAspect: IAspectBlock | null;
  private readonly transactionAspect: IAspectTransaction | null;
  private readonly operationAspect: IAspectOperation | null;

  constructor(
    blockAspect: IAspectBlock | null,
    transactionAspect: IAspectTransaction | null,
    operationAspect: IAspectOperation | null,
  ) {
    this.blockAspect = blockAspect;
    this.transactionAspect = transactionAspect;
    this.operationAspect = operationAspect;
  }

  public isBlockLevel(): i32 {
    return StoreOutputBool(this.blockAspect != null);
  }

  public isTransactionLevel(): i32 {
    return StoreOutputBool(this.transactionAspect != null);
  }

  public execute(methodPtr: i32, argPtr: i32): i32 {
    const methodArg = new AString();
    methodArg.load(methodPtr);
    const method = methodArg.get();

    if (method == PointCutType.ON_CONTRACT_BINDING_METHOD && this.transactionAspect) {
      const arg = LoadInputString(argPtr);
      const out = this.transactionAspect!.onContractBinding(arg);
      return StoreOutputBool(out);
    }
    if (method == PointCutType.IS_OWNER_METHOD) {
      const arg = LoadInputString(argPtr);
      if (this.transactionAspect) {
        const out = this.transactionAspect!.isOwner(arg);
        return StoreOutputBool(out);
      }
      if (this.blockAspect != null) {
        const out = this.blockAspect!.isOwner(arg);
        return StoreOutputBool(out);
      }
    }

    let out: AspectResponse;
    if (method == PointCutType.ON_TX_RECEIVE_METHOD) {
      const ctx = new FilterTxCtx();
      const isFilter = this.transactionAspect!.filterTx(ctx);
      const boolData = new BoolData(isFilter);
      out = NewDataResponse(true, 'success', MessageUrlType.BoolData, boolData, BoolData.encode);
    } else if (method == PointCutType.PRE_TX_EXECUTE_METHOD) {
      const ctx = new PreTxExecuteCtx();
      this.transactionAspect!.preTxExecute(ctx);
      out = DefAspectResponse();
    } else if (method == PointCutType.PRE_CONTRACT_CALL_METHOD) {
      const arg = LoadEthTxAspect(argPtr);
      if (arg.currInnerTx == null) {
        out = ErrAspectResponse('currInnerTx is null');
      } else {
        const ethInnerTransaction = new EthInnerTransaction(
          arg.currInnerTx!.from,
          arg.currInnerTx!.to,
          arg.currInnerTx!.data,
          arg.currInnerTx!.value,
          arg.currInnerTx!.gas,
        );
        const ctx = new PreContractCallCtx(ethInnerTransaction);
        this.transactionAspect!.preContractCall(ctx);
        out = DefAspectResponse();
      }
    } else if (method == PointCutType.POST_CONTRACT_CALL_METHOD) {
      const arg = LoadEthTxAspect(argPtr);
      if (arg.currInnerTx == null) {
        out = ErrAspectResponse('currInnerTx is null');
      } else {
        const ctx = new PostContractCallCtx(arg.currInnerTx);
        this.transactionAspect!.postContractCall(ctx);
        out = DefAspectResponse();
      }
    } else if (method == PointCutType.POST_TX_EXECUTE_METHOD) {
      const ctx = new PostTxExecuteCtx();
      this.transactionAspect!.postTxExecute(ctx);
      out = DefAspectResponse();
    } else if (method == PointCutType.ON_TX_COMMIT_METHOD) {
      const arg = LoadEthTxAspect(argPtr);
      if (arg.tx == null) {
        out = ErrAspectResponse('tx is null');
      } else {
        const ctx = new PostTxCommitCtx(arg.tx);
        this.transactionAspect!.postTxCommit(ctx);
        out = DefAspectResponse();
      }
    } else if (method == PointCutType.OPERATION_METHOD) {
      const arg = LoadEthTransaction(argPtr);
      const ctx = new OperationCtx();
      const ret = this.operationAspect!.operation(ctx, arg.input);
      const bytesData = new BytesData(ret);
      const encodeData = Protobuf.encode(bytesData, BytesData.encode);
      const any = new Any(MessageUrlType.BytesData, encodeData);
      const runResult = new RunResult(true, 'success');
      out = new AspectResponse(runResult, MessageUrlType.BytesData, any);
    } else if (method == PointCutType.ON_BLOCK_INITIALIZE_METHOD) {
      // block level aspect
      const ctx = new OnBlockInitializeCtx();
      this.blockAspect!.onBlockInitialize(ctx);
      out = DefAspectResponse();
    } else if (method == PointCutType.ON_BLOCK_FINALIZE_METHOD) {
      const ctx = new OnBlockFinalizeCtx();
      this.blockAspect!.onBlockFinalize(ctx);
      out = DefAspectResponse();
    } else {
      out = ErrAspectResponse('method ' + method + ' not found or not implemented');
    }

    return StoreAspectResponse(out);
  }
}
