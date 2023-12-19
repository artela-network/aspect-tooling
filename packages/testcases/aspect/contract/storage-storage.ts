
        import {
            BigInt,
            ethereum,
            EthStateChange,
            State,
            StateChange,
            StateKey,
            StateChangeProperties,
            TraceCtx,
            sys
        } from "@artela/aspect-libs";
    export namespace StorageState {
export class deployer extends StateChange<string> {

        constructor(ctx: TraceCtx, addr: string, indices: Uint8Array[] = []) {
            super(new StateChangeProperties(ctx, addr, 'Storage.deployer', indices));
        }
        
        override unmarshalState(raw: EthStateChange) : State<string> {
            return new State(raw.account, sys.utils.uint8ArrayToHex(raw.value), raw.callIndex);
        }
        }
export class number extends StateChange<BigInt> {

        constructor(ctx: TraceCtx, addr: string, indices: Uint8Array[] = []) {
            super(new StateChangeProperties(ctx, addr, 'Storage.number', indices));
        }
        
            override unmarshalState(raw: EthStateChange) : State<BigInt> {
                let valueHex = sys.utils.uint8ArrayToHex(raw.value);
                let value = BigInt.fromString(valueHex, 16);
                return new State(raw.account, value, raw.callIndex);
            }
        }
export class accounts_MappingValue_StructField_id extends StateChange<u64> {

        constructor(ctx: TraceCtx, addr: string, indices: Uint8Array[] = []) {
            super(new StateChangeProperties(ctx, addr, 'Storage.accounts', indices));
        }
        
        override unmarshalState(raw: EthStateChange) : State<u64> {
            let valueHex = sys.utils.uint8ArrayToHex(raw.value);
            let value = BigInt.fromString(valueHex, 16);
            return new State(raw.account, <u64>value.toInt64(), raw.callIndex);
        }
        }
export class accounts_MappingValue_StructField_balance extends StateChange<u32> {

        constructor(ctx: TraceCtx, addr: string, indices: Uint8Array[] = []) {
            super(new StateChangeProperties(ctx, addr, 'Storage.accounts', indices));
        }
        
        override unmarshalState(raw: EthStateChange) : State<u32> {
            let valueHex = sys.utils.uint8ArrayToHex(raw.value);
            let value = BigInt.fromString(valueHex, 16);
            return new State(raw.account, <u32>value.toInt64(), raw.callIndex);
        }
        }
export class accounts_MappingValue {

            public readonly id: accounts_MappingValue_StructField_id;
            
            public readonly balance: accounts_MappingValue_StructField_balance;
            
        constructor(ctx: TraceCtx, addr: string, indices: Uint8Array[] = []) {
        
            this.id = new accounts_MappingValue_StructField_id(ctx, addr,
             sys.utils.arrayCopyPush(indices, sys.utils.stringToUint8Array('id')));
            
            this.balance = new accounts_MappingValue_StructField_balance(ctx, addr,
             sys.utils.arrayCopyPush(indices, sys.utils.stringToUint8Array('balance')));
            }
}
export class accounts extends StateKey<string> {

        constructor(ctx: TraceCtx, addr: string, indices: Uint8Array[] = []) {
            super(new StateChangeProperties(ctx, addr, 'Storage.accounts', indices));
        }
        
            @operator("[]")
            get(key: string): accounts_MappingValue {
                // @ts-ignore
                return new accounts_MappingValue(this.__properties__.ctx, this.__properties__.account, 
                                         sys.utils.arrayCopyPush(this.__properties__.indices, this.parseKey(key)));
            }
        
            protected parseKey(key: string): Uint8Array {
                return sys.utils.stringToUint8Array(key);
            }
        childrenIndexValue(index: u64): ethereum.String {
          return ethereum.String.fromUint8Array(this.__children__[index]);
        }
            childChangeAt(index: u64): accounts_MappingValue {
                // @ts-ignore
                return new accounts_MappingValue(this.__properties__.ctx, this.__properties__.account, 
                                         sys.utils.arrayCopyPush(this.__properties__.indices, this.__children__[index]));
            }
        }
export class _balance_ extends StateChange<BigInt> {

        constructor(ctx: TraceCtx, addr: string, indices: Uint8Array[] = []) {
            super(new StateChangeProperties(ctx, addr, '.balance', indices));
        }
        
            override unmarshalState(raw: EthStateChange) : State<BigInt> {
                let valueHex = sys.utils.uint8ArrayToHex(raw.value);
                let value = BigInt.fromString(valueHex, 16);
                return new State(raw.account, value, raw.callIndex);
            }
        }
}
