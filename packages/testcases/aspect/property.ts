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
class PropertyAspect
  implements
    IAspectOperation,
    IPreContractCallJP,
    IPostContractCallJP,
    IPreTxExecuteJP,
    IPostTxExecuteJP
{
  init(input: InitInput): void {
    const ownerThroughProperty = sys.aspect.property.get<Uint8Array>('owner');
    sys.aspect.mutableState.get<Uint8Array>('owner').set(ownerThroughProperty);
  }

  isOwner(addr: Uint8Array): bool {
    return uint8ArrayToHex(sys.aspect.property.get<Uint8Array>('owner')) == uint8ArrayToHex(addr);
  }

  operation(_: OperationInput): Uint8Array {
    const ownerThroughProperty = sys.aspect.property.get<Uint8Array>('owner');
    return ownerThroughProperty;
  }

  preTxExecute(input: PreTxExecuteInput): void {
    sys.require(this.isOwner(input.tx!.from), 'sender is not owner');
  }

  preContractCall(input: PreContractCallInput): void {
    sys.require(this.isOwner(input.call!.from), 'sender is not owner');
  }

  postContractCall(input: PostContractCallInput): void {
    sys.require(this.isOwner(input.call!.from), 'sender is not owner');
  }

  postTxExecute(input: PostTxExecuteInput): void {
    sys.require(this.isOwner(input.tx!.from), 'sender is not owner');
  }
}

// 2.register aspect Instance
const aspect = new PropertyAspect();
entryPoint.setOperationAspect(aspect);
entryPoint.setAspect(aspect);

// 3.must export it
export { execute, allocate };
