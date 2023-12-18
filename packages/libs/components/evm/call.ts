import {
  EthMessage,
  EthMessageCallResult,
  JitInherentRequest,
  JitInherentResponse,
} from '../../proto';
import { EvmCallApi, UtilApi } from '../../hostapi';
import {
  BigInt,
  ethereum,
  JustInTimeCallable,
  NotAuthorizedFail,
  StaticCallable,
} from '../../common';

export class StaticCaller {
  private static _instance: StaticCaller | null;

  private constructor() {}

  public submit(request: EthMessage): EthMessageCallResult {
    return EvmCallApi.instance().staticCall(request);
  }

  public static instance(ctx: StaticCallable): StaticCaller {
    if (ctx == null) {
      throw NotAuthorizedFail;
    }
    if (!this._instance) {
      this._instance = new StaticCaller();
    }
    return this._instance!;
  }
}

export class JitCallBuilder {
  private _sender: string;
  private _nonce: u64;
  private _nonceKey: string;
  private _initCode: Uint8Array;
  private _callData: Uint8Array;
  private _callGasLimit: u64;
  private _verificationGasLimit: u64;
  private _maxFeePerGas: u64;
  private _maxPriorityFeePerGas: u64;
  private _paymasterAndData: Uint8Array;

  constructor() {
    this._sender = '';
    this._nonce = 0;
    this._nonceKey = '';
    this._initCode = new Uint8Array(0);
    this._callData = new Uint8Array(0);
    this._callGasLimit = 0;
    this._verificationGasLimit = 0;
    this._maxFeePerGas = 0;
    this._maxPriorityFeePerGas = 0;
    this._paymasterAndData = new Uint8Array(0);
  }

  sender(sender: string): JitCallBuilder {
    this._sender = sender.startsWith('0x') ? sender.substr(2) : sender;
    if (this._sender.length != 40) {
      throw new Error('invalid sender length');
    }
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

  maxFeePerGas(maxFeePerGas: u64): JitCallBuilder {
    this._maxFeePerGas = maxFeePerGas;
    return this;
  }

  maxPriorityFeePerGas(maxPriorityFeePerGas: u64): JitCallBuilder {
    this._maxPriorityFeePerGas = maxPriorityFeePerGas;
    return this;
  }

  paymasterAndData(paymasterAndData: Uint8Array): JitCallBuilder {
    this._paymasterAndData = paymasterAndData;
    return this;
  }

  build(): JitInherentRequest {
    return new JitInherentRequest(
      ethereum.Address.fromHexString(this._sender),
      this._nonce,
      UtilApi.instance().hexToUint8Array(this._nonceKey),
      this._initCode,
      this._callData,
      this._callGasLimit,
      this._verificationGasLimit,
      this._paymasterAndData,
    );
  }
}

export class JustInTimeCaller {
  private static _instance: JustInTimeCaller | null;

  private constructor() {}

  public submit(request: JitInherentRequest): JitInherentResponse {
    return EvmCallApi.instance().jitCall(request);
  }

  public static instance(ctx: JustInTimeCallable): JustInTimeCaller {
    if (ctx == null) {
      throw NotAuthorizedFail;
    }
    if (!this._instance) {
      this._instance = new JustInTimeCaller();
    }
    return this._instance!;
  }
}
