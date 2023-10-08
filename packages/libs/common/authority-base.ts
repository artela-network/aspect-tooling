import {EthCallStacks, EthStackTransaction, EthStateChangeIndices, EthStateChanges} from "../proto";

export interface EvmCallableCtx {
  __evmCallableImplemented(): void;
}
export interface InherentCallableCtx {
  __inherentCallableImplemented(): void;
}
export interface AspectStateModifiableCtx extends AspectStateReadonlyCtx {
  __modifiableAspectStateImplemented(): void;
}

export interface AspectStateReadonlyCtx {
  __readonlyAspectStateImplemented(): void;
}

export interface TraceQuery {
  findCall(index: u64): EthStackTransaction | null;

  callTree(): EthCallStacks;

  stateChanges(addr: string, variable: string, indices: Array<Uint8Array>): EthStateChanges;

  stateChangeIndices(
      addr: string,
      variable: string,
      indices: Array<Uint8Array>,
  ): EthStateChangeIndices;
}