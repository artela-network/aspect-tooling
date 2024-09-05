// The entry file of your WebAssembly module.

import {
  allocate,
  BigInt,
  entryPoint,
  execute,
  hexToUint8Array,
  IAspectOperation,
  InitInput,
  IPostContractCallJP,
  IPostTxExecuteJP,
  IPreContractCallJP,
  IPreTxExecuteJP,
  OperationInput,
  PostContractCallInput,
  PostTxExecuteInput,
  PreContractCallInput,
  PreTxExecuteInput,
  stringToUint8Array,
  sys,
  uint8ArrayToHex,
} from '@artela/aspect-libs';

// Dummy Aspect that does not do anything, just used to test the aspect basic features.
class StateAspect
  implements
    IAspectOperation,
    IPreContractCallJP,
    IPostContractCallJP,
    IPreTxExecuteJP,
    IPostTxExecuteJP
{
  init(input: InitInput): void {
    sys.aspect.mutableState.get<Uint8Array>('owner').set(input.tx!.from);
  }

  isOwner(addr: Uint8Array): bool {
    return uint8ArrayToHex(sys.aspect.mutableState.get<Uint8Array>('owner').unwrap()) == uint8ArrayToHex(addr);
  }

  operation(_: OperationInput): Uint8Array {
    return stringToUint8Array(sys.aspect.mutableState.get<string>('context').unwrap());
  }

  preTxExecute(_: PreTxExecuteInput): void {
    sys.require(this.getData() == '', 'preTxExecute pre-check failed');
    this.appendData('1');
    sys.require(this.getData() == '1', 'preTxExecute post-check failed');
  }

  preContractCall(_: PreContractCallInput): void {
    sys.require(this.getData() == '1', 'preContractCall pre-check failed');
    this.appendData('2');
    sys.require(this.getData() == '12', 'preContractCall post-check failed');
  }

  postContractCall(_: PostContractCallInput): void {
    sys.require(this.getData() == '12', 'postContractCall pre-check failed');
    this.appendData('3');
    sys.require(this.getData() == '123', 'postContractCall post-check failed');
  }

  postTxExecute(_: PostTxExecuteInput): void {
    sys.require(this.getData() == '123', 'postTxExecute pre-check failed');
    this.appendData('4');
    sys.require(this.getData() == '1234', 'postTxExecute post-check failed');
  }

  appendData(data: string): void {
    const storage = sys.aspect.mutableState.get<string>('context');
    storage.set(storage.unwrap() + data);
  }

  getData(): string {
    const storage = sys.aspect.mutableState.get<string>('context');
    return storage.unwrap();
  }
}

// 2.register aspect Instance
const aspect = new StateAspect();
entryPoint.setOperationAspect(aspect);
entryPoint.setAspect(aspect);

// 3.must export it
export { execute, allocate };
