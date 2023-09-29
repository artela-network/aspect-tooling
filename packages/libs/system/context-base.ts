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
