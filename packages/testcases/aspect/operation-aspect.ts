// The entry file of your WebAssembly module.

import {
  allocate,
  entryPoint,
  execute,
  IAspectOperation,
  OperationInput,
  stringToUint8Array,
  sys,
} from '@artela/aspect-libs';

class AspectTest implements IAspectOperation {
  operation(input: OperationInput): Uint8Array {
    sys.require(input.callData!.length > 0, 'data is lost');
    return stringToUint8Array('test');
  }
}

// 2.register aspect Instance
const aspect = new AspectTest();
entryPoint.setOperationAspect(aspect);

// 3.must export it
export { execute, allocate };
