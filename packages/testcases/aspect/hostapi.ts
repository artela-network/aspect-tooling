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
  Uint256,
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

    this.checkStateDB(3);
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

  preTxExecute(input: PreTxExecuteInput): void {
  }

  postTxExecute(_: PostTxExecuteInput): void {
  }

  checkStateDB(offset: u64): void {
    if (!this.checkTest("04")) {
      return;
    }

    const addr = sys.aspect.property.get<Uint8Array>("sender");

    let nonce = sys.hostApi.stateDb.nonce(addr);
    let propNonce = u64.parse(uint8ArrayToHex(sys.aspect.property.get<Uint8Array>("nonce")), 16);
    let expectNonce = propNonce + offset;
    this.assertStr(expectNonce.toString(), nonce.toString(), "nonce");

    const balance = sys.hostApi.stateDb.balance(addr);
    const expectBalance = sys.aspect.property.get<Uint8Array>("balance");
    this.checkDiffs(Uint256.fromHex(uint8ArrayToHex(expectBalance)), Uint256.fromHex(uint8ArrayToHex(balance)));

    const codeSize = sys.hostApi.stateDb.codeSize(addr);
    this.assertStr("0", codeSize.toString(), "code size");

    const emptyCodeHash = "c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470";
    const codeHash = sys.hostApi.stateDb.codeHash(addr);
    this.assert(emptyCodeHash, codeHash, "code hash");

    const hasSuicided = sys.hostApi.stateDb.hasSuicided(addr);
    this.assertBool(false, hasSuicided, "hasSuicided");

    const contractAddr = sys.aspect.property.get<Uint8Array>("contract");
    const hashKey = sys.aspect.property.get<Uint8Array>("hashkey");

    const codeSizeContract = sys.hostApi.stateDb.codeSize(contractAddr);
    this.assertBool(true, codeSizeContract.toString() != emptyCodeHash, "codeSizeContract");

    const codeHashContract = sys.hostApi.stateDb.codeHash(contractAddr);
    this.assert(Uint256.ZERO.toHex(), codeHashContract);

    const hasSuicidedContract = sys.hostApi.stateDb.hasSuicided(contractAddr);
    this.assertBool(false, hasSuicidedContract);
    const state = sys.hostApi.stateDb.stateAt(contractAddr, hashKey);

    sys.require(state.length > 0, 'failed to get state.');
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
    this.assertStr("999999999999", context2.unwrap().toString(), "setContext");
  }

  getContext(): void {
    const context1 = sys.aspect.transientStorage.get<string>("context");
    this.assertStr("0xaaaa", context1.unwrap());
    const context2 = sys.aspect.transientStorage.get<u64>("context-u64")
    this.assertStr("999999999999", context2.unwrap().toString(), "getContext");
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
    this.assertStr("999999999999", state2.unwrap().toString(), "setState-u64");
  }

  getState(): void {
    const state1 = sys.aspect.mutableState.get<string>("state");
    this.assertStr("0x123", state1.unwrap());
    const state2 = sys.aspect.transientStorage.get<u64>("state-u64")
    this.assertStr("999999999999", state2.unwrap().toString(), "getState-u64");
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

    if (test != expect) {
      return false;
    }
    return true;
  }

  checkDiffs(expect: Uint256, actual: Uint256): void {
    const oneArt = new Uint256().fromHex("0xde0b6b3a7640000");
    if (actual.cmp(Uint256.ZERO) > 0 && expect.sub(actual).cmp(oneArt) > 0) {
      let msg = "aspect assert failed, diffs should not more than 1 art, expect " + expect.toHex() + ", got " + actual.toHex();
      sys.revert(msg);
    }
  }

  assert(expect: string, actual: Uint8Array, name: string = ""): void {
    const strAct = uint8ArrayToHex(actual);
    this.assertStr(expect, strAct, name);
  }

  assertBool(expect: bool, actual: bool, name: string = ""): void {
    this.assertStr(expect ? "true" : "false", actual ? "true" : "false", name);
  }

  assertStr(expect: string, actual: string, name: string = ""): void {
    if (expect != actual) {
      let msg = name + ": aspect assert failed, expect " + expect + ", got " + actual;
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
