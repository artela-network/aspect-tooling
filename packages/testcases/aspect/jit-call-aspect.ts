// If the call count large than 1, mark the transaction as failed.
// The entry file of your WebAssembly module.

import {
  allocate,
  entryPoint,
  execute,
  IPostContractCallJP,
  IPreContractCallJP,
  JitCallBuilder,
  PostContractCallInput,
  PreContractCallInput,
  sys,
  uint8ArrayToHex,
} from '@artela/aspect-libs';

class JitCallAspect implements IPostContractCallJP, IPreContractCallJP {
  isOwner(sender: Uint8Array): bool {
    return true;
  }

  preContractCall(input: PreContractCallInput): void {
    const sender = sys.aspect.property.get<Uint8Array>('from');
    const to = sys.aspect.property.get<Uint8Array>('to');
    const callData = sys.aspect.property.get<Uint8Array>('data');
    sys.log('||| jit  preContractCall ' + uint8ArrayToHex(sender));
    sys.log('||| jit  preContractCall ' + uint8ArrayToHex(to));
    sys.log('||| jit  preContractCall ' + uint8ArrayToHex(callData));

    const request = JitCallBuilder.simple(sender, to, callData).build();

    // Submit the JIT call
    const response = sys.hostApi.evmCall.jitCall(request);

    sys.log('||| jit result ' + uint8ArrayToHex(response.ret));
    sys.log('||| jit errorMsg ' + response.errorMsg);
  }

  postContractCall(input: PostContractCallInput): void {
    const sender = sys.aspect.property.get<Uint8Array>('from');
    const to = sys.aspect.property.get<Uint8Array>('to');
    const callData = sys.aspect.property.get<Uint8Array>('data');
    sys.log('||| jit  postContractCall ' + uint8ArrayToHex(sender));
    sys.log('||| jit  postContractCall ' + uint8ArrayToHex(to));
    sys.log('||| jit  postContractCall ' + uint8ArrayToHex(callData));

    const request = JitCallBuilder.simple(sender, to, callData).build();

    // Submit the JIT call
    const response = sys.hostApi.evmCall.jitCall(request);

    sys.log('||| jit result ' + uint8ArrayToHex(response.ret));
    sys.log('||| jit errorMsg ' + response.errorMsg);
  }
}

// 2.register aspect Instance
const aspect = new JitCallAspect();
entryPoint.setAspect(aspect);

// 3.must export it
export { execute, allocate };
