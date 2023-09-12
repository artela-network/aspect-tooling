import {CallMessageRequest, CallMessageResponse} from "../proto";
import {Protobuf} from "as-proto/assembly";
import {AUint8Array} from "../types";

declare namespace __EvmCallApi__ {
    function staticCall(request: i32): i32

    function jitCall(request: i32): i32
}

export class StaticCaller {

    public staticCall(request: CallMessageRequest): CallMessageResponse | null {
        const encoded = Protobuf.encode(request, CallMessageRequest.encode);
        const input = new AUint8Array();
        input.set(encoded);
        const inputPtr = input.store();
        const ret = __EvmCallApi__.staticCall(inputPtr);
        const bytes = new AUint8Array();
        bytes.load(ret);
        return Protobuf.decode<CallMessageResponse>(bytes.get(), CallMessageResponse.decode);
    }
}

export class JustInTimeCaller {
    public jitCall(request: CallMessageRequest): CallMessageResponse | null {
        const encoded = Protobuf.encode(request, CallMessageRequest.encode);
        const input = new AUint8Array();
        input.set(encoded);
        const inputPtr = input.store();
        const ret = __EvmCallApi__.jitCall(inputPtr);
        const bytes = new AUint8Array();
        bytes.load(ret);
        return Protobuf.decode<CallMessageResponse>(bytes.get(), CallMessageResponse.decode);
    }
}
