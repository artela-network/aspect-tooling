import {convertUtil} from './helper/convert';
import {ErrLoadRuntimeCtxValue} from "./errors";
import {RuntimeContextApi} from "../hostapi";

export interface ResultUnwrap<T> {
  decode(u: Uint8Array): T
}

export class Key<T> {
  protected parts: string[] = new Array<string>();
  protected resultUnwrap: ResultUnwrap<T>|null;

  protected constructor(key: string, prefixes: Array<string> = [], convert: ResultUnwrap<T>|null=null) {
    this.addAll(prefixes);
    this.add(key);
    this.resultUnwrap = convert;
  }

  protected addAll(key: string[]): void {
    for (let i = 0; i < key.length; i++) {
      this.parts.push(key[i]);
    }
  }

  protected add(key: string): void {
    this.parts.push(key);
  }

  public unwrap(): T {
    const runtimeContext = RuntimeContextApi.instance();
    const response = runtimeContext.get(this.toString());
    if (!response.data || !response.data.value) {
      throw ErrLoadRuntimeCtxValue;
    }
    return this.resultUnwrap!.decode(response.data.value)
  }
  public toString(): string {
    if (this.parts.length == 0) {
      return '';
    }
    return this.parts.join('^');
  }
}


class EnvKey extends Key<any> {
  constructor() {
    super('env');
  }

  get consensusParams(): Key {
    return new Key('consensusParams', this.parts);
  }

  get chainConfig(): Key {
    return new Key('chainConfig', this.parts);
  }

  get evmParams(): Key {
    return new Key('evmParams', this.parts);
  }

  get baseFee(): Key {
    return new Key('baseFee', this.parts);
  }
}

class TxKey extends Key {
  constructor() {
    super('tx');
  }

  get extProperties(): MappingKey {
    return new MappingKey('extProperties', this.parts);
  }

  get content(): Key {
    return new Key('content', this.parts);
  }

  get context(): MappingKey {
    return new MappingKey('context', this.parts);
  }

  get receipt(): Key {
    return new Key('receipt', this.parts);
  }

  get gasMeter(): Key {
    return new Key('gasMeter', this.parts);
  }

  get stateChanges(): StateChangeKey {
    return new StateChangeKey(this.parts);
  }

  get callTree(): CallTreeKey {
    return new CallTreeKey(this.parts);
  }
}

class CallTreeKey extends Key {
  constructor(prefixes: Array<string> = []) {
    super('callTree', prefixes);
  }

  callIndex(value: u64): Key {
    return new Key(value.toString(10), this.parts);
  }
}

class StateChangeKey extends Key {
  constructor(prefixes: Array<string> = []) {
    super('stateChanges', prefixes);
  }

  account(accountHex: string): StateChangeAccountKey {
    return new StateChangeAccountKey(accountHex, this.parts);
  }
}

class StateChangeAccountKey extends Key {
  variable(stateVarName: string): StateChangeVariableKey {
    return new StateChangeVariableKey(stateVarName, this.parts);
  }
}

class StateChangeVariableKey extends Key {
  indices(indices: Array<Uint8Array>): Key {
    const strIndices = new Array<string>();
    for (let i = 0; i < indices.length; i++) {
      const uint8Array = convertUtil.uint8ArrayToHex(indices[i]);

      strIndices.push(uint8Array);
    }
    return new Key(strIndices.join('.'), this.parts);
  }
}

class MappingKey extends Key {
  constructor(parent: string, prefixes: Array<string> = []) {
    super(parent, prefixes);
  }

  property(key: string): string {
    super.add(key);
    return super.toString();
  }
}

// export class ContextKey {
//   static get block(): BlockKey {
//     return new BlockKey();
//   }
//
//   static get tx(): TxKey {
//     return new TxKey();
//   }
//
//   static get env(): EnvKey {
//     return new EnvKey();
//   }
// }
