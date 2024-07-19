// The entry file of your WebAssembly module.

import {
  allocate,
  BigInt,
  entryPoint,
  execute,
  hexToUint8Array,
  IAspectBase,
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
class InitFailAspect implements IAspectBase {
  init(input: InitInput): void {
    sys.revert('init fail');
  }

  isOwner(_: Uint8Array): bool {
    return false;
  }
}

// 2.register aspect Instance
const aspect = new InitFailAspect();
entryPoint.setAspect(aspect);

// 3.must export it
export { execute, allocate };
