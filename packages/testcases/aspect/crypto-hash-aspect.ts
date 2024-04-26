// The entry file of your WebAssembly module.

import {
  allocate,
  entryPoint,
  execute,
  IAspectOperation,
  OperationInput,
  stringToUint8Array,
  sys,
  uint8ArrayToHex,
} from '@artela/aspect-libs';

class AspectTest implements IAspectOperation {
  isOwner(sender: Uint8Array): bool {
      return true;
  }
  operation(input: OperationInput): Uint8Array {
    const keccak = sys.hostApi.crypto.keccak(input.callData);
    sys.log('||| keccak ' + uint8ArrayToHex(keccak));

    const sha256Data = sys.hostApi.crypto.sha256(input.callData);
    sys.log('||| sha256 ' + uint8ArrayToHex(sha256Data));

    const ripemd160Data = sys.hostApi.crypto.ripemd160(input.callData);
    sys.log('||| ripemd160 ' + uint8ArrayToHex(ripemd160Data));

    //  let keccakData = sys.hostApi.crypto.ecRecover(input.callData);

    return ripemd160Data;
  }
}

// 2.register aspect Instance
const aspect = new AspectTest();
entryPoint.setOperationAspect(aspect);

// 3.must export it
export { execute, allocate };
