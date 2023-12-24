import { Protobuf } from 'as-proto/assembly';
import { AUint8Array, ethereum, hexToUint8Array } from '../common';
import {
  JitInherentRequest,
  JitInherentResponse,
  StaticCallRequest,
  StaticCallResult,
} from '../proto';

declare namespace __EvmCallApi__ {
  function staticCall(request: i32): i32;

  function jitCall(request: i32): i32;
}

export class JitCallBuilder {
  private _sender: Uint8Array;
  private _nonce: u64;
  private _nonceKey: string;
  private _initCode: Uint8Array;
  private _callData: Uint8Array;
  private _callGasLimit: u64;
  private _verificationGasLimit: u64;
  private _paymasterAndData: Uint8Array;

  constructor() {
    this._sender = new Uint8Array(0);
    this._nonce = 0;
    this._nonceKey = '';
    this._initCode = new Uint8Array(0);
    this._callData = new Uint8Array(0);
    this._callGasLimit = 0;
    this._verificationGasLimit = 0;
    this._paymasterAndData = new Uint8Array(0);
  }

  static simple(sender: Uint8Array, to: Uint8Array, methodCallData: Uint8Array): JitCallBuilder {
    const walletCallData = ethereum.abiEncode('execute', [
      ethereum.Address.fromUint8Array(to),
      ethereum.Number.fromU64(0),
      ethereum.Bytes.fromUint8Array(methodCallData),
    ]);
    return new JitCallBuilder().sender(sender).callData(hexToUint8Array(walletCallData));
  }

  sender(sender: Uint8Array): JitCallBuilder {
    if (sender.length != 20) {
      throw new Error('invalid sender length');
    }
    this._sender = sender;
    return this;
  }

  nonce(nonce: u64): JitCallBuilder {
    this._nonce = nonce;
    return this;
  }

  nonceKey(nonceKey: string): JitCallBuilder {
    nonceKey = nonceKey.startsWith('0x') ? nonceKey.substr(2) : nonceKey;
    if (nonceKey.length != 48) {
      throw new Error('nonce key must be 24 bytes');
    }

    this._nonceKey = nonceKey;
    return this;
  }

  initCode(initCode: Uint8Array): JitCallBuilder {
    this._initCode = initCode;
    return this;
  }

  callData(callData: Uint8Array): JitCallBuilder {
    this._callData = callData;
    return this;
  }

  callGasLimit(callGasLimit: u64): JitCallBuilder {
    this._callGasLimit = callGasLimit;
    return this;
  }

  verificationGasLimit(verificationGasLimit: u64): JitCallBuilder {
    this._verificationGasLimit = verificationGasLimit;
    return this;
  }

  paymasterAndData(paymasterAndData: Uint8Array): JitCallBuilder {
    this._paymasterAndData = paymasterAndData;
    return this;
  }

  build(): JitInherentRequest {
    return new JitInherentRequest(
      ethereum.Address.fromUint8Array(this._sender),
      this._nonce,
      hexToUint8Array(this._nonceKey),
      this._initCode,
      this._callData,
      this._callGasLimit,
      this._verificationGasLimit,
      this._paymasterAndData,
    );
  }
}

export class EvmCallApi {
  private static _instance: EvmCallApi | null = null;

  private constructor() {}

  public static instance(): EvmCallApi {
    if (!this._instance) {
      this._instance = new EvmCallApi();
    }
    return this._instance!;
  }

  public staticCall(request: StaticCallRequest): StaticCallResult {
    const encoded = Protobuf.encode(request, StaticCallRequest.encode);
    const input = new AUint8Array();
    input.set(encoded);
    const inputPtr = input.store();
    const ret = __EvmCallApi__.staticCall(inputPtr);
    const bytes = new AUint8Array();
    bytes.load(ret);
    return Protobuf.decode<StaticCallResult>(bytes.get(), StaticCallResult.decode);
  }

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
}
