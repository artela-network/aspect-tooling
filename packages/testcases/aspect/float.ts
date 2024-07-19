// The entry file of your WebAssembly module.

import {
    allocate,
    entryPoint,
    execute,
    IAspectOperation,
    InitInput,
    OperationInput,
    stringToUint8Array,
  } from '@artela/aspect-libs';
  
  // Float aspect contain float related operations, this should fail during code validation.
  class FloatAspect implements 
  IAspectOperation {
    init(input: InitInput): void {}
    
    isOwner(sender: Uint8Array): bool {
       return false;
    }
  
    operation(input: OperationInput): Uint8Array {
      const num = 1.1;
      return stringToUint8Array(num.toString(10));
    }
  }
  
  // 2.register aspect Instance
  const aspect = new FloatAspect();
  entryPoint.setOperationAspect(aspect);
  entryPoint.setAspect(aspect);
  
  // 3.must export it
  export { execute, allocate };
  