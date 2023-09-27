import {utils} from "./util-api";

abstract class Node {
    public arr = new Array<string>();

    protected constructor(key: string,arr:Array<string>=[]) {
        this.addAll(arr);
        this.add(key);
    }

    protected addAll(key: string[]) {
        for (let i = 0; i < key.length; i++) {
            this.arr.push(key[i]);
        }
    }

    protected add(key: string) {
        this.arr.push(key);

    }

    public toString(): string {
        if (this.arr.length == 0) {
            return '';
        }
        return this.arr.join('.');
    }
}

class BlockKey extends Node {
    constructor() {
        super("block");
    }

    get header(): string {
        super.add("header")
        return this.toString()
    }

    get txs(): string {
        super.add("txs")
        return this.toString()
    }

    get gasMeter(): string {
        super.add("gasMeter")
        return this.toString()
    }

    get minGasPrice(): string {
        super.add("minGasPrice")
        return this.toString()
    }

    get lastCommit(): string {
        super.add("lastCommit")
        return this.toString()
    }
}

class EnvKey extends Node {
    constructor() {
        super("env");
    }

    get consParams(): string {
        super.add("consParams")
        return this.toString()
    }

    get chainConfig(): string {
        super.add("chainConfig")
        return this.toString()
    }

    get evmParams(): string {
        super.add("evmParams")
        return this.toString()
    }

    get baseInfo(): string {
        super.add("baseInfo")
        return this.toString()
    }

}

class TxKey extends Node {
    constructor() {
        super("tx");
    }

    get extProperties(): KeyNodeImpl {
        return new KeyNodeImpl("extProperties",this.arr)
    }

    get content(): string {
        super.add("baseInfo")
        return super.toString()
    }

    get context(): KeyNodeImpl {
        return new KeyNodeImpl("context",this.arr)
    }

    get receipt(): string {
        super.add("receipt")
        return super.toString()
    }

    get gasMeter(): string {
        super.add("gasMeter")
        return super.toString()
    }

    get stateChanges(): StateChangesNode {
        return new StateChangesNode(this.arr)
    }

    get callStack(): CallStackNode {
        return new CallStackNode(this.arr)
    }

}

class CallStackNode extends Node {
    private _callIndex: i64

    constructor(arr:Array<string>=[]) {
        super("callStack",arr);
        this._callIndex = -1
    }

    callIndex(value: u64): CallStackNode {
        this._callIndex = value;
        return this
    }

    public toString(): string {
        if (this._callIndex != -1) {
            super.add(this._callIndex.toString(10))
        }
        return super.toString()
    }
}

class StateChangesNode extends Node {
    private _account: string;
    private _variable: string;
    private _indices: Array<Uint8Array>;

    constructor(arr:Array<string>=[]) {
        super("stateChanges",arr);
        this._account = ""
        this._variable = ""
        this._indices = []
    }

    account(value: string): StateChangesNode {
        this._account = value;
        return this
    }

    variable(value: string): StateChangesNode {
        this._variable = value;
        return this
    }

    indices(value: Array<Uint8Array>): StateChangesNode {
        this._indices = value;
        return this
    }

    public getIndices(): string {
        super.add("indices")
        return this.toString()
    }

    public toString(): string {
        super.add(this._account == "" ? Occupy : this._account)
        super.add(this._variable == "" ? Occupy : this._variable)
        for (let i = 0; i < this._indices.length; i++) {
            super.add(utils.uint8ArrayToHex(this._indices[i]))
        }
        return super.toString()

    }
}

class KeyNodeImpl extends Node {
    constructor(parentPath: string,arr :Array<string>=[]) {
        super(parentPath,arr)
    }

    key(key: string): KeyNodeImpl {
        super.add(key);
        return this;
    }
}

export const tx: TxKey = new TxKey()
export const block: BlockKey = new BlockKey()
export const env: EnvKey = new EnvKey()

export const Occupy = '#';