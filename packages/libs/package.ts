import {
  CryptoApi,
  EvmCallApi,
  RuntimeContextApi,
  ScheduleApi,
  StateDbApi,
  UtilApi,
} from './hostapi';
import {
  AspectProperty,
  BlockContext,
  EnvContext,
  ImmutableAspectState,
  JustInTimeCaller,
  MutableAspectState,
  ReceiptContext,
  StateContext,
  StaticCaller,
  TraceContext,
  Tx,
} from './components';
import {
  AspectStateModifiable,
  AspectStateReadonly,
  BlockContextAble,
  ConvertUtil,
  EnvContextAble,
  JustInTimeCallAble,
  ReceiptContextAble,
  StateContextAble,
  StaticCallAble,
  TraceContextAble,
  TxContextAble,
} from './common';

export namespace sys {
  export const crypto = CryptoApi.instance();
  export const utils = new ConvertUtil();
  export function alloc(size: i32): i32 {
    return heap.alloc(size) as i32;
  }
  export function require(condition: bool, message: string = ''): void {
    if (!condition) {
      UtilApi.instance().revert(message);
    }
  }
  export function revert(message: string): void {
    UtilApi.instance().revert(message);
  }
  export function log(data: string): void {
    UtilApi.instance().log(data);
  }
  export namespace hostApi {
    export const evmCall = EvmCallApi.instance();
    export const runtimeContext = RuntimeContextApi.instance();
    export const schedule = ScheduleApi.instance();
    export const crypto = CryptoApi.instance();
    export const stateDb = StateDbApi.instance();
    export const util = UtilApi.instance();
  }
  export namespace aspect {
    export function mutableState(ctx: AspectStateModifiable): MutableAspectState {
      return MutableAspectState.instance(ctx);
    }

    export function readonlyState(ctx: AspectStateReadonly): ImmutableAspectState {
      return ImmutableAspectState.instance(ctx);
    }
    export const property = AspectProperty.instance();
  }
  export namespace evm {
    export function staticCall(ctx: StaticCallAble): StaticCaller {
      return StaticCaller.instance(ctx);
    }
    export function jitCall(ctx: JustInTimeCallAble): JustInTimeCaller {
      return JustInTimeCaller.instance(ctx);
    }

    export function stateDB(ctx: StateContextAble): StateContext {
      return StateContext.instance(ctx);
    }
  }
  export namespace context {
    export function env(ctx: EnvContextAble): EnvContext {
      return EnvContext.instance(ctx);
    }

    export function block(ctx: BlockContextAble): BlockContext {
      return BlockContext.instance(ctx);
    }

    export function tx(ctx: TxContextAble): Tx {
      return Tx.instance(ctx);
    }

    export function receipt(ctx: ReceiptContextAble): ReceiptContext {
      return ReceiptContext.instance(ctx);
    }

    export function trace(ctx: TraceContextAble): TraceContext {
      return TraceContext.instance(ctx);
    }
  }
}
