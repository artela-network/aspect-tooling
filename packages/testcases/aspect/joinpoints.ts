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
  BoolData,
  StringData,
} from '@artela/aspect-libs';

import { Protobuf } from 'as-proto/assembly';

class Joinpoints implements
  IAspectOperation,
  IPreContractCallJP,
  IPostContractCallJP,
  IPreTxExecuteJP,
  IPostTxExecuteJP,
  ITransactionVerifier {
  init(input: InitInput): void {
    this.checkInput(input.block!.number, input.tx!.from, input.tx!.to, input.tx!.hash, "init");
  }

  isOwner(sender: Uint8Array): bool {
    const value = sys.aspect.property.get<Uint8Array>("owner");
    return uint8ArrayToHex(value) == uint8ArrayToHex(sender);
  }

  verifyTx(input: TxVerifyInput): Uint8Array {
    const notEmptyAddress = hexToUint8Array("0000000000000000000000000000000000000001");
    this.checkInput(input.block!.number, notEmptyAddress, input.tx!.to, input.tx!.hash, "verifyTx");

    const strBlockNum = "input.block.number:" + input.block!.number.toString();
    const strTxTo = "input.tx.to:" + input.tx!.to.toString();
    const strTxHash = "input.tx.hash:" + input.tx!.hash.toString();

    const keys = [
      "isCall",
      "tx.type",
      "tx.chainId",
      "tx.accessList",
      "tx.nonce",
      "tx.gasPrice",
      "tx.gas",
      "tx.gasTipCap",
      "tx.gasFeeCap",
      "tx.to",
      "tx.value",
      "tx.data",
      "tx.bytes",
      "tx.hash",
      "tx.unsigned.bytes",
      "tx.unsigned.hash",
      "block.header.number",
      "env.extraEIPs",
      "env.enableCreate",
      "env.enableCall",
      "env.allowUnprotectedTxs",
      "env.chain.chainId",
      "env.chain.homesteadBlock",
      "env.chain.daoForkBlock",
      "env.chain.daoForkSupport",
      "env.chain.eip150Block",
      "env.chain.eip155Block",
      "env.chain.eip158Block",
      "env.chain.byzantiumBlock",
      "env.chain.constantinopleBlock",
      "env.chain.petersburgBlock",
      "env.chain.istanbulBlock",
      "env.chain.muirGlacierBlock",
      "env.chain.berlinBlock",
      "env.chain.londonBlock",
      "env.chain.arrowGlacierBlock",
      "env.chain.grayGlacierBlock",
      "env.chain.mergeNetSplitBlock",
      "env.chain.shanghaiTime",
      "env.chain.cancunTime",
      "env.chain.pragueTime",
      "env.consensusParams.block.maxGas",
      "env.consensusParams.block.maxBytes",
      "env.consensusParams.evidence.maxAgeDuration",
      "env.consensusParams.evidence.maxAgeNumBlocks",
      "env.consensusParams.evidence.maxBytes",
      "env.consensusParams.validator.pubKeyTypes",
      "env.consensusParams.appVersion",
      "aspect.id",
      "aspect.version"
    ];

    // this.checkSys("verifyTx", keys, strBlockNum + ";" + strTxTo + ";" + strTxHash);

    return sys.aspect.mutableState.get<Uint8Array>('owner').unwrap();
  }

  operation(input: OperationInput): Uint8Array {
    this.checkInput(input.block!.number, input.tx!.from, input.tx!.to, input.tx!.hash, "operation");

    const strBlockNum = "input.block.number:" + input.block!.number.toString();
    const strTxFrom = "input.tx.from:" + input.tx!.from.toString();
    const strTxTo = "input.tx.to:" + input.tx!.to.toString();
    const strTxHash = "input.tx.hash:" + input.tx!.hash.toString();

    const keys = [
      "isCall",
      "tx.type",
      "tx.chainId",
      "tx.accessList",
      "tx.nonce",
      "tx.gasPrice",
      "tx.gas",
      "tx.gasTipCap",
      "tx.gasFeeCap",
      "tx.to",
      "tx.value",
      "tx.data",
      "tx.bytes",
      "tx.hash",
      "tx.unsigned.bytes",
      "tx.unsigned.hash",
      "block.header.number",
      "env.extraEIPs",
      "env.enableCreate",
      "env.enableCall",
      "env.allowUnprotectedTxs",
      "env.chain.chainId",
      "env.chain.homesteadBlock",
      "env.chain.daoForkBlock",
      "env.chain.daoForkSupport",
      "env.chain.eip150Block",
      "env.chain.eip155Block",
      "env.chain.eip158Block",
      "env.chain.byzantiumBlock",
      "env.chain.constantinopleBlock",
      "env.chain.petersburgBlock",
      "env.chain.istanbulBlock",
      "env.chain.muirGlacierBlock",
      "env.chain.berlinBlock",
      "env.chain.londonBlock",
      "env.chain.arrowGlacierBlock",
      "env.chain.grayGlacierBlock",
      "env.chain.mergeNetSplitBlock",
      "env.chain.shanghaiTime",
      "env.chain.cancunTime",
      "env.chain.pragueTime",
      "env.consensusParams.block.maxGas",
      "env.consensusParams.block.maxBytes",
      "env.consensusParams.evidence.maxAgeDuration",
      "env.consensusParams.evidence.maxAgeNumBlocks",
      "env.consensusParams.evidence.maxBytes",
      "env.consensusParams.validator.pubKeyTypes",
      "env.consensusParams.appVersion",
      "aspect.id",
      "aspect.version"
    ];
    // this.checkSys("operation", keys, strBlockNum + ";" + strTxFrom + ";" + strTxTo + ";" + strTxHash);

    return input.callData;
  }

  preContractCall(input: PreContractCallInput): void {
    const notEmptyHash = Uint256.fromInt64(1).toUint8Array();
    this.checkInput(input.block!.number, input.call!.from, input.call!.to, notEmptyHash, "PreContractCallInput");
    this.assert(input.call!.gas > 0, "PostContractCallInput, gas large than zero");

    const strBlockNum = "input.block.number:" + input.block!.number.toString();
    const strTxFrom = "input.call.from:" + input.call!.from.toString();
    const strTxTo = "input.call.to:" + input.call!.to.toString();
    const strTxGas = "input.call.gas:" + input.call!.gas.toString();

    const keys = [
      "isCall",
      "tx.type",
      "tx.chainId",
      "tx.accessList",
      "tx.nonce",
      "tx.gasPrice",
      "tx.gas",
      "tx.gasTipCap",
      "tx.gasFeeCap",
      "tx.to",
      "tx.value",
      "tx.data",
      "tx.bytes",
      "tx.hash",
      "tx.unsigned.bytes",
      "tx.unsigned.hash",
      "tx.sig.v",
      "tx.sig.r",
      "tx.sig.s",
      "tx.from",
      "tx.index",
      "block.header.parentHash",
      "block.header.miner",
      "block.header.number",
      "block.header.timestamp",
      "env.extraEIPs",
      "env.enableCreate",
      "env.enableCall",
      "env.allowUnprotectedTxs",
      "env.chain.chainId",
      "env.chain.homesteadBlock",
      "env.chain.daoForkBlock",
      "env.chain.daoForkSupport",
      "env.chain.eip150Block",
      "env.chain.eip155Block",
      "env.chain.eip158Block",
      "env.chain.byzantiumBlock",
      "env.chain.constantinopleBlock",
      "env.chain.petersburgBlock",
      "env.chain.istanbulBlock",
      "env.chain.muirGlacierBlock",
      "env.chain.berlinBlock",
      "env.chain.londonBlock",
      "env.chain.arrowGlacierBlock",
      "env.chain.grayGlacierBlock",
      "env.chain.mergeNetSplitBlock",
      "env.chain.shanghaiTime",
      "env.chain.cancunTime",
      "env.chain.pragueTime",
      "env.consensusParams.block.maxGas",
      "env.consensusParams.block.maxBytes",
      "env.consensusParams.evidence.maxAgeDuration",
      "env.consensusParams.evidence.maxAgeNumBlocks",
      "env.consensusParams.evidence.maxBytes",
      "env.consensusParams.validator.pubKeyTypes",
      "env.consensusParams.appVersion",
      "aspect.id",
      "aspect.version",
      "msg.from",
      "msg.to",
      "msg.value",
      "msg.gas",
      "msg.input",
      "msg.index"
      // "msg.result.ret",
      // "msg.result.gasUsed",
      // "msg.result.error"
    ];

    // this.checkSys("preContractCall", keys, strBlockNum + ";" + strTxFrom + ";" + strTxTo + ";" + strTxGas);
  }

  postContractCall(input: PostContractCallInput): void {
    const notEmptyHash = Uint256.fromInt64(1).toUint8Array();
    this.checkInput(input.block!.number, input.call!.from, input.call!.to, notEmptyHash, "PostContractCallInput");
    this.assert(input.call!.gas > 0, "PostContractCallInput, gas large than zero");

    const strBlockNum = "input.block.number:" + input.block!.number.toString();
    const strTxFrom = "input.call.from:" + input.call!.from.toString();
    const strTxTo = "input.call.to:" + input.call!.to.toString();
    const strTxGas = "input.call.gas:" + input.call!.gas.toString();

    const keys = [
      "isCall",
      "tx.type",
      "tx.chainId",
      "tx.accessList",
      "tx.nonce",
      "tx.gasPrice",
      "tx.gas",
      "tx.gasTipCap",
      "tx.gasFeeCap",
      "tx.to",
      "tx.value",
      "tx.data",
      "tx.bytes",
      "tx.hash",
      "tx.unsigned.bytes",
      "tx.unsigned.hash",
      "tx.sig.v",
      "tx.sig.r",
      "tx.sig.s",
      "tx.from",
      "tx.index",
      "aspect.id",
      "aspect.version",
      "msg.from",
      "msg.to",
      "msg.value",
      "msg.gas",
      "msg.input",
      "msg.index",
      "msg.result.ret",
      "msg.result.gasUsed",
      "msg.result.error",
      "block.header.parentHash",
      "block.header.miner",
      "block.header.number",
      "block.header.timestamp",
      "env.extraEIPs",
      "env.enableCreate",
      "env.enableCall",
      "env.allowUnprotectedTxs",
      "env.chain.chainId",
      "env.chain.homesteadBlock",
      "env.chain.daoForkBlock",
      "env.chain.daoForkSupport",
      "env.chain.eip150Block",
      "env.chain.eip155Block",
      "env.chain.eip158Block",
      "env.chain.byzantiumBlock",
      "env.chain.constantinopleBlock",
      "env.chain.petersburgBlock",
      "env.chain.istanbulBlock",
      "env.chain.muirGlacierBlock",
      "env.chain.berlinBlock",
      "env.chain.londonBlock",
      "env.chain.arrowGlacierBlock",
      "env.chain.grayGlacierBlock",
      "env.chain.mergeNetSplitBlock",
      "env.chain.shanghaiTime",
      "env.chain.cancunTime",
      "env.chain.pragueTime",
      "env.consensusParams.block.maxGas",
      "env.consensusParams.block.maxBytes",
      "env.consensusParams.evidence.maxAgeDuration",
      "env.consensusParams.evidence.maxAgeNumBlocks",
      "env.consensusParams.evidence.maxBytes",
      "env.consensusParams.validator.pubKeyTypes",
      "env.consensusParams.appVersion"
    ];

    // this.checkSys("postContractCall", keys, strBlockNum + ";" + strTxFrom + ";" + strTxTo + ";" + strTxGas);
  }

  preTxExecute(input: PreTxExecuteInput): void {
    this.checkInput(input.block!.number, input.tx!.from, input.tx!.to, input.tx!.hash, "PreTxExecuteInput");

    const strBlockNum = "input.block.number:" + input.block!.number.toString();
    const strTxFrom = "input.tx.from:" + input.tx!.from.toString();
    const strTxTo = "input.tx.to:" + input.tx!.to.toString();
    const strTxHash = "input.tx.hash:" + input.tx!.hash.toString();

    const keys = [
      "isCall",
      "tx.type",
      "tx.chainId",
      "tx.accessList",
      "tx.nonce",
      "tx.gasPrice",
      "tx.gas",
      "tx.gasTipCap",
      "tx.gasFeeCap",
      "tx.to",
      "tx.value",
      "tx.data",
      "tx.bytes",
      "tx.hash",
      "tx.unsigned.bytes",
      "tx.unsigned.hash",
      "tx.sig.v",
      "tx.sig.r",
      "tx.sig.s",
      "tx.from",
      "tx.index",
      "block.header.parentHash",
      "block.header.miner",
      "block.header.number",
      "block.header.timestamp",
      "env.extraEIPs",
      "env.enableCreate",
      "env.enableCall",
      "env.allowUnprotectedTxs",
      "env.chain.chainId",
      "env.chain.homesteadBlock",
      "env.chain.daoForkBlock",
      "env.chain.daoForkSupport",
      "env.chain.eip150Block",
      "env.chain.eip155Block",
      "env.chain.eip158Block",
      "env.chain.byzantiumBlock",
      "env.chain.constantinopleBlock",
      "env.chain.petersburgBlock",
      "env.chain.istanbulBlock",
      "env.chain.muirGlacierBlock",
      "env.chain.berlinBlock",
      "env.chain.londonBlock",
      "env.chain.arrowGlacierBlock",
      "env.chain.grayGlacierBlock",
      "env.chain.mergeNetSplitBlock",
      "env.chain.shanghaiTime",
      "env.chain.cancunTime",
      "env.chain.pragueTime",
      "env.consensusParams.block.maxGas",
      "env.consensusParams.block.maxBytes",
      "env.consensusParams.evidence.maxAgeDuration",
      "env.consensusParams.evidence.maxAgeNumBlocks",
      "env.consensusParams.evidence.maxBytes",
      "env.consensusParams.validator.pubKeyTypes",
      "env.consensusParams.appVersion",
      "aspect.id",
      "aspect.version"
    ];

    // this.checkSys("preTxExecute", keys, strBlockNum + ";" + strTxFrom + ";" + strTxTo + ";" + strTxHash);
  }

  postTxExecute(input: PostTxExecuteInput): void {
    this.checkInput(input.block!.number, input.tx!.from, input.tx!.to, input.tx!.hash, "PostTxExecuteInput");

    const strBlockNum = "input.block.number:" + input.block!.number.toString();
    const strTxFrom = "input.tx.from:" + input.tx!.from.toString();
    const strTxTo = "input.tx.to:" + input.tx!.to.toString();
    const strTxHash = "input.tx.hash:" + input.tx!.hash.toString();

    const keys = [
      "isCall",
      "tx.type",
      "tx.chainId",
      "tx.accessList",
      "tx.nonce",
      "tx.gasPrice",
      "tx.gas",
      "tx.gasTipCap",
      "tx.gasFeeCap",
      "tx.to",
      "tx.value",
      "tx.data",
      "tx.bytes",
      "tx.hash",
      "tx.unsigned.bytes",
      "tx.unsigned.hash",
      "tx.sig.v",
      "tx.sig.r",
      "tx.sig.s",
      "tx.from",
      "tx.index",
      "block.header.parentHash",
      "block.header.miner",
      "block.header.number",
      "block.header.timestamp",
      "env.extraEIPs",
      "env.enableCreate",
      "env.enableCall",
      "env.allowUnprotectedTxs",
      "env.chain.chainId",
      "env.chain.homesteadBlock",
      "env.chain.daoForkBlock",
      "env.chain.daoForkSupport",
      "env.chain.eip150Block",
      "env.chain.eip155Block",
      "env.chain.eip158Block",
      "env.chain.byzantiumBlock",
      "env.chain.constantinopleBlock",
      "env.chain.petersburgBlock",
      "env.chain.istanbulBlock",
      "env.chain.muirGlacierBlock",
      "env.chain.berlinBlock",
      "env.chain.londonBlock",
      "env.chain.arrowGlacierBlock",
      "env.chain.grayGlacierBlock",
      "env.chain.mergeNetSplitBlock",
      "env.chain.shanghaiTime",
      "env.chain.cancunTime",
      "env.chain.pragueTime",
      "env.consensusParams.block.maxGas",
      "env.consensusParams.block.maxBytes",
      "env.consensusParams.evidence.maxAgeDuration",
      "env.consensusParams.evidence.maxAgeNumBlocks",
      "env.consensusParams.evidence.maxBytes",
      "env.consensusParams.validator.pubKeyTypes",
      "env.consensusParams.appVersion",
      "aspect.id",
      "aspect.version",
      "receipt.status",
      "receipt.logs",
      "receipt.gasUsed",
      "receipt.cumulativeGasUsed",
      "receipt.bloom"
    ];

    // this.checkSys("postTxExecute", keys, strBlockNum + ";" + strTxFrom + ";" + strTxTo + ";" + strTxHash);
  }

  checkInput(blockNumber: u64, txFrom: Uint8Array, txTo: Uint8Array, txHash: Uint8Array, name: string): void {
    const isCallData = sys.hostApi.runtimeContext.get("isCall");
    const isCall = Protobuf.decode<BoolData>(isCallData, BoolData.decode).data;
    if (isCall) {
      return;
    }

    const emptyHash = "0000000000000000000000000000000000000000000000000000000000000000";
    const emptyAddress = "0000000000000000000000000000000000000000";

    this.assert(blockNumber > 0, name + ", block.number should large than zero");
    this.assert(uint8ArrayToHex(txFrom) != emptyAddress, name + ", from should not empty");
    this.assert(uint8ArrayToHex(txTo) != emptyAddress, name + ", to should not empty");
    this.assert(uint8ArrayToHex(txHash) != emptyHash, name + ", txhash should not empty");
  }

  checkSys(jp: string, keys: string[], others: string): void {
    const aspectID = sys.aspect.id();
    this.assert(aspectID != "", "sys.aspect.id");

    const aspectVer = sys.aspect.version();
    this.assert(aspectVer == 1, "sys.aspect.version");

    let str: string = "";
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      // sys.log("joinpoints, get cotnext key: " + key);
      const data = sys.hostApi.runtimeContext.get(key);
      if (!data || data.length == 0) {
        const kvstr = key + ":" + "null" + ";";
        str = str.concat(kvstr);
        continue
      }
      const value = uint8ArrayToHex(data);
      const kvstr = "|" + key + "|" + value + "|;";
      sys.log("joinpoints, get cotnext key: " + key + ", value: " + value);
      str = str.concat(kvstr);
    }

    str = str.concat(others);

    const savedContext = sys.aspect.mutableState.get<string>("savedContext-" + jp);
    if (savedContext.unwrap() != "") {
      this.assertStr(savedContext.unwrap(), str, "check sys.context");
    } else {
      savedContext.set<string>(str);
    }
  }

  assertStr(expect: string, actual: string, name: string = ""): void {
    if (expect != actual) {
      let msg = name + ": aspect assert failed, expect:\n" + expect + ", got:\n" + actual;
      sys.revert(msg);
      return;
    }
  }

  assert(equal: bool, name: string = ""): void {
    if (!equal) {
      let msg = "assert failed: " + name;
      sys.revert(msg);
      return;
    }
  }
}
// 2.register aspect Instance
const aspect = new Joinpoints();
entryPoint.setOperationAspect(aspect);
entryPoint.setAspect(aspect);

// 3.must export it
export { execute, allocate };
