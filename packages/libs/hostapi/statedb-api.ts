import { ABool, AU64, AUint8Array } from '../common';

declare namespace __StateDbApi__ {
  function getBalance(addr: i32): i32;

  function getState(addr: i32, hash: i32): i32;

  function getCodeHash(addr: i32): i32;

  function getNonce(addr: i32): i32;

  function getCodeSize(addr: i32): i32;

  function hasSuicided(addr: i32): i32;
}

export class StateDbApi {
  private static _instance: StateDbApi | null;

  private constructor() {}

  public balance(addr: Uint8Array): Uint8Array {
    const input = new AUint8Array();
    input.set(addr);
    const inPtr = input.store();
    const outPtr = __StateDbApi__.getBalance(inPtr);
    const output = new AUint8Array();
    output.load(outPtr);
    return output.get();
  }

  public stateAt(addr: Uint8Array, hash: Uint8Array): Uint8Array {
    const input = new AUint8Array();
    input.set(addr);
    const inPtr = input.store();

    const inpHash = new AUint8Array();
    inpHash.set(hash);
    const inHashPtr = inpHash.store();

    const outPtr = __StateDbApi__.getState(inPtr, inHashPtr);
    const output = new AUint8Array();
    output.load(outPtr);
    return output.get();
  }

  public codeHash(addr: Uint8Array): Uint8Array {
    const input = new AUint8Array();
    input.set(addr);
    const inPtr = input.store();

    const outPtr = __StateDbApi__.getCodeHash(inPtr);
    const output = new AUint8Array();
    output.load(outPtr);
    return output.get();
  }

  public codeSize(addr: Uint8Array): u64 {
    const input = new AUint8Array();
    input.set(addr);
    const inPtr = input.store();

    const outPtr = __StateDbApi__.getCodeSize(inPtr);
    const output = new AU64();
    output.load(outPtr);
    return output.get();
  }

  public nonce(addr: Uint8Array): u64 {
    const input = new AUint8Array();
    input.set(addr);
    const inPtr = input.store();

    const outPtr = __StateDbApi__.getNonce(inPtr);
    const output = new AU64();
    output.load(outPtr);
    return output.get();
  }

  public hasSuicided(addr: Uint8Array): bool {
    const input = new AUint8Array();
    input.set(addr);
    const inPtr = input.store();

    const outPtr = __StateDbApi__.hasSuicided(inPtr);
    const output = new ABool();
    output.load(outPtr);
    return output.get();
  }

  public static instance(): StateDbApi {
    if (!this._instance) {
      this._instance = new StateDbApi();
    }
    return this._instance!;
  }
}
