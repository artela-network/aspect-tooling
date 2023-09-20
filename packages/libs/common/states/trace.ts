import {TraceCtx} from "../../system";
import {EthStateChange} from "../../proto";

export class State<T> {
    readonly account: string;
    readonly value: T;
    readonly callIdx: u64;

    constructor(account: string, value: T, callIdx: u64) {
        this.account = account;
        this.value = value;
        this.callIdx = callIdx
    }
}

export abstract class StateChange<T> {
    private readonly account: string;
    private readonly stateVar: string;
    private readonly ctx: TraceCtx;
    private readonly changes: Array<State<T>>;

    protected constructor(ctx: TraceCtx, account: string, stateVar: string, indices: Uint8Array[] = []) {
        this.ctx = ctx;
        this.account = account;
        this.stateVar = stateVar;
        this.changes = new Array<State<T>>();

        const changes = ctx.getStateChanges(account, stateVar, indices);
        if (changes != null && changes.all != null) {
            for (let i = 0; i < changes.all.length; i++) {
                this.changes.push(this.unmarshalState(changes.all[i]));
            }
        }
    }

    public original(): T | null {
        return this.changes.length > 0 ? this.changes[0].value : null;
    }

    public all(): Array<State<T>> | null {
        return this.changes;
    }

    public current(): T | null {
        return this.changes.length > 0 ? this.changes[this.changes.length - 1].value : null;
    }

    public abstract unmarshalState(raw: EthStateChange) : State<T>;
}

export abstract class StateKey<K> {
    readonly account: string;
    readonly stateVar: string;
    readonly prefixes: Uint8Array[];
    readonly ctx: TraceCtx;
    readonly children: Uint8Array[];

    protected constructor(ctx: TraceCtx, account: string, stateVar: string, prefixes: Uint8Array[] = []) {
        this.ctx = ctx;
        this.account = account;
        this.stateVar = stateVar;
        this.prefixes = prefixes;

        const children = ctx.getStateChangeIndices(account, stateVar, prefixes);
        if (children == null) {
            this.children = []
        } else {
            this.children = children.indices;
        }
    }

    protected abstract parseKey(key: K): Uint8Array;
}
