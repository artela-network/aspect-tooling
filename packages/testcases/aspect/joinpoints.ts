// The entry file of your WebAssembly module.

import {
  allocate,
  entryPoint,
  execute,
  IAspectOperation,
  InitInput,
  IPostContractCallJP,
  IPostTxExecuteJP,
  IPreContractCallJP,
  IPreTxExecuteJP,
  ITransactionVerifier,
  OperationInput,
  PostContractCallInput,
  PostTxExecuteInput,
  PreContractCallInput,
  PreTxExecuteInput,
  TxVerifyInput,
  sys,
  uint8ArrayToHex,
  hexToUint8Array,
  Uint256,
} from '@artela/aspect-libs';

class Joinpoints implements
  IAspectOperation,
  IPreContractCallJP,
  IPostContractCallJP,
  IPreTxExecuteJP,
  IPostTxExecuteJP,
  ITransactionVerifier {
  init(input: InitInput): void {
    this.check(input.block!.number, input.tx!.from, input.tx!.to, input.tx!.hash, "init");
  }

  isOwner(sender: Uint8Array): bool {
    const value = sys.aspect.property.get<Uint8Array>("owner");
    return uint8ArrayToHex(value) == uint8ArrayToHex(sender);
  }

  verifyTx(input: TxVerifyInput): Uint8Array {
    const notEmptyAddress = hexToUint8Array("0000000000000000000000000000000000000001");
    this.check(input.block!.number, notEmptyAddress, input.tx!.to, input.tx!.hash, "verifyTx");

    return sys.aspect.mutableState.get<Uint8Array>('owner').unwrap();
  }

  operation(input: OperationInput): Uint8Array {
    this.check(input.block!.number, input.tx!.from, input.tx!.to, input.tx!.hash, "operation");
    return input.callData;
  }

  preContractCall(input: PreContractCallInput): void {
    const notEmptyHash = Uint256.fromInt64(1).toUint8Array();
    this.check(input.block!.number, input.call!.from, input.call!.to, notEmptyHash, "PreContractCallInput");
    this.assert(input.call!.gas > 0, "PostContractCallInput, gas large than zero");
  }

  postContractCall(input: PostContractCallInput): void {
    const notEmptyHash = Uint256.fromInt64(1).toUint8Array();
    this.check(input.block!.number, input.call!.from, input.call!.to, notEmptyHash, "PostContractCallInput");
    this.assert(input.call!.gas > 0, "PostContractCallInput, gas large than zero");
  }

  preTxExecute(input: PreTxExecuteInput): void {
    this.check(input.block!.number, input.tx!.from, input.tx!.to, input.tx!.hash, "PreTxExecuteInput");
  }

  postTxExecute(input: PostTxExecuteInput): void {
    this.check(input.block!.number, input.tx!.from, input.tx!.to, input.tx!.hash, "PostTxExecuteInput");
  }

  check(blockNumber: u64, txFrom: Uint8Array, txTo: Uint8Array, txHash: Uint8Array, name: string): void {
    const emptyHash = "0000000000000000000000000000000000000000000000000000000000000000";
    const emptyAddress = "0000000000000000000000000000000000000000";

    this.assert(blockNumber > 0, name + ", block.number large than zero");
    this.assert(uint8ArrayToHex(txFrom) != emptyAddress, name + ", from not empty");
    this.assert(uint8ArrayToHex(txTo) != emptyAddress, name + ", to not empty");
    this.assert(uint8ArrayToHex(txHash) != emptyHash, name + ", to not empty");
  }

  assert(equal: bool, name: string = ""): void {
    if (!equal) {
      let msg = "assert failed: " + name;
      sys.revert(msg);
      return;
    }
  }
}
// 2.register aspect Instance
const aspect = new Joinpoints();
entryPoint.setOperationAspect(aspect);
entryPoint.setAspect(aspect);

// 3.must export it
export { execute, allocate };
