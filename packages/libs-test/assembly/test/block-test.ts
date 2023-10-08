// The entry file of your WebAssembly module.

import { IAspectBlock, OnBlockFinalizeCtx, OnBlockInitializeCtx,sys,Entry } from '@artela/aspect-libs';



class AspectTest implements IAspectBlock {
    onBlockInitialize(ctx: OnBlockInitializeCtx): void {
        sys.vm.require(ctx.block != null, 'onBlockInitialize blockHeader is empty');
        sys.vm.require(ctx.schedule != null, 'onBlockInitialize scheduleManager is empty');
        sys.vm.require(ctx.env != null, 'onBlockInitialize blockContext is empty');
    }

    onBlockFinalize(ctx: OnBlockFinalizeCtx): void {
        sys.vm.require(ctx.block != null, 'onBlockInitialize blockHeader is empty');
        sys.vm.require(ctx.schedule != null, 'onBlockInitialize scheduleManager is empty');
        sys.vm.require(ctx.env != null, 'onBlockInitialize blockContext is empty');
    }

    isOwner(sender: string): bool {
        sys.vm.require(sender != null, 'isOwner sender is empty');
        return true;
    }
}

export function execute(methodPtr: i32, argPtr: i32): i32 {
    const aspect = new AspectTest();
    const entry = new Entry(aspect, null, null);
    return entry.execute(methodPtr, argPtr);
}

export function allocate(size: i32): i32 {
    return sys.vm.alloc(size);
}