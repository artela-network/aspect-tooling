import {AI64, AString} from "../types";

declare namespace __StateDbApi__ {

    function getBalance(addr: i32): i32

    function getState(addr: i32, hash: i32): i32

    function getRefund(): i32

    function getCodeHash(addr: i32): i32

    function getNonce(addr: i32): i32

}

class StatedbApi {
    public getBalance(addr: string): string {
        const input = new AString();
        input.set(addr);
        const inPtr = input.store();
        const outPtr = __StateDbApi__.getBalance(inPtr);
        const output = new AString();
        output.load(outPtr);
        return output.get();
    }

    public getState(addr: string, hash: string): string {
        const input = new AString();
        input.set(addr);
        const inPtr = input.store();

        const inpHash = new AString();
        inpHash.set(hash);
        const inHashPtr = inpHash.store();

        const outPtr = __StateDbApi__.getState(inPtr, inHashPtr);
        const output = new AString();
        output.load(outPtr);
        return output.get();
    }

    public getRefund(): i64 {
        const outPtr = __StateDbApi__.getRefund();
        const output = new AI64();
        output.load(outPtr);
        return output.get();
    }

    public getCodeHash(addr: string): string {
        const input = new AString();
        input.set(addr);
        const inPtr = input.store();

        const outPtr = __StateDbApi__.getCodeHash(inPtr);
        const output = new AString();
        output.load(outPtr);
        return output.get();
    }

    public getNonce(addr: string): i64 {
        const input = new AString();
        input.set(addr);
        const inPtr = input.store();

        const outPtr = __StateDbApi__.getNonce(inPtr);
        const output = new AI64();
        output.load(outPtr);
        return output.get();
    }
}

export const StateDbAccessor = new StatedbApi();