import {
  FilterTxCtx,
  OnBlockFinalizeCtx,
  OnBlockInitializeCtx,
  OperationCtx,
  PostContractCallCtx,
  PostTxCommitCtx,
  PostTxExecuteCtx,
  PreContractCallCtx,
  PreTxExecuteCtx,
} from '.';

export interface AspectBase {
  isOwner(sender: string): bool;
}

export interface IAspectBlock extends AspectBase {
  onBlockInitialize(ctx: OnBlockInitializeCtx): void;

  onBlockFinalize(ctx: OnBlockFinalizeCtx): void;
}

export interface IAspectTransaction extends AspectBase {
  onContractBinding(contractAddr: string): bool;

  filterTx(ctx: FilterTxCtx): bool;

  preTxExecute(ctx: PreTxExecuteCtx): void;

  preContractCall(ctx: PreContractCallCtx): void;

  postContractCall(ctx: PostContractCallCtx): void;

  postTxExecute(ctx: PostTxExecuteCtx): void;

  postTxCommit(ctx: PostTxCommitCtx): void;
}

export interface IAspectOperation {
  operation(ctx: OperationCtx, data: Uint8Array): Uint8Array;
}

export class PointCutType {
  static readonly ON_TX_RECEIVE_METHOD: string = 'onTxReceive';
  static readonly ON_BLOCK_INITIALIZE_METHOD: string = 'onBlockInitialize';
  static readonly ON_TX_VERIFY_METHOD: string = 'onTxVerify';
  static readonly ON_ACCOUNT_VERIFY_METHOD: string = 'onAccountVerify';
  static readonly ON_GAS_PAYMENT_METHOD: string = 'onGasPayment';
  static readonly PRE_TX_EXECUTE_METHOD: string = 'preTxExecute';
  static readonly PRE_CONTRACT_CALL_METHOD: string = 'preContractCall';
  static readonly POST_CONTRACT_CALL_METHOD: string = 'postContractCall';
  static readonly POST_TX_EXECUTE_METHOD: string = 'postTxExecute';
  static readonly ON_TX_COMMIT_METHOD: string = 'onTxCommit';
  static readonly ON_BLOCK_FINALIZE_METHOD: string = 'onBlockFinalize';

  static readonly OPERATION_METHOD: string = 'operation';
  static readonly IS_OWNER_METHOD: string = 'isOwner';
  static readonly ON_CONTRACT_BINDING_METHOD: string = 'onContractBinding';
}
