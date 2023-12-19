
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
    export namespace ScheduleTargetState {
export class number extends StateChange<BigInt> {

        constructor(ctx: TraceCtx, addr: string, indices: Uint8Array[] = []) {
            super(new StateChangeProperties(ctx, addr, 'ScheduleTarget.number', indices));
        }
        
            override unmarshalState(raw: EthStateChange) : State<BigInt> {
                let valueHex = sys.utils.uint8ArrayToHex(raw.value);
                let value = BigInt.fromString(valueHex, 16);
                return new State(raw.account, value, raw.callIndex);
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
