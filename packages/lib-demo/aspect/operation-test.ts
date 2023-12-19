// The entry file of your WebAssembly module.

import {allocate, entryPoint, execute, IAspectOperation, OperationCtx, sys} from '@artela/aspect-libs';

class AspectTest implements IAspectOperation {
  operation(ctx: OperationCtx, data: Uint8Array): Uint8Array {
    sys.require(data.length>0,"data is lost")
    return sys.utils.stringToUint8Array('test');
  }
}
// 2.register aspect Instance
const aspect = new AspectTest()
entryPoint.setOperationAspect(aspect)

// 3.must export it
export {execute, allocate}
