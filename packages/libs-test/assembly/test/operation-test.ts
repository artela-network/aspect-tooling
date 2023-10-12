// The entry file of your WebAssembly module.

import { Entry, IAspectOperation, OperationCtx, sys } from '@artela/aspect-libs';

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

export function execute(methodPtr: i32, argPtr: i32): i32 {
  const aspect = new AspectTest();
  const entry = new Entry(null, null, aspect);
  return entry.execute(methodPtr, argPtr);
}

export function allocate(size: i32): i32 {
  return sys.alloc(size);
}
