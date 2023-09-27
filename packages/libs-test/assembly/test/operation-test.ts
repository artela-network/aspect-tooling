// The entry file of your WebAssembly module.

import {IAspectOperation, OperationCtx} from '@artela/aspect-libs/types';
import {utils} from '@artela/aspect-libs';
import {Entry} from '@artela/aspect-libs/types/aspect-entry';

function AssertTrue(cond: bool, msg: string): void {
    if (!cond) {
        utils.revert(msg);
    }
}

class AspectTest implements IAspectOperation {
    operation(ctx: OperationCtx, data: Uint8Array): Uint8Array {
        AssertTrue(ctx != null, 'operation context is empty');
        AssertTrue(data != null, 'operation context is empty');
        AssertTrue(ctx.staticCaller != null, 'operation context is empty');
        return utils.stringToUint8Array("test")
    }
}

export function execute(methodPtr: i32, argPtr: i32): i32 {
    const aspect = new AspectTest();
    const entry = new Entry(null, null, aspect);
    return entry.execute(methodPtr, argPtr);
}

export function allocate(size: i32): i32 {
    return utils.alloc(size);
}
