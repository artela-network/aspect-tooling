import { ABool, AString, AUint8Array } from '../wraptypes/basic-types';
import { Protobuf } from 'as-proto/assembly';
import {
  Any,
  AspectResponse,
  EthBlockAspect,
  EthTransaction,
  EthTxAspect,
  RunResult,
} from '../../proto';
import { Writer } from 'as-proto/assembly/Writer';

export class MessageUtil {
  private static _instance: MessageUtil | null;

  private constructor() {}

  public static instance(): MessageUtil {
    if (!this._instance) {
      this._instance = new MessageUtil();
    }
    return this._instance!;
  }

  public LoadEthTxAspect(argPtr: i32): EthTxAspect {
    const encodedArg = new AUint8Array();
    encodedArg.load(argPtr);
    return Protobuf.decode<EthTxAspect>(encodedArg.get(), EthTxAspect.decode);
  }

  public LoadEthTransaction(argPtr: i32): EthTransaction {
    const encodedArg = new AUint8Array();
    encodedArg.load(argPtr);
    return Protobuf.decode<EthTransaction>(encodedArg.get(), EthTransaction.decode);
  }

  public LoadEthBlockAspect(argPtr: i32): EthBlockAspect {
    const encodedArg = new AUint8Array();
    encodedArg.load(argPtr);
    return Protobuf.decode<EthBlockAspect>(encodedArg.get(), EthBlockAspect.decode);
  }

  public LoadInputString(argPtr: i32): string {
    const arg = new AString();
    arg.load(argPtr);
    return arg.get();
  }

  public StoreOutputBool(out: bool): i32 {
    const b = new ABool();
    b.set(out);
    return b.store();
  }

  public StoreAspectResponse(output: AspectResponse): i32 {
    const encodedOutput = Protobuf.encode(output, AspectResponse.encode);
    const ret = new AUint8Array();

    ret.set(encodedOutput);
    return ret.store();
  }

  public DefTrueRunResult(): RunResult {
    return new RunResult(true, 'success');
  }

  public ErrorRunResult(errMsg: string): RunResult {
    return new RunResult(false, errMsg);
  }

  public NewAspectResponse(success: bool, msg: string, typeUrl: string, data: Any): AspectResponse {
    const runResult = new RunResult(success, msg);
    return new AspectResponse(runResult, typeUrl, data);
  }

  public NewDataResponse<TMessage>(
    success: bool,
    msg: string,
    typeUrl: string,
    message: TMessage,
    encoder: (message: TMessage, writer: Writer) => void,
  ): AspectResponse {
    const runResult = new RunResult(success, msg);
    const data = this.ToAny(typeUrl, message, encoder);
    return new AspectResponse(runResult, typeUrl, data);
  }

  public DefAspectResponse(): AspectResponse {
    const runResult = this.DefTrueRunResult();
    return new AspectResponse(runResult);
  }

  public ErrAspectResponse(errMsg: string): AspectResponse {
    const runResult = this.ErrorRunResult(errMsg);
    return new AspectResponse(runResult);
  }

  public ToAny<TMessage>(
    typeUrl: string,
    message: TMessage,
    encoder: (message: TMessage, writer: Writer) => void,
  ): Any {
    const uint8Array = Protobuf.encode(message, encoder);
    return new Any(typeUrl, uint8Array);
  }

  public StringData: string = 'aspect.v2.StringData';
  public IntData: string = 'aspect.v2.IntData';
  public BoolData: string = 'aspect.v2.BoolData';
  public BytesData: string = 'aspect.v2.BytesData';
  public SateChangeQuery: string = 'aspect.v2.SateChangeQuery';
  public CallStackQuery: string = 'aspect.v2.CallStackQuery';
}
