import {
  EthMessage,
  EthMessageCallResult,
  JitInherentRequest,
  JitInherentResponse,
} from '../proto';
import { Protobuf } from 'as-proto/assembly';
import { AUint8Array, BigInt } from '../types';
import { utils } from './util-api';

declare namespace __EvmCallApi__ {
  function staticCall(request: i32): i32;

  function jitCall(request: i32): i32;
}

export class CallMessage {
  constructor(
    public readonly to: string,
    public readonly callData: Uint8Array,
    public readonly from: string = '',
    public readonly nonce: u64 = 0,
    public readonly gas: u64 = u64.MAX_VALUE,
    public readonly value: BigInt = BigInt.fromUInt64(0),
  ) {}
}

export class StaticCaller {
  private static _instance: StaticCaller | null;

  private constructor() {}

  public staticCall(request: CallMessage): EthMessageCallResult {
    const ethMessage = new EthMessage(
      request.to,
      request.callData,
      request.nonce,
      request.from,
      '',
      '',
      request.gas,
      '',
      request.value.toString(10),
    );

    const encoded = Protobuf.encode(ethMessage, EthMessage.encode);
    const input = new AUint8Array();
    input.set(encoded);
    const inputPtr = input.store();
    const ret = __EvmCallApi__.staticCall(inputPtr);
    const bytes = new AUint8Array();
    bytes.load(ret);
    return Protobuf.decode<EthMessageCallResult>(bytes.get(), EthMessageCallResult.decode);
  }

  public static get(): StaticCaller {
    if (!this._instance) {
      this._instance = new StaticCaller();
    }
    return this._instance!;
  }
}

export class JitCallMessage {
  constructor(
    public readonly sender: string,
    public readonly nonce: Uint8Array,
    public readonly callData: Uint8Array,
    public readonly callGasLimit: BigInt,
    public readonly verificationGasLimit: BigInt,
    public readonly maxFeePerGas: BigInt,
    public readonly maxPriorityFeePerGas: BigInt = BigInt.fromUInt64(0),
    public readonly initCode: Uint8Array = new Uint8Array(0),
    public readonly paymasterAndData: Uint8Array = new Uint8Array(0),
  ) {}
}

export class JustInTimeCaller {
  private static _instance: JustInTimeCaller | null;

  private constructor() {}

  public submit(request: JitCallMessage): JitInherentResponse {
    const jitRequest = new JitInherentRequest(
      utils.hexToUint8Array(request.sender),
      request.nonce,
      request.initCode,
      request.callData,
      utils.hexToUint8Array(request.callGasLimit.toString(16)),
      utils.hexToUint8Array(request.verificationGasLimit.toString(16)),
      utils.hexToUint8Array(request.maxFeePerGas.toString(16)),
      utils.hexToUint8Array(request.maxPriorityFeePerGas.toString(16)),
      request.paymasterAndData,
    );

    const encoded = Protobuf.encode(jitRequest, JitInherentRequest.encode);
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
