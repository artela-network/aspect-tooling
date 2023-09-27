import {CallStackQuery, SateChangeQuery} from "../proto";
import {Protobuf} from "as-proto";
import {utils} from "./util-api";

abstract class Node {
    public arr = new Array<string>();

    protected constructor(... key: string[]) {
        this.arr = new Array<string>();
        for (let i = 0; i < key.length; i++) {
            this.add(key[i]);
        }
    }

    protected add(... key: string[]) {
        for (let i = 0; i < key.length; i++) {
            this.arr.push(key[i]);
        }
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
        return new KeyNodeImpl("extProperties")
    }

    get content(): string {
        super.add("baseInfo")
        return super.toString()
    }

    get context(): KeyNodeImpl {
        return new KeyNodeImpl("context")
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
        return new StateChangesNode()
    }

    get callStack():CallStackNode{
        return new CallStackNode()
    }

}
class CallStackNode extends Node{
    private  _callIndex: Array<u64>
    constructor() {
        super("callStack");
        this._callIndex=[]
    }
    callIndex(value: Array<u64>): CallStackNode {
        this._callIndex = value;
        return this
    }

    public toString(): string {
        const stackQuery = new CallStackQuery(this._callIndex);
        const queryCode = Protobuf.encode(stackQuery, CallStackQuery.encode);
        const arrayToHex = utils.uint8ArrayToHex(queryCode);
        super.add(arrayToHex)
        return super.toString()
    }
}
class StateChangesNode extends Node {
    private _account: string;
    private _variable: string;
    private _indices: Array<Uint8Array>;

    constructor() {
        super("stateChanges");
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
        const sateChangeQuery = new SateChangeQuery(this._account, this._variable, this._indices);
        const queryCode = Protobuf.encode(sateChangeQuery, SateChangeQuery.encode);
        const arrayToHex = utils.uint8ArrayToHex(queryCode);
        super.add(arrayToHex)
        super.add("indices")
        return super.toString()
    }
    public toString(): string {
        const sateChangeQuery = new SateChangeQuery(this._account, this._variable, this._indices);
        const queryCode = Protobuf.encode(sateChangeQuery, SateChangeQuery.encode);
        const arrayToHex = utils.uint8ArrayToHex(queryCode);
        super.add(arrayToHex)
        return super.toString()
    }
}

class KeyNodeImpl extends Node {
    constructor(parentPath: string) {
        super()
        super.add(parentPath)
    }

    key(... key: string[]): Node {
        for (let i = 0; i < key.length; i++) {
            super.add(key[i]);
        }
        return this;
    }
}

export const tx: TxKey = new TxKey()
export const block: BlockKey = new BlockKey()
export const env: EnvKey = new EnvKey()

export const Occupy = '#';