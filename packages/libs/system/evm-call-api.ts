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
  private static _instance: StaticCaller | null;

  private constructor() {}

  public staticCall(request: CallMessageRequest): CallMessageResponse {
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
    if (!this._instance) {
      this._instance = new StaticCaller();
    }
    return this._instance!;
  }
}

export class JustInTimeCaller {
  private static _instance: JustInTimeCaller | null;

  private constructor() {}

  public jitCall(request: JitInherentRequest): JitInherentResponse {
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
    if (!this._instance) {
      this._instance = new JustInTimeCaller();
    }
    return this._instance!;
  }
}
