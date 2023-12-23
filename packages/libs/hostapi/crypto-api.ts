import { AUint8Array, BigInt } from '../common';
import { UtilApi } from './util-api';

declare namespace __CryptoApi__ {
  function sha256(dataPtr: i32): i32;

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

  public ripemd160(data: Uint8Array): Uint8Array {
    const dataPtr = new AUint8Array(data).store();
    const resPtr = __CryptoApi__.ripemd160(dataPtr);
    const resRaw = new AUint8Array();
    resRaw.load(resPtr);
    return resRaw.body;
  }

  /**
   * recover the address associated with the public key from elliptic curve signature or return zero on error.
   * The function parameters correspond to ECDSA values of the signature:
   * @param hash
   * @param v final 32 bytes of signature
   * @param r  first 32 bytes of signature
   * @param s  second 32 bytes of signature
   *
   * @returns string returns an address, and not an address payable
   */
  public ecRecover(hash: string, v: BigInt, r: BigInt, s: BigInt): string {
    if (
      v.countBits() == 0 ||
      r.countBits() == 0 ||
      s.countBits() == 0 ||
      v.countBits() > 256 ||
      r.countBits() > 256 ||
      s.countBits() > 256
    ) {
      return '';
    }
    const vStr = v.countBits() == 256 ? v.toString(16) : v.toString(16).padStart(64, '0');
    const rStr = r.countBits() == 256 ? r.toString(16) : r.toString(16).padStart(64, '0');
    const sStr = s.countBits() == 256 ? s.toString(16) : s.toString(16).padStart(64, '0');

    //[msgHash 32B][v 32B][r 32B][s 32B]
    const syscallInput = hash + vStr + rStr + sStr;
    const ret = this._ecRecover(UtilApi.instance().hexToUint8Array(syscallInput));
    return UtilApi.instance().uint8ArrayToHex(ret);
  }

  private _ecRecover(data: Uint8Array): Uint8Array {
    const dataPtr = new AUint8Array(data).store();
    const resPtr = __CryptoApi__.ecRecover(dataPtr);
    const resRaw = new AUint8Array();
    resRaw.load(resPtr);
    return resRaw.body;
  }
}
