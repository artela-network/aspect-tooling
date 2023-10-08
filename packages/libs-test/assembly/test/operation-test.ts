// The entry file of your WebAssembly module.

import {Entry, IAspectOperation, OperationCtx, sys} from '@artela/aspect-libs';


class AspectTest implements IAspectOperation {
    operation(ctx: OperationCtx, data: Uint8Array): Uint8Array {

        sys.vm.require(ctx != null, 'operation context is empty');
        sys.vm.require(data != null, 'operation context is empty');
        sys.vm.require(ctx.aspect != null, 'operation context is empty');
        sys.vm.require(ctx.tx != null, 'operation context is empty');
        sys.vm.require(ctx.env != null, 'operation context is empty');
        sys.vm.require(ctx.block != null, 'operation context is empty');
        return sys.common.utils.stringToUint8Array('test');
    }
}

export function execute(methodPtr: i32, argPtr: i32): i32 {
    const aspect = new AspectTest();
    const entry = new Entry(null, null, aspect);
    return entry.execute(methodPtr, argPtr);
}

export function allocate(size: i32): i32 {
    return sys.vm.alloc(size);
}