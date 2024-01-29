import { ABool, AUint8Array, BigInt, hexToUint8Array, uint8ArrayToHex } from '../common';

declare namespace __CryptoApi__ {
  function sha256(dataPtr: i32): i32;

  function ripemd160(dataPtr: i32): i32;

  function keccak(dataPtr: i32): i32;

  function ecRecover(dataPtr: i32): i32;

  function bigModExp(basePtr: i32, expPtr: i32, modPtr: i32): i32;

  function bn256Add(axPtr: i32, ayPtr: i32, bxPtr: i32, byPtr: i32): i32;

  function bn256ScalarMul(xPtr: i32, yPtr: i32, scalarPtr: i32): i32;

  function bn256Pairing(dataPtr: i32): i32;
}

export class CryptoApi {
  private static _ins: CryptoApi | null = null;

  private constructor() { }

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
    const ret = this._ecRecover(hexToUint8Array(syscallInput));
    return uint8ArrayToHex(ret);
  }

  private _ecRecover(data: Uint8Array): Uint8Array {
    const dataPtr = new AUint8Array(data).store();
    const resPtr = __CryptoApi__.ecRecover(dataPtr);
    const resRaw = new AUint8Array();
    resRaw.load(resPtr);
    return resRaw.body;
  }

  /**
   * bigModExp implements a native big integer exponential modular operation.
   * @param base
   * @param exp
   * @param mod
   *
   * @returns
   */
  public bigModExp(base: BigInt, exp: BigInt, mod: BigInt): BigInt {
    if (!this.checkLength(base) || !this.checkLength(exp) || !this.checkLength(mod)) {
      return BigInt.ZERO;
    }

    const basePtr = new AUint8Array(base.toUint8Array()).store();
    const expPtr = new AUint8Array(exp.toUint8Array()).store();
    const modPtr = new AUint8Array(mod.toUint8Array()).store();
    const resPtr = __CryptoApi__.bigModExp(basePtr, expPtr, modPtr);
    const resRaw = new AUint8Array();
    resRaw.load(resPtr);
    return BigInt.fromUint8Array(resRaw.body);
  }

  /**
   * bn256Add implements a native elliptic curve point addition conforming to Istanbul consensus rules.
   * @param ax
   * @param ay
   * @param bx
   * @param by
   *
   * @returns
   */
  public bn256Add(ax: BigInt, ay: BigInt, bx: BigInt, by: BigInt): BigInt {
    if (!this.checkLength(ax) || !this.checkLength(ay) || !this.checkLength(bx) || !this.checkLength(by)) {
      return BigInt.ZERO;
    }

    const axPtr = new AUint8Array(ax.toUint8Array()).store();
    const ayPtr = new AUint8Array(ay.toUint8Array()).store();
    const bxPtr = new AUint8Array(bx.toUint8Array()).store();
    const byPtr = new AUint8Array(by.toUint8Array()).store();

    const resPtr = __CryptoApi__.bn256Add(axPtr, ayPtr, bxPtr, byPtr);
    const resRaw = new AUint8Array();
    resRaw.load(resPtr);
    return BigInt.fromUint8Array(resRaw.body);
  }

  /**
   * bn256ScalarMul implements a native elliptic curve scalar multiplication conforming to Istanbul consensus rules.
   * @param x
   * @param y
   * @param scalar
   *
   * @returns
   */
  public bn256ScalarMul(x: BigInt, y: BigInt, scalar: BigInt): BigInt {
    if (!this.checkLength(x) || !this.checkLength(y) || !this.checkLength(scalar)) {
      return BigInt.ZERO;
    }

    const xPtr = new AUint8Array(x.toUint8Array()).store();
    const yPtr = new AUint8Array(y.toUint8Array()).store();
    const scalarPtr = new AUint8Array(scalar.toUint8Array()).store();

    const resPtr = __CryptoApi__.bn256ScalarMul(xPtr, yPtr, scalarPtr);
    const resRaw = new AUint8Array();
    resRaw.load(resPtr);
    return BigInt.fromUint8Array(resRaw.body);
  }

  /**
   * bn256Pairing implements a pairing pre-compile for the bn256 curve conforming to Istanbul consensus rules.
   * @param input
   *
   * @returns
   */
  public bn256Pairing(input: Uint8Array): bool {
    const ptr = new AUint8Array(input).store();

    const resPtr = __CryptoApi__.bn256Pairing(ptr);
    const resRaw = new ABool();
    resRaw.load(resPtr);
    return resRaw.body;
  }

  private checkLength(b: BigInt): bool {
    if (b.countBits() == 0 || b.countBits() > 256) {
      return false
    }
    return true
  }
}
