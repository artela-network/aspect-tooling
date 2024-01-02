import {
  AspectContext,
  AspectProperty,
  ImmutableAspectState,
  MutableAspectState,
  TransientStorage,
} from './components';
import {
  AspectPropertyApi,
  AspectStateApi,
  AspectTransientStorageApi,
  CryptoApi,
  EvmCallApi,
  RuntimeContextApi,
  StateDbApi,
  TraceApi,
  UtilApi,
} from './hostapi';

export namespace sys {
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
    export const crypto = CryptoApi.instance();
    export const stateDb = StateDbApi.instance();
    export const util = UtilApi.instance();

    export const aspectState = AspectStateApi.instance();

    export const aspectProperty = AspectPropertyApi.instance();

    export const aspectTransientStorage = AspectTransientStorageApi.instance();

    export const trace = TraceApi.instance();
  }
  export namespace aspect {
    export function id(): string {
      return AspectContext.instance().id;
    }

    export function version(): u64 {
      return AspectContext.instance().version;
    }

    export const mutableState = MutableAspectState.instance();

    export const readonlyState = ImmutableAspectState.instance();
    export const property = AspectProperty.instance();

    export const transientStorage = TransientStorage.instance();
  }
}
