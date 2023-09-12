// The entry file of your WebAssembly module.

import {
    IAspectBlock,
    OnBlockFinalizeCtx,
    OnBlockInitializeCtx,

} from "@artela/aspect-libs/types";
import {UtilityProvider} from "@artela/aspect-libs/system";
import {Entry} from "@artela/aspect-libs/types/aspect-entry";

function AssertTrue(cond: bool, msg: string): void {
    if (!cond) {
        UtilityProvider.revert(msg)
    }
}

class AspectTest implements IAspectBlock {
    onBlockInitialize(ctx: OnBlockInitializeCtx): void {
        AssertTrue(ctx.blockHeader != null, "onBlockInitialize blockHeader is empty")
        AssertTrue(ctx.scheduleManager != null, "onBlockInitialize scheduleManager is empty")
        AssertTrue(ctx.blockContext != null, "onBlockInitialize blockContext is empty")
        AssertTrue(ctx.staticCaller != null, "onBlockInitialize staticCaller is empty")
    }

    onBlockFinalize(ctx: OnBlockFinalizeCtx): void {
        AssertTrue(ctx.blockHeader != null, "onBlockFinalize blockHeader is empty")
        AssertTrue(ctx.scheduleManager != null, "onBlockFinalize scheduleManager is empty")
        AssertTrue(ctx.blockContext != null, "onBlockFinalize blockContext is empty")
        AssertTrue(ctx.staticCaller != null, "onBlockFinalize staticCaller is empty")
    }

    isOwner(sender: string): bool {
        AssertTrue(sender != null, "isOwner sender is empty")
        return true;
    }
}


export function execute(methodPtr: i32, argPtr: i32): i32 {
    const aspect = new AspectTest()
    const entry = new Entry(aspect, null, null);
    return entry.execute(methodPtr, argPtr);
}

export function allocate(size: i32): i32 {
    return UtilityProvider.alloc(size);
}