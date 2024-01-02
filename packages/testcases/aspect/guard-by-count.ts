// If the call count large than 1, mark the transaction as failed.
// The entry file of your WebAssembly module.

import {
  allocate,
  entryPoint,
  execute,
  IPostContractCallJP,
  IPreContractCallJP,
  PostContractCallInput,
  PreContractCallInput,
  sys,
  uint8ArrayToHex,
  uint8ArrayToString,
} from '@artela/aspect-libs';

class GuardByCountAspect implements IPostContractCallJP, IPreContractCallJP {
  isOwner(sender: Uint8Array): bool {
    const value = sys.aspect.property.get<Uint8Array>('owner');
    return uint8ArrayToHex(value).includes(uint8ArrayToHex(sender));
  }

  CONTEXT_KEY: String = '{InnerTxToAddr}_CALL_COUNT';

  preContractCall(input: PreContractCallInput): void {
    const contextKey = this.CONTEXT_KEY.replace('{InnerTxToAddr}', uint8ArrayToHex(input.call!.to));
    const callCount = sys.aspect.transientStorage.get<u64>(contextKey);
    const count = callCount.unwrap() + 1;
    callCount.set<u64>(count);
  }

  postContractCall(input: PostContractCallInput): void {
    const contextKey = this.CONTEXT_KEY.replace('{InnerTxToAddr}', uint8ArrayToHex(input.call!.to));
    const callCount = sys.aspect.transientStorage.get<u64>(contextKey).unwrap();
    // If the call count large than 1, mark the transaction as failed.
    if (callCount > 1) {
      sys.revert('multiple inner tx calls');
    }
  }
}

// 2.register aspect Instance
const aspect = new GuardByCountAspect();
entryPoint.setAspect(aspect);

// 3.must export it
export { execute, allocate };
