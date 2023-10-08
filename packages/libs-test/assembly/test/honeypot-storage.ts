import {
    BigInt,
    ethereum,
    EthStateChange,
    State,
    StateChange,
    StateChangeProperties,
    StateKey,
    sys,
    TraceQuery,
} from "@artela/aspect-libs";

export namespace HoneyPotState {
    export class balances_MappingValue extends StateChange<BigInt> {

        constructor(ctx: TraceQuery, addr: string, indices: Uint8Array[] = []) {
            const stateChangeProperties = new StateChangeProperties(ctx, addr, 'HoneyPot.balances', indices);
            super(stateChangeProperties);
        }

        override unmarshalState(raw: EthStateChange): State<BigInt> {
            const valueHex = sys.common.utils.uint8ArrayToHex(raw.value);
            const value = BigInt.fromString(valueHex, 16);
            return new State(raw.account, value, raw.callIndex);
        }
    }

    export class balances extends StateKey<string> {

        constructor(ctx: TraceQuery, addr: string, indices: Uint8Array[] = []) {
            const stateChangeProperties = new StateChangeProperties(ctx, addr, 'HoneyPot.balances', indices);
            super(stateChangeProperties);
        }

        @operator("[]")
        get(key: string): balances_MappingValue {
            return new balances_MappingValue(this.__properties__.ctx, this.__properties__.account,
                sys.common.utils.arrayCopyPush(this.__properties__.indices, this.parseKey(key)));
        }

        protected parseKey(key: string): Uint8Array {
            return ethereum.Address.fromHexString(key).encodeUint8Array();
        }

        childrenIndexValue(index: u64): ethereum.Address {
            return ethereum.Address.fromUint8Array(this.__children__[index]);
        }

        childChangeAt(index: u64): balances_MappingValue {
            return new balances_MappingValue(this.__properties__.ctx, this.__properties__.account,
                sys.common.utils.arrayCopyPush(this.__properties__.indices, this.__children__[index]));
        }
    }

    export class _balance_ extends StateChange<BigInt> {

        constructor(ctx: TraceQuery, addr: string, indices: Uint8Array[] = []) {
            const stateChangeProperties = new StateChangeProperties(ctx, addr, '.balances', indices);
            super(stateChangeProperties);
        }

        override unmarshalState(raw: EthStateChange): State<BigInt> {
            const valueHex = sys.common.utils.uint8ArrayToHex(raw.value);
            const value = BigInt.fromString(valueHex, 16);
            return new State(raw.account, value, raw.callIndex);
        }
    }
}
