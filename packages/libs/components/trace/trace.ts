import {
  EthStateChange,
  EthStateChangeIndices,
  EthStateChanges,
  StateChangeQuery,
} from '../../proto';
import { TraceApi } from '../../hostapi';
import { hexToUint8Array } from '../../common';
import { Protobuf } from 'as-proto/assembly';

export class State<T> {
  readonly account: string;
  readonly value: T;
  readonly callIdx: u64;

  constructor(account: string, value: T, callIdx: u64) {
    this.account = account;
    this.value = value;
    this.callIdx = callIdx;
  }
}

export abstract class StateChange<T> {
  protected readonly changes: Array<State<T>>;

  protected constructor(protected readonly properties: StateChangeProperties) {
    this.changes = new Array<State<T>>();

    const response = TraceApi.instance().queryStateChange(
      new StateChangeQuery(
        hexToUint8Array(this.properties.account),
        this.properties.stateVar,
        this.properties.indices,
      ),
    );

    if (response.length == 0) {
      this.changes = [];
    } else {
      const changes = Protobuf.decode<EthStateChanges>(response, EthStateChanges.decode);
      for (let i = 0; i < changes.all.length; i++) {
        this.changes.push(this.unmarshalState(changes.all[i]));
      }
    }
  }

  public original(): T | null {
    return this.changes.length > 0 ? this.changes[0].value : null;
  }

  public all(): Array<State<T>> {
    return this.changes;
  }

  public current(): T | null {
    return this.changes.length > 0 ? this.changes[this.changes.length - 1].value : null;
  }

  public abstract unmarshalState(raw: EthStateChange): State<T>;
}

export class StateChangeProperties {
  constructor(
    readonly account: string,
    readonly stateVar: string,
    readonly indices: Uint8Array[] = [],
  ) {}
}

export abstract class StateKey<K> {
  protected readonly __children__: Uint8Array[];

  protected constructor(protected readonly __properties__: StateChangeProperties) {
    const response = TraceApi.instance().queryStateChange(
      new StateChangeQuery(
        hexToUint8Array(__properties__.account),
        __properties__.stateVar,
        __properties__.indices || [],
      ),
    );

    if (response.length == 0) {
      this.__children__ = [];
    } else {
      const children = Protobuf.decode<EthStateChangeIndices>(
        response,
        EthStateChangeIndices.decode,
      );
      this.__children__ = children.indices;
    }
  }

  get childrenCount(): u64 {
    return this.__children__.length;
  }

  protected abstract parseKey(key: K): Uint8Array;
}
