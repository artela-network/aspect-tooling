import {
  EthCallStacks,
  EthStackTransaction,
  EthStateChangeIndices,
  EthStateChanges,
} from '../proto';

export interface ScheduleAble {
  __scheduleImplemented(): void;
}
export interface AspectStateModifiable extends AspectStateReadonly {
  __modifiableAspectStateImplemented(): void;
}

export interface AspectStateReadonly {
  __readonlyAspectStateImplemented(): void;
}
export interface StaticCallable {
  __staticCallableImplemented(): void;
}
export interface JustInTimeCallable {
  __justInTimeCallableImplemented(): void;
}

export interface StateDBAccessible {
  __stateQueryableImplemented(): void;
}

export interface BlockContextAccessible {
  __blockContextImplemented(): void;
}

export interface TxContextAccessible {
  __txContextImplemented(): void;
}

export interface EnvContextAccessible {
  __envContextImplemented(): void;
}

export interface ReceiptContextAccessible {
  __receiptContextImplemented(): void;
}

export interface TraceAccessible {
  __traceContextImplemented(): void;
}
export interface TraceCtx {
  findCall(index: u64): EthStackTransaction | null;

  callTree(): EthCallStacks;

  stateChanges(addr: string, variable: string, indices: Array<Uint8Array>): EthStateChanges;

  stateChangeIndices(
    addr: string,
    variable: string,
    indices: Array<Uint8Array>,
  ): EthStateChangeIndices;
}
