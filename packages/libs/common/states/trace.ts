import { EthStateChange } from '../../proto';
import { TraceContext } from '../../context';

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

  protected constructor(
    private readonly ctx: TraceContext,
    private readonly account: string,
    private readonly stateVar: string,
    indices: Uint8Array[] = [],
  ) {
    this.ctx = ctx;
    this.account = account;
    this.stateVar = stateVar;
    this.changes = new Array<State<T>>();

    const changes = ctx.stateChanges(account, stateVar, indices);
    for (let i = 0; i < changes.all.length; i++) {
      this.changes.push(this.unmarshalState(changes.all[i]));
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

export class StateKeyProperties {
  constructor(
    readonly ctx: TraceContext,
    readonly account: string,
    readonly stateVar: string,
    readonly prefixes: Uint8Array[] = [],
  ) {
  }
}

export abstract class StateKey<K> {
  protected readonly __children__: Uint8Array[];

  protected constructor(
    private readonly __properties__: StateKeyProperties,
  ) {
    const children = __properties__.ctx.stateChangeIndices(
      __properties__.account,
      __properties__.stateVar,
      __properties__.prefixes || [],
    );
    if (children == null) {
      this.__children__ = [];
    } else {
      this.__children__ = children.indices;
    }
  }

  protected abstract parseKey(key: K): Uint8Array;
}
