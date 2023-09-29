import { JustInTimeCaller, StaticCaller } from './evm-call-api';
import { AspectProperty, ImmutableAspectState, MutableAspectState } from './aspect-state-api';
import {
  AspectStateModifiableCtx,
  AspectStateReadonlyCtx,
  EvmCallableCtx,
  InherentCallableCtx,
} from './context-base';

export namespace sys {
  export function evm(_: EvmCallableCtx): StaticCaller {
    return StaticCaller.get();
  }

  export function inherentCall(_: InherentCallableCtx): JustInTimeCaller {
    return JustInTimeCaller.get();
  }

  export function aspectState(_: AspectStateModifiableCtx): MutableAspectState {
    return MutableAspectState.get();
  }

  export function aspectReadonlyState(_: AspectStateReadonlyCtx): ImmutableAspectState {
    return ImmutableAspectState.get();
  }

  export function aspectProperty(): AspectProperty {
    return AspectProperty.get();
  }
}
