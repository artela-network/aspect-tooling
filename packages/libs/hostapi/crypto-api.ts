import { AString, AUint8Array } from '../common';

declare namespace __CryptoApi__ {

  function sha256(dataPtr: i32): i32;

  function base64Encode(dataPtr: i32): i32;

  function base64Decode(dataPtr: i32): i32;

  function base58Encode(dataPtr: i32): i32;

  function base58Decode(dataPtr: i32): i32;

  function ripemd160(dataPtr: i32): i32;

  function keccak(dataPtr: i32): i32;

  function ecRecover(dataPtr: i32): i32;
}

export class CryptoApi {
  private static _ins: CryptoApi | null = null;

  private constructor() {}

  public static instance(): CryptoApi {
    if (!CryptoApi._ins) {
      CryptoApi._ins = new CryptoApi();
    }
    return CryptoApi._ins!;
  }

  public keccak(data: Uint8Array): Uint8Array {
    const dataPtr = new AUint8Array(data).store();
    const resPtr = __CryptoApi__.keccak(dataPtr);
    const resRaw = new AUint8Array();
    resRaw.load(resPtr);
    return resRaw.body;
  }

  public sha256(data: Uint8Array): Uint8Array {
    const dataPtr = new AUint8Array(data).store();
    const resPtr = __CryptoApi__.sha256(dataPtr);
    const resRaw = new AUint8Array();
    resRaw.load(resPtr);
    return resRaw.body;
  }

  public base64Encode(data: Uint8Array): string {
    const dataPtr = new AUint8Array(data).store();
    const resPtr = __CryptoApi__.base64Encode(dataPtr);
    const resRaw = new AString();
    resRaw.load(resPtr);
    return resRaw.body;
  }

  public base64Decode(data: string): Uint8Array {
    const dataPtr = new AString(data).store();
    const resPtr = __CryptoApi__.base64Decode(dataPtr);
    const resRaw = new AUint8Array();
    resRaw.load(resPtr);
    return resRaw.body;
  }

  public base58Encode(data: Uint8Array): string {
    const dataPtr = new AUint8Array(data).store();
    const resPtr = __CryptoApi__.base58Encode(dataPtr);
    const resRaw = new AString();
    resRaw.load(resPtr);
    return resRaw.body;
  }

  public base58Decode(data: string): Uint8Array {
    const dataPtr = new AString(data).store();
    const resPtr = __CryptoApi__.base58Decode(dataPtr);
    const resRaw = new AUint8Array();
    resRaw.load(resPtr);
    return resRaw.body;
  }

  public ripemd160(data: Uint8Array): Uint8Array {
    const dataPtr = new AUint8Array(data).store();
    const resPtr = __CryptoApi__.ripemd160(dataPtr);
    const resRaw = new AUint8Array();
    resRaw.load(resPtr);
    return resRaw.body;
  }

  public ecRecover(data: Uint8Array): Uint8Array {
    const dataPtr = new AUint8Array(data).store();
    const resPtr = __CryptoApi__.ecRecover(dataPtr);
    const resRaw = new AUint8Array();
    resRaw.load(resPtr);
    return resRaw.body;
  }
}
