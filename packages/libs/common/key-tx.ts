import {Key, ResultNotImplemented} from './key-path';

import {GasMeterKey} from "./key-block";
import {EthReceipt, EthTransaction, TxExtProperty} from "../proto";
import {StringUnwrap} from "./result-convert";

import {ConvertUtil} from "./helper/convert";
const convertUtil = new ConvertUtil();

export class TxKey extends Key<ResultNotImplemented> {
    constructor() {
        super('tx');
    }

    get extProperties(): Key<TxExtProperty> {
        return new Key('extProperties', this.parts,);
    }


    get context(): MappingKey {
        return new MappingKey('context', this.parts);
    }

    get content(): TxContentKey {
        return new Key('content', this.parts);
    }

    get receipt(): EthReceiptKey {
        return new Key('receipt', this.parts);
    }

    get gasMeter(): GasMeterKey {
        return new Key('gasMeter', this.parts);
    }

    get stateChanges(): StateChangeKey {
        return new StateChangeKey(this.parts);
    }

    get callTree(): CallTreeKey {
        return new CallTreeKey(this.parts);
    }
}

export class TxContentKey extends Key<EthTransaction> {

}

export class EthReceiptKey extends Key<EthReceipt> {

}

class CallTreeKey extends Key<ResultNotImplemented> {
    constructor(prefixes: Array<string> = []) {
        super('callTree', prefixes);
    }

    callIndex(value: u64): Key<ResultNotImplemented> {
        return new Key(value.toString(10), this.parts);
    }
}

class StateChangeKey extends Key<ResultNotImplemented> {
    constructor(prefixes: Array<string> = []) {
        super('stateChanges', prefixes);
    }

    account(accountHex: string): StateChangeAccountKey {
        return new StateChangeAccountKey(accountHex, this.parts);
    }
}

class StateChangeAccountKey extends Key<ResultNotImplemented> {
    variable(stateVarName: string): StateChangeVariableKey {
        return new StateChangeVariableKey(stateVarName, this.parts);
    }
}

class StateChangeVariableKey extends Key<ResultNotImplemented> {
    indices(indices: Array<Uint8Array>): Key<ResultNotImplemented> {
        const strIndices = new Array<string>();
        for (let i = 0; i < indices.length; i++) {
            const uint8Array = convertUtil.uint8ArrayToHex(indices[i]);

            strIndices.push(uint8Array);
        }
        return new Key(strIndices.join('.'), this.parts);
    }
}

class MappingKey extends Key<string> {
    constructor(parent: string, prefixes: Array<string> = []) {
        super(parent, prefixes);
    }

    property(key: string): Key<string> {
        // super.add(key);
        return new Key(key, this.parts, new StringUnwrap);
    }
}