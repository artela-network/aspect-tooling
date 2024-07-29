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
} from '@artela/aspect-libs';

class HostApiAspect implements
  IAspectOperation,
  IPreContractCallJP,
  IPostContractCallJP,
  IPreTxExecuteJP,
  IPostTxExecuteJP,
  ITransactionVerifier {
  init(input: InitInput): void { }

  isOwner(sender: Uint8Array): bool {
    this.checkPoperty();

    const value = sys.aspect.property.get<Uint8Array>("owner");
    return uint8ArrayToHex(value) == uint8ArrayToHex(sender);
  }

  verifyTx(input: TxVerifyInput): Uint8Array {
    this.checkPoperty();
    return sys.aspect.mutableState.get<Uint8Array>('owner').unwrap();
  }

  operation(input: OperationInput): Uint8Array {
    this.checkPoperty();
    return input.callData;
  }

  preContractCall(_: PreContractCallInput): void {
    this.checkPoperty();
  }

  postContractCall(_: PostContractCallInput): void {
    this.checkPoperty();
  }

  preTxExecute(_: PreTxExecuteInput): void {
    this.checkPoperty();
  }

  postTxExecute(_: PostTxExecuteInput): void {
    this.checkPoperty();
  }

  assert(expect: string, actual: Uint8Array): void {
    const strAct = uint8ArrayToHex(actual);
    if (expect != strAct) {
      let msg = "aspect assert failed, expect " + expect + ", got " + strAct;
      sys.revert(msg);
      return;
    }
  }

  checkPoperty(): void {
    const prop1 = sys.aspect.property.get<Uint8Array>("prop-key1");
    this.assert("1234567890abcdef", prop1);
    const prop2 = sys.aspect.property.get<Uint8Array>("prop-key2");
    this.assert("abcdefabcdef", prop2);
  }
}
// 2.register aspect Instance
const aspect = new HostApiAspect();
entryPoint.setOperationAspect(aspect);
entryPoint.setAspect(aspect);

// 3.must export it
export { execute, allocate };
