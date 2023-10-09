import {CryptoApi, EvmCallApi, RuntimeContextApi, ScheduleApi, StateDbApi, UtilApi} from "./hostapi";
import {AspectProperty, ImmutableAspectState, MutableAspectState} from "./components/aspect";
import {EthMessage, EthMessageCallResult, JitInherentRequest, JitInherentResponse} from "./proto";
import {BlockContext, EnvContext, EthReceiptContext, TraceContext, TxContext} from "./components/context";
import {
    AspectStateModifiable,
    AspectStateReadonly,
    ContextKey,
    convertUtil as Utils,
    ethereum as Ethereum, JustInTimeCallAble,
    MessageUtil, StateQueryAble, StaticCallAble
} from "./common";
import {JustInTimeCaller, StateQuery, StaticCaller} from "./components";

const util = UtilApi.instance();
export namespace sys {

    export namespace common {
        export const ctxKey = new ContextKey();
        export const utils = Utils;
        export const messageUtil = MessageUtil.instance();
        export const ethereum = Ethereum;
        export function alloc(size: i32): i32 {
            return heap.alloc(size) as i32;
        }
        export function require(condition: bool, message: string = ''): void {
            if (!condition) {
                util.revert(message);
            }
        }
        export function revert(message: string): void {
            util.revert(message)
        }
        export function log(data: string): void {
            util.log(data)
        }
    }
    export const crypto = CryptoApi.instance();

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

        export function property(): AspectProperty {
            return AspectProperty.instance();
        }

    }

    export namespace evm {
        export function staticCall(ctx: StaticCallAble): StaticCaller {
            return StaticCaller.instance(ctx);
        }
        export function jitCall(ctx: JustInTimeCallAble): JustInTimeCaller {
            return JustInTimeCaller.instance(ctx);
        }
        export function stateDB(ctx: StateQueryAble): StateQuery {
            return StateQuery.instance(ctx);
        }
    }
    export namespace context {
        export const env = EnvContext.instance()
        export const block = BlockContext.instance()

        export namespace tx {
            export const baseInfo = TxContext.instance()
            export const receipt = EthReceiptContext.instance()
            export const trace = TraceContext.instance()
        }
    }
}