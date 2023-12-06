// The entry file of your WebAssembly module.

import {
  IBlockJP,
  OnBlockFinalizeCtx,
  OnBlockInitializeCtx,
  sys,
  Entry,
} from '@artela/aspect-libs';

class AspectTest implements IBlockJP {
  onBlockInitialize(ctx: OnBlockInitializeCtx): void {
    sys.require(ctx.block != null, 'onBlockInitialize blockHeader is empty');
    sys.require(ctx.staticCall != null, 'onBlockInitialize scheduleManager is empty');
    sys.require(ctx.mutableState != null, 'onBlockInitialize scheduleManager is empty');
    sys.require(ctx.env != null, 'onBlockInitialize blockContext is empty');
  }

  onBlockFinalize(ctx: OnBlockFinalizeCtx): void {
    sys.require(ctx.block != null, 'onBlockInitialize blockHeader is empty');
    sys.require(ctx.mutableState != null, 'onBlockInitialize scheduleManager is empty');
    sys.require(ctx.staticCall != null, 'onBlockInitialize scheduleManager is empty');
    sys.require(ctx.env != null, 'onBlockInitialize blockContext is empty');
  }

  isOwner(sender: string): bool {
    sys.require(sender != null, 'isOwner sender is empty');
    return true;
  }
}

export function execute(methodPtr: i32, argPtr: i32): i32 {
  const aspect = new AspectTest();
  const entry = new Entry(aspect, null, null);
  return entry.execute(methodPtr, argPtr);
}

export function allocate(size: i32): i32 {
  return sys.alloc(size);
}
