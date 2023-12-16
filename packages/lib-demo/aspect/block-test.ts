// The entry file of your WebAssembly module.

import {
  IAspectBlock,
  OnBlockFinalizeCtx,
  OnBlockInitializeCtx,
  sys,
  entryPoint,execute, allocate,
} from '@artela/aspect-libs';

class AspectTest implements IAspectBlock {
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
// 2.register aspect Instance
const aspect = new AspectTest()
entryPoint.setAspect(aspect)

// 3.must export it
export {execute, allocate}

