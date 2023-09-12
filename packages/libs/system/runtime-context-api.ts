import {
    ContextQueryRequest,
    ContextQueryResponse,
    DataSpaceType,
    StringData
} from "../proto";
import {Protobuf} from "as-proto/assembly";
import {ABool, AString, AUint8Array} from "../types";
import {ContextValue, ToString} from "./common";


declare namespace __RuntimeContextApi__ {
    function get(query: i32): i32

    function setAspectContext(key: i32, value: i32): i32
}

class RuntimeContext {
    public get(dataSpace: DataSpaceType, keys: Array<string>): ContextQueryResponse | null {
        const contextQueryRequest = new ContextQueryRequest();
        contextQueryRequest.dataSpace = dataSpace;
        contextQueryRequest.conditions = keys
        const encoded = Protobuf.encode(contextQueryRequest, ContextQueryRequest.encode);
        const input = new AUint8Array();
        input.set(encoded);
        const inputPtr = input.store();
        const ret = __RuntimeContextApi__.get(inputPtr);
        const bytes = new AUint8Array();
        bytes.load(ret);
        return Protobuf.decode<ContextQueryResponse>(bytes.get(), ContextQueryResponse.decode);
    }
}


export class AspectContext {
    public get(key: string): ContextValue | null {
        const array = new Array<string>(1);
        array.push(key);
        const response = RuntimeContextAccessor.get(DataSpaceType.TX_ASPECT_CONTEXT, array);
        if (!response.data.value) {
            return null
        }
        const stringData = Protobuf.decode<StringData>(response.data.value, StringData.decode);
        return new ContextValue(stringData.data)
    }

    public set<T>(key: string, value: T): bool {
        const inputKey = new AString();
        inputKey.set(key);
        const inPtr = inputKey.store();

        const inputValue = new AString();
        const dataStr = ToString(value);
        inputValue.set(dataStr);
        const ptrValue = inputValue.store();
        const outPtr = __RuntimeContextApi__.setAspectContext(inPtr, ptrValue);
        const output = new ABool();
        output.load(outPtr);
        return output.get();
    }
}

export const RuntimeContextAccessor = new RuntimeContext();


