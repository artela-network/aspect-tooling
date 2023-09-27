abstract class Node {

    public arr = new Array<string>();

    protected constructor(...key: string[]) {
        this.arr = new Array<string>();
        for (let i = 0; i < key.length; i++) {
            this.add(key[i]);
        }
    }

    protected add(...key: string[]) {
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


interface TxNode {
    extProperties: KeyNodeImpl;
    content: string;
    receipt: string;
    gasMeter: string;
}

interface AspectNode {
    content: KeyNodeImpl;
    state: KeyNodeImpl;
    property: KeyNodeImpl;
}

interface EnvNode {
    consParams: string;
    chainConfig: string;
    evmParams: string;
    baseInfo: string;
}

interface BlockNode {
    header: string;
    txs: string;
    gasMeter: string;
    minGasPrice: string;
    lastCommit: string;
}

class KeyNodeImpl extends Node {
    constructor(parentPath: string) {
        super()
        super.add(parentPath)
    }

    key(...key: string[]): Node {
        for (let i = 0; i < key.length; i++) {
            super.add(key[i]);
        }
        return this;
    }
}

//   stateChanges: 'tx.stateChanges',
//   callTree: 'tx.callTree',
// key Generate for RuntimeContext.get
export class CtxKey {
    public static tx: TxNode = {
        extProperties: new KeyNodeImpl('tx.extProperties'),
        content: 'tx.content',
        receipt: 'tx.receipt',
        gasMeter: 'tx.gasMeter',
    };
    public static aspect: AspectNode = {
        content: new KeyNodeImpl('aspect.context'),
        state: new KeyNodeImpl('aspect.state'),
        property: new KeyNodeImpl('aspect.property'),
    };

    public static env: EnvNode = {
        consParams: 'env.consParams',
        chainConfig: 'env.chainConfig',
        evmParams: 'env.evmParams',
        baseInfo: 'env.baseInfo',
    };
    public static block: BlockNode = {
        header: 'block.header',
        txs: 'block.txs',
        gasMeter: 'block.gasMeter',
        minGasPrice: 'block.minGasPrice',
        lastCommit: 'block.lastCommit',
    };

    public static Occupy = '#';
}
