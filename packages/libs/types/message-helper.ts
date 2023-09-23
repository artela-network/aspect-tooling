import { ABool, AString, AUint8Array } from '.';
import { Protobuf } from 'as-proto/assembly';
import {
  Any,
  AspectResponse,
  RunResult,
  EthBlockAspect,
  EthTxAspect,
  EthTransaction,
} from '../proto';
import { Writer } from 'as-proto/assembly/Writer';

export function LoadEthTxAspect(argPtr: i32): EthTxAspect {
  const encodedArg = new AUint8Array();
  encodedArg.load(argPtr);
  return Protobuf.decode<EthTxAspect>(encodedArg.get(), EthTxAspect.decode);
}
export function LoadEthTransaction(argPtr: i32): EthTransaction {
  const encodedArg = new AUint8Array();
  encodedArg.load(argPtr);
  return Protobuf.decode<EthTransaction>(encodedArg.get(), EthTransaction.decode);
}

export function LoadEthBlockAspect(argPtr: i32): EthBlockAspect {
  const encodedArg = new AUint8Array();
  encodedArg.load(argPtr);
  return Protobuf.decode<EthBlockAspect>(encodedArg.get(), EthBlockAspect.decode);
}

export function LoadInputString(argPtr: i32): string {
  const arg = new AString();
  arg.load(argPtr);
  return arg.get();
}

export function StoreOutputBool(out: bool): i32 {
  const b = new ABool();
  b.set(out);
  return b.store();
}

export function StoreAspectResponse(output: AspectResponse): i32 {
  const encodedOutput = Protobuf.encode(output, AspectResponse.encode);
  const ret = new AUint8Array();

  ret.set(encodedOutput);
  return ret.store();
}

export function DefTrueRunResult(): RunResult {
  return new RunResult(true, 'success');
}

export function ErrorRunResult(errMsg: string): RunResult {
  return new RunResult(false, errMsg);
}

export function NewAspectResponse(
  success: bool,
  msg: string,
  typeUrl: string,
  data: Any,
): AspectResponse {
  const runResult = new RunResult(success, msg);
  return new AspectResponse(runResult, typeUrl, data);
}

export function NewDataResponse<TMessage>(
  success: bool,
  msg: string,
  typeUrl: string,
  message: TMessage,
  encoder: (message: TMessage, writer: Writer) => void,
): AspectResponse {
  const runResult = new RunResult(success, msg);
  const data = ToAny(typeUrl, message, encoder);
  return new AspectResponse(runResult, typeUrl, data);
}

export function DefAspectResponse(): AspectResponse {
  const runResult = DefTrueRunResult();
  return new AspectResponse(runResult);
}
export function ErrAspectResponse(errMsg: string): AspectResponse {
  const runResult = ErrorRunResult(errMsg);
  return new AspectResponse(runResult);
}

export function ToAny<TMessage>(
  typeUrl: string,
  message: TMessage,
  encoder: (message: TMessage, writer: Writer) => void,
): Any {
  const uint8Array = Protobuf.encode(message, encoder);
  return new Any(typeUrl, uint8Array);
}

export class MessageUrlType {
  static StringData: string = 'aspect.v2.StringData';
  static IntData: string = 'aspect.v2.IntData';
  static BoolData: string = 'aspect.v2.BoolData';
  static BytesData: string = 'aspect.v2.BytesData';
}
