import {Key} from './key-path';
import {EthBlockHeaderUnwrap, StringUnwrap, Uint64Unwrap, Uint8ArrayUnwrap} from "./result-convert";
import {EthBlockHeader} from "../proto";

export class BlockKey extends Key<any> {
    constructor() {
        super('block');
    }

    get header(): BlockHeaderKey {
        return new BlockHeaderKey('header', this.parts, new EthBlockHeaderUnwrap());
    }

    get txs(): Key {
        return new Key('txs', this.parts);
    }

    get gasMeter(): Key {
        return new Key('gasMeter', this.parts);
    }

    get minGasPrice(): Key {
        return new Key('minGasPrice', this.parts);
    }

    get lastCommit(): Key {
        return new Key('lastCommit', this.parts);
    }
}

export class BlockHeaderKey extends Key<EthBlockHeader> {

    get parentHash(): Key<string> {
        return new Key<string>('parentHash', this.parts, new StringUnwrap());
    }

    get uncleHash(): Key<string> {
        return new Key<string>('uncleHash', this.parts, new StringUnwrap());
    }

    get coinbase(): Key<string> {
        return new Key<string>('coinbase', this.parts, new StringUnwrap());
    }

    get stateRoot(): Key<string> {
        return new Key<string>('stateRoot', this.parts, new StringUnwrap());
    }

    get transactionsRoot(): Key<string> {
        return new Key<string>('transactionsRoot', this.parts, new StringUnwrap());
    }

    get receiptHash(): Key<string> {
        return new Key<string>('receiptHash', this.parts, new StringUnwrap());
    }

    get difficulty(): Key<u64> {
        return new Key<u64>('difficulty', this.parts, new Uint64Unwrap());
    }

    get number(): Key<u64> {
        return new Key<u64>('number', this.parts, new Uint64Unwrap());
    }

    get gasLimit(): Key<u64> {
        return new Key<u64>('gasLimit', this.parts, new Uint64Unwrap());
    }

    get gasUsed(): Key<u64> {
        return new Key<u64>('gasUsed', this.parts, new Uint64Unwrap());
    }

    get timestamp(): Key<u64> {
        return new Key<u64>('timestamp', this.parts, new Uint64Unwrap());
    }

    get nonce(): Key<u64> {
        return new Key<u64>('nonce', this.parts, new Uint64Unwrap());
    }

    get baseFee(): Key<u64> {
        return new Key<u64>('baseFee', this.parts, new Uint64Unwrap());
    }

    get extraData(): Key<Uint8Array> {
        return new Key<Uint8Array>('extraData', this.parts, new Uint8ArrayUnwrap());
    }

    get mixHash(): Key<Uint8Array> {
        return new Key<Uint8Array>('mixHash', this.parts, new Uint8ArrayUnwrap());
    }

    get withdrawalsRoot(): Key<string> {
        return new Key<string>('withdrawalsRoot', this.parts, new StringUnwrap());
    }

    get excessDataGas(): Key<string> {
        return new Key<string>('excessDataGas', this.parts, new StringUnwrap());
    }
}