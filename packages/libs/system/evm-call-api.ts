import {
  CallMessageRequest,
  CallMessageResponse,
  JitInherentRequest,
  JitInherentResponse,
} from '../proto';
import { Protobuf } from 'as-proto/assembly';
import { AUint8Array } from '../types';

declare namespace __EvmCallApi__ {
  function staticCall(request: i32): i32;

  function jitCall(request: i32): i32;
}

export class StaticCaller {
  private static instance: StaticCaller;

  private constructor() {}

  public staticCall(request: CallMessageRequest): CallMessageResponse | null {
    const encoded = Protobuf.encode(request, CallMessageRequest.encode);
    const input = new AUint8Array();
    input.set(encoded);
    const inputPtr = input.store();
    const ret = __EvmCallApi__.staticCall(inputPtr);
    const bytes = new AUint8Array();
    bytes.load(ret);
    return Protobuf.decode<CallMessageResponse>(bytes.get(), CallMessageResponse.decode);
  }

  public static get(): StaticCaller {
    StaticCaller.instance ||= new StaticCaller();
    return StaticCaller.instance;
  }
}

export class JustInTimeCaller {
  private static instance: JustInTimeCaller;

  private constructor() {}

  public jitCall(request: JitInherentRequest): JitInherentResponse | null {
    const encoded = Protobuf.encode(request, JitInherentRequest.encode);
    const input = new AUint8Array();
    input.set(encoded);
    const inputPtr = input.store();
    const ret = __EvmCallApi__.jitCall(inputPtr);
    const bytes = new AUint8Array();
    bytes.load(ret);
    return Protobuf.decode<JitInherentResponse>(bytes.get(), JitInherentResponse.decode);
  }

  public static get(): JustInTimeCaller {
    JustInTimeCaller.instance ||= new JustInTimeCaller();
    return JustInTimeCaller.instance;
  }
}
