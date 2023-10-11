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
export interface StaticCallAble {
  __staticCallableImplemented(): void;
}
export interface JustInTimeCallAble {
  __justInTimeCallableImplemented(): void;
}

export interface StateContextAble {
  __stateQueryableImplemented(): void;
}

export interface BlockContextAble {
  __blockContextImplemented(): void;
}

export interface TxContextAble {
  __txContextImplemented(): void;
}

export interface EnvContextAble {
  __envContextImplemented(): void;
}

export interface ReceiptContextAble {
  __receiptContextImplemented(): void;
}

export interface TraceContextAble {
  __traceContextImplemented(): void;
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
