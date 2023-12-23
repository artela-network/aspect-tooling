import {
    arrayCopyPush,
    BigInt,
    ethereum,
    EthStateChange,
    State,
    StateChange,
    StateChangeProperties,
    StateKey,
    uint8ArrayToHex,
} from '@artela/aspect-libs';

export namespace HoneyPotState {
    export class balances_MappingValue extends StateChange<BigInt> {
        constructor(addr: string, indices: Uint8Array[] = []) {
            const stateChangeProperties = new StateChangeProperties(
                addr,
                'HoneyPot.balances',
                indices,
            );
            super(stateChangeProperties);
        }

        override unmarshalState(raw: EthStateChange): State<BigInt> {
            const valueHex = uint8ArrayToHex(raw.value);
            const value = BigInt.fromString(valueHex, 16);
            return new State(uint8ArrayToHex(raw.account), value, raw.callIndex);
        }
    }

    export class balances extends StateKey<string> {
        constructor(addr: string, indices: Uint8Array[] = []) {
            const stateChangeProperties = new StateChangeProperties(
                addr,
                'HoneyPot.balances',
                indices,
            );
            super(stateChangeProperties);
        }

        @operator('[]')
        get(key: string): balances_MappingValue {
            return new balances_MappingValue(
                this.__properties__.account,
                arrayCopyPush(this.__properties__.indices, this.parseKey(key)),
            );
        }

        protected parseKey(key: string): Uint8Array {
            return ethereum.Address.fromHexString(key).encodeUint8Array();
        }

        childrenIndexValue(index: u64): ethereum.Address {
            return ethereum.Address.fromUint8Array(this.__children__[index]);
        }

        childChangeAt(index: u64): balances_MappingValue {
            return new balances_MappingValue(
                this.__properties__.account,
                arrayCopyPush(this.__properties__.indices, this.__children__[index]),
            );
        }
    }

    export class _balance_ extends StateChange<BigInt> {
        constructor(addr: string, indices: Uint8Array[] = []) {
            const stateChangeProperties = new StateChangeProperties(addr, '.balances', indices);
            super(stateChangeProperties);
        }

        override unmarshalState(raw: EthStateChange): State<BigInt> {
            const valueHex = uint8ArrayToHex(raw.value);
            const value = BigInt.fromString(valueHex, 16);
            return new State(uint8ArrayToHex(raw.account), value, raw.callIndex);
        }
    }
}
