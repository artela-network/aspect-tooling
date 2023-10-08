
import {CryptoApi, EvmCallApi, RuntimeContextApi, ScheduleApi, StateDbApi, UtilApi} from "./hostapi";
import {AspectProperty, ImmutableAspectState, MutableAspectState} from "./components/aspect";
import {EthMessage, EthMessageCallResult, JitInherentRequest, JitInherentResponse} from "./proto";
import {BlockContext, EnvContext, EthReceiptContext, TraceContext, TxContext} from "./components/context";
import {ContextKey, ethereum as Ethereum, MessageUtil, convertUtil as Utils} from "./common";

const util = UtilApi.instance();
export namespace sys {
    export namespace vm {
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
    export namespace common {
        export const ctxKey = new ContextKey();
        export const utils = Utils;
        export const messageUtil = MessageUtil.instance();
        export const ethereum = Ethereum;

    }
    export namespace hostApi {
        export const crypto = CryptoApi.instance();
        export const evmCall = EvmCallApi.instance();
        export const runtimeContext = RuntimeContextApi.instance();
        export const schedule = ScheduleApi.instance();
        export const stateDb = StateDbApi.instance();
        export const util = UtilApi.instance();
    }
    export namespace aspect {
        export const readonlyState = ImmutableAspectState.instance();
        export const state = MutableAspectState.instance();
        export const property = AspectProperty.instance();
    }

    export namespace evm {
        export function call(request: EthMessage): EthMessageCallResult {
            return EvmCallApi.instance().staticCall(request)
        }

        export function jitSend(request: JitInherentRequest): JitInherentResponse {
            return EvmCallApi.instance().jitCall(request)
        }

        export const stateDb = StateDbApi.instance()
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