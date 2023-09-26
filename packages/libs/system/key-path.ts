interface KeyNode {
  path: string;
  addKey(key: string): KeyNode;
  toPath(): string;
}

interface TxNode {
  extProperties: KeyNode;
  content: string;
  stateChanges: string;
  callTree: string;
  receipt: string;
  gasMeter: string;
}

interface AspectNode {
  content: KeyNode;
  state: KeyNode;
  property: KeyNode;
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

class KeyNodeInt implements KeyNode {
  constructor(parentPath: string) {
    this.path = parentPath;
    this.arr = new Array<string>();
  }

  path: string;
  arr: Array<string>;

  addKey(key: string): KeyNode {
    if (key != '') {
      this.arr.push(key);
    }
    return this;
  }

  toPath(): string {
    if (this.arr.length == 0) {
      return '';
    }
    return this.path + '.' + this.arr.join('.');
  }
}

export class KeyPath {
  public static tx: TxNode = {
    extProperties: new KeyNodeInt('tx.extProperties'),
    content: 'tx.content',
    stateChanges: 'tx.stateChanges',
    callTree: 'tx.callTree',
    receipt: 'tx.receipt',
    gasMeter: 'tx.gasMeter',
  };
  public static aspect: AspectNode = {
    content: new KeyNodeInt('aspect.context'),
    state: new KeyNodeInt('aspect.state'),
    property: new KeyNodeInt('aspect.property'),
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
