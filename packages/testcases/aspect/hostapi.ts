// The entry file of your WebAssembly module.

import {
  allocate,
  entryPoint,
  execute,
  IAspectOperation,
  InitInput,
  IPostContractCallJP,
  IPostTxExecuteJP,
  IPreContractCallJP,
  IPreTxExecuteJP,
  ITransactionVerifier,
  OperationInput,
  PostContractCallInput,
  PostTxExecuteInput,
  PreContractCallInput,
  PreTxExecuteInput,
  TxVerifyInput,
  sys,
  uint8ArrayToHex,
  hexToUint8Array,
} from '@artela/aspect-libs';

class HostApiAspect implements
  IAspectOperation,
  IPreContractCallJP,
  IPostContractCallJP,
  IPreTxExecuteJP,
  IPostTxExecuteJP,
  ITransactionVerifier {
  init(input: InitInput): void { }

  isOwner(sender: Uint8Array): bool {
    this.checkPoperty();

    const value = sys.aspect.property.get<Uint8Array>("owner");
    return uint8ArrayToHex(value) == uint8ArrayToHex(sender);
  }

  verifyTx(input: TxVerifyInput): Uint8Array {
    return sys.aspect.mutableState.get<Uint8Array>('owner').unwrap();
  }

  operation(input: OperationInput): Uint8Array {
    this.checkPoperty();
    this.checkState(true);
    this.checkState(false);

    const test = uint8ArrayToHex(sys.aspect.property.get<Uint8Array>("set"));
    const calldata = uint8ArrayToHex(input.callData);
    if (calldata == "0001100001") {
      this.checkContext(true);
    } else {
      this.checkContext(false);
    }
    return input.callData;
  }

  preContractCall(_: PreContractCallInput): void {
    this.checkPoperty();
    this.checkContext(true);
  }

  postContractCall(_: PostContractCallInput): void {
    this.checkState(false);
    this.checkState(true);
    this.checkState(false);
    this.checkContext(false);
  }

  preTxExecute(_: PreTxExecuteInput): void {
  }

  postTxExecute(_: PostTxExecuteInput): void {
  }

  checkContext(set: bool): void {
    if (!this.checkTest("03")) {
      return;
    }

    if (set) {
      this.setContext();
    } else {
      this.getContext();
    }
  }

  setContext(): void {
    const context1 = sys.aspect.transientStorage.get<string>("context")
    context1.set<string>("0xaaaa");
    this.assertStr("0xaaaa", context1.unwrap());
    const context2 = sys.aspect.transientStorage.get<u64>("context-u64")
    context2.set<u64>(999999999999);
    this.assertStr("999999999999", context2.unwrap().toString());
  }

  getContext(): void {
    const context1 = sys.aspect.transientStorage.get<string>("context");
    this.assertStr("0xaaaa", context1.unwrap());
    const context2 = sys.aspect.transientStorage.get<u64>("context-u64")
    this.assertStr("999999999999", context2.unwrap().toString());
  }

  checkState(set: bool): void {
    if (!this.checkTest("02")) {
      return;
    }
    if (set) {
      this.setState()
    } else {
      this.getState()
    }
  }

  setState(): void {
    const state1 = sys.aspect.mutableState.get<string>("state")
    state1.set<string>("0x123");
    this.assertStr("0x123", state1.unwrap());
    const state2 = sys.aspect.transientStorage.get<u64>("state-u64")
    state2.set<u64>(999999999999);
    this.assertStr("999999999999", state2.unwrap().toString());
  }

  getState(): void {
    const state1 = sys.aspect.mutableState.get<string>("state");
    this.assertStr("0x123", state1.unwrap());
    const state2 = sys.aspect.transientStorage.get<u64>("state-u64")
    this.assertStr("999999999999", state2.unwrap().toString());
  }

  checkPoperty(): void {
    if (!this.checkTest("01")) {
      return;
    }
    const testu64 = sys.aspect.property.get<u64>("test");
    const testi64 = sys.aspect.property.get<i64>("test");
    const testi32 = sys.aspect.property.get<i32>("test");
    const testu32 = sys.aspect.property.get<u32>("test");
    if (testu64 != 1 || testi64 != 1 || testi32 != 1 || testu32 != 1) {
      sys.revert("aspect assert failed, expect test value 1, got " + testu64.toString());
    }

    const prop1 = sys.aspect.property.get<Uint8Array>("prop-key1");
    this.assert("1234567890abcdef", prop1);
    const prop2 = sys.aspect.property.get<Uint8Array>("prop-key2");
    this.assert("abcdefabcdef", prop2);
  }

  checkTest(expect: string): bool {
    const test = uint8ArrayToHex(sys.aspect.property.get<Uint8Array>("test"));
    sys.log("_____________test: " + test.toString());
    if (test != expect) {
      return false;
    }
    return true;
  }

  assert(expect: string, actual: Uint8Array): void {
    const strAct = uint8ArrayToHex(actual);
    this.assertStr(expect, strAct);
  }

  assertStr(expect: string, actual: string): void {
    if (expect != actual) {
      let msg = "aspect assert failed, expect " + expect + ", got " + actual;
      sys.revert(msg);
      return;
    }
  }
}
// 2.register aspect Instance
const aspect = new HostApiAspect();
entryPoint.setOperationAspect(aspect);
entryPoint.setAspect(aspect);

// 3.must export it
export { execute, allocate };
