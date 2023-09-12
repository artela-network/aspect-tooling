import {ABool, AString} from "../types";
import {ContextValue, ToContextValue, ToString} from "./common";

declare namespace __AspectStateApi__ {
    function getAspectState(key: i32): i32

    function setAspectState(key: i32, value: i32): i32

    function removeAspectState(key: i32): i32

    function getProperty(key: i32): i32
}

class AspectProperty {
    public get(key: string): ContextValue {
        const input = new AString();
        input.set(key);
        const inPtr = input.store();
        const outPtr = __AspectStateApi__.getProperty(inPtr);
        const output = new AString();
        output.load(outPtr);
        const newVar = output.get();
        return ToContextValue(newVar)
    }
}

class AspectState {

    public get(key: string): ContextValue {
        const input = new AString();
        input.set(key);
        const inPtr = input.store();
        const outPtr = __AspectStateApi__.getAspectState(inPtr);
        const output = new AString();
        output.load(outPtr);
        const newVar = output.get();
        return ToContextValue(newVar)
    }

    public set<T>(key: string, value: T): bool {
        const inputKey = new AString();
        inputKey.set(key);
        const inPtr = inputKey.store();
        const data = ToString(value);
        const inputValue = new AString();
        inputValue.set(data);
        const ptrValue = inputValue.store();

        const outPtr = __AspectStateApi__.setAspectState(inPtr, ptrValue);
        const output = new ABool();
        output.load(outPtr);
        return output.get();
    }

    public remove(key: string): bool {
        const inputKey = new AString();
        inputKey.set(key);
        const inPtr = inputKey.store();
        const outPtr = __AspectStateApi__.removeAspectState(inPtr);
        const output = new ABool();
        output.load(outPtr);
        return output.get();
    }

}

export const AspectStateProvider = new AspectState();
export const AspectPropertyProvider = new AspectProperty();