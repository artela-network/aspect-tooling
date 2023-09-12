// The entry file of your WebAssembly module.

import {
    IAspectOperation,
    OperationCtx,

} from "@artela/aspect-libs/types";
import {UtilityProvider} from "@artela/aspect-libs/system";
import {Entry} from "@artela/aspect-libs/types/aspect-entry";
import {AspectResponse} from "@artela/aspect-libs/proto";
import {DefAspectResponse} from "@artela/aspect-libs/types/message-helper";

function AssertTrue(cond: bool, msg: string): void {
    if (!cond) {
        UtilityProvider.revert(msg)
    }
}

class AspectTest implements IAspectOperation {
    operation(ctx: OperationCtx): AspectResponse {
        AssertTrue(ctx.tx != null, 'operation tx is empty')
        AssertTrue(ctx.context != null, "operation context is empty")
        AssertTrue(ctx.staticCaller != null, "operation context is empty")
        return DefAspectResponse();
    }

}


export function execute(methodPtr: i32, argPtr: i32): i32 {
    const aspect = new AspectTest()
    const entry = new Entry(null, null, aspect);
    return entry.execute(methodPtr, argPtr);
}

export function allocate(size: i32): i32 {
    return UtilityProvider.alloc(size);
}