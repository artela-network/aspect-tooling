import { AspectInput, AspectOutput } from '../proto';

export interface IAspectBlock {
  isOwner(sender: string): bool;
  onBlockInitialize(arg: AspectInput): AspectOutput;
  onBlockFinalize(arg: AspectInput): AspectOutput;
}

export interface IAspectTransaction {
  isOwner(sender: string): bool;
  onContractBinding(contractAddr: string): bool;
  onTxReceive(arg: AspectInput): AspectOutput;
  onTxVerify(arg: AspectInput): AspectOutput;
  onAccountVerify(arg: AspectInput): AspectOutput;
  onGasPayment(arg: AspectInput): AspectOutput;
  preTxExecute(arg: AspectInput): AspectOutput;
  preContractCall(arg: AspectInput): AspectOutput;
  postContractCall(arg: AspectInput): AspectOutput;
  postTxExecute(arg: AspectInput): AspectOutput;
  onTxCommit(arg: AspectInput): AspectOutput;
}
