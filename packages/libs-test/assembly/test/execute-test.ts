import { Protobuf } from 'as-proto/assembly';
import {
  MessageUrlType,
  ABool,
  AString,
  AUint8Array,
  UtilityProvider,
  Any,
  AspectResponse,
  RunResult,
  StringData,
  EthBlockAspect,
  EthTxAspect,
} from '@artela/aspect-libs';

class ExecuteTest {
  loadAspectInput(argPtr: i32): EthTxAspect {
    const encodedArg = new AUint8Array();
    encodedArg.load(argPtr);
    return Protobuf.decode<EthTxAspect>(encodedArg.get(), EthTxAspect.decode);
  }

  loadBlockAspectInput(argPtr: i32): EthBlockAspect {
    const encodedArg = new AUint8Array();
    encodedArg.load(argPtr);
    return Protobuf.decode<EthBlockAspect>(encodedArg.get(), EthBlockAspect.decode);
  }

  loadInputString(argPtr: i32): string {
    const arg = new AString();
    arg.load(argPtr);
    return arg.get();
  }

  storeOutputBool(out: bool): i32 {
    const b = new ABool();
    b.set(out);
    return b.store();
  }

  storeAspectOutput(output: AspectResponse): i32 {
    const encodedOutput = Protobuf.encode(output, AspectResponse.encode);
    const ret = new AUint8Array();
    ret.set(encodedOutput);
    return ret.store();
  }

  createRunResult(success: bool, msg: string): RunResult {
    return new RunResult(success, msg);
  }

  createAspectResponse(success: bool, msg: string, data: string): AspectResponse {
    const stringData = new StringData(data);
    const uint8Array1 = Protobuf.encode(stringData, StringData.encode);
    const any = new Any(MessageUrlType.StringData, uint8Array1);
    const runResult = this.createRunResult(success, msg);

    return new AspectResponse(runResult, 'StringData', any);
  }

  public execute(methodPtr: i32, argPtr: i32): i32 {
    const methodArg = new AString();
    methodArg.load(methodPtr);
    const method = methodArg.get();
    const arg = this.loadAspectInput(argPtr);
    const log = `arg.tx.blockNumber=  ${arg.tx!.blockNumber}`;
    UtilityProvider.sLog(log);

    const newVar = `${method}  ${arg.tx!.blockNumber}`;
    const aspectResponse1 = this.createAspectResponse(true, '成功了', newVar);

    const value = aspectResponse1.data!.value;
    UtilityProvider.sLog(UtilityProvider.uint8ArrayToHex(value));

    const stringData = Protobuf.decode<StringData>(value, StringData.decode);
    const msg = `stringData ${stringData.data}`;
    UtilityProvider.sLog(msg);

    return this.storeAspectOutput(aspectResponse1);
  }
}

const entry = new ExecuteTest();

export function execute(methodPtr: i32, argPtr: i32): i32 {
  return entry.execute(methodPtr, argPtr);
}

export function allocate(size: i32): i32 {
  return UtilityProvider.alloc(size);
}
