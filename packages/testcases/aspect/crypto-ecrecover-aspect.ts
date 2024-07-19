// The entry file of your WebAssembly module.

import {
  allocate,
  BigInt,
  entryPoint,
  execute,
  hexToUint8Array,
  IAspectOperation,
  InitInput,
  OperationInput,
  sys,
  uint8ArrayToHex,
} from '@artela/aspect-libs';

class AspectTest implements IAspectOperation {
  init(input: InitInput): void {}
  
  isOwner(sender: Uint8Array): bool {
     return true;
  }
  rmPrefix(data: string): string {
    if (data.startsWith('0x')) {
      return data.substring(2, data.length);
    } else {
      return data;
    }
  }

  operation(input: OperationInput): Uint8Array {
    const params = uint8ArrayToHex(input.callData);

    sys.require(
      params.length == 170,
      'illegal validation data, actual: ' + params.length.toString(),
    );
    const from = params.slice(0, 40);
    const r = params.slice(40, 104);
    const s = params.slice(104, 168);
    const v = params.slice(168, 170);

    // 1. verify sig
    const msgHash = this.rmPrefix(uint8ArrayToHex(input.tx!.hash));

    const recoverResult = sys.hostApi.crypto.ecRecover(
      msgHash,
      BigInt.fromString(v, 16),
      BigInt.fromString(r, 16),
      BigInt.fromString(s, 16),
    );

    sys.log('||| operation recoverResult ' + recoverResult);

    return hexToUint8Array(recoverResult);
  }
}

// 2.register aspect Instance
const aspect = new AspectTest();
entryPoint.setOperationAspect(aspect);

// 3.must export it
export { execute, allocate };
