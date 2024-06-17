import { Protobuf } from 'as-proto/assembly';
import { ABool, AUint8Array, BigInt, hexToUint8Array, uint8ArrayToHex } from '../common';
import { Bn256AddInput, Bn256PairingInput, G1, G2 } from '../proto'
import { Bn256ScalarMulInput } from '../proto/aspect/v2/bn256scalar-mul-input';
import { G1Point, G2Point } from '../common'

declare namespace __CryptoApi__ {
  function sha256(dataPtr: i32): i32;

  function ripemd160(dataPtr: i32): i32;

  function keccak(dataPtr: i32): i32;

  function ecRecover(dataPtr: i32): i32;

  function bigModExp(basePtr: i32, expPtr: i32, modPtr: i32): i32;

  function bn256Add(dataPtr: i32): i32;

  function bn256ScalarMul(dataPtr: i32): i32;

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
   * @param a
   * @param b
   *
   * @returns
   */
  public bn256Add(a: G1Point, b: G1Point): G1Point {
    const input = new Bn256AddInput(
      new G1(a.x.toUint8Array(), a.y.toUint8Array()),
      new G1(b.x.toUint8Array(), b.y.toUint8Array()),
    );
    const inputPtr =new AUint8Array(Protobuf.encode(input, Bn256AddInput.encode)).store();

    const resPtr = __CryptoApi__.bn256Add(inputPtr);
    const resRaw = new AUint8Array();
    load(resPtr);
    return new G1Point().decode(resRaw.get());
  }

  /**
   * bn256ScalarMul implements a native elliptic curve scalar multiplication conforming to Istanbul consensus rules.
   * @param p
   * @param scalar
   *
   * @returns
   */
  public bn256ScalarMul(p: G1Point, scalar: BigInt): G1Point {
    const input = new Bn256ScalarMulInput(
      new G1(p.x.toUint8Array(), p.y.toUint8Array()),
      scalar.toUint8Array(),
    );
    const inputPtr =new AUint8Array(Protobuf.encode(input, Bn256ScalarMulInput.encode)).store();

    const resPtr = __CryptoApi__.bn256ScalarMul(inputPtr);
    const resRaw = new AUint8Array();
    resRaw.load(resPtr);
    return new G1Point().decode(resRaw.get());
  }

  /**
   * bn256Pairing implements a pairing pre-compile for the bn256 curve conforming to Istanbul consensus rules.
   * @param input
   *
   * @returns
   */
  public bn256Pairing(g1Points: G1Point[], g2Points: G2Point[]): bool {
    if (g1Points.length != g2Points.length) {
      return false;
    }

    const cs: Array<G1> = [];
    const ts1: Array<G2> = [];

    for (let i = 0; i < g1Points.length; i++) {
      const c = new G1(g1Points[i].x.toUint8Array(), g1Points[i].y.toUint8Array());
      const t = new G2(
        g2Points[i].x.m1.toUint8Array(),
        g2Points[i].x.m2.toUint8Array(),
        g2Points[i].y.m1.toUint8Array(),
        g2Points[i].y.m2.toUint8Array(),
        );
      cs.push(c);
      ts1.push(t);
    }

    let input = new Bn256PairingInput(cs, ts1)
    const inputPtr =new AUint8Array(Protobuf.encode(input, Bn256PairingInput.encode)).store();

    const resPtr = __CryptoApi__.bn256Pairing(inputPtr);
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
