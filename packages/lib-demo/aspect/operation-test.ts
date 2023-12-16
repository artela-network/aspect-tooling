// The entry file of your WebAssembly module.

import {  entryPoint,execute, allocate, IAspectOperation, OperationCtx, sys } from '@artela/aspect-libs';

class AspectTest implements IAspectOperation {
  operation(ctx: OperationCtx, data: Uint8Array): Uint8Array {
    sys.require(ctx != null, 'operation context is empty');
    sys.require(data != null, 'operation context is empty');
    sys.require(ctx.mutableState != null, 'operation context is empty');
    sys.require(ctx.staticCall != null, 'operation context is empty');
    sys.require(ctx.schedule != null, 'operation context is empty');
    sys.require(ctx.tx != null, 'operation context is empty');
    sys.require(ctx.env != null, 'operation context is empty');
    sys.require(ctx.block != null, 'operation context is empty');
    const uint8Array = sys.utils.stringToUint8Array('test');
    return uint8Array;
  }
}
// 2.register aspect Instance
const aspect = new AspectTest()
entryPoint.setOperationAspect(aspect)

// 3.must export it
export {execute, allocate}
