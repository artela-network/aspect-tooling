import { Protobuf } from 'as-proto/assembly';
import { AUint8Array, G1Point, G2Point, Uint256 } from '../common';
import {
  Blake2FInput,
  Bn256AddInput,
  Bn256PairingInput,
  Bn256ScalarMulInput,
  EcRecoverInput,
  G1,
  G2,
} from '../proto';

declare namespace __CryptoApi__ {
  function sha256(dataPtr: i32): i32;

  function ripemd160(dataPtr: i32): i32;

  function keccak(dataPtr: i32): i32;

  function ecRecover(dataPtr: i32): i32;

  function bigModExp(basePtr: i32, expPtr: i32, modPtr: i32): i32;

  function bn256Add(dataPtr: i32): i32;

  function bn256ScalarMul(dataPtr: i32): i32;

  function bn256Pairing(dataPtr: i32): i32;

  function blake2F(dataPtr: i32): i32;
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
  public ecRecover(hash: Uint8Array, v: Uint256, r: Uint256, s: Uint256): Uint8Array {
    const input = new EcRecoverInput(hash, v.toUint8Array(), r.toUint8Array(), s.toUint8Array());
    const inputPtr = new AUint8Array(Protobuf.encode(input, EcRecoverInput.encode)).store();

    const ret = __CryptoApi__.ecRecover(inputPtr);
    const resRaw = new AUint8Array();
    resRaw.load(ret);
    return resRaw.body;
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
  public bigModExp(base: Uint8Array, exp: Uint8Array, mod: Uint8Array): Uint8Array {
    const basePtr = new AUint8Array(base).store();
    const expPtr = new AUint8Array(exp).store();
    const modPtr = new AUint8Array(mod).store();
    const resPtr = __CryptoApi__.bigModExp(basePtr, expPtr, modPtr);
    const resRaw = new AUint8Array();
    resRaw.load(resPtr);
    return resRaw.body;
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
    const inputPtr = new AUint8Array(Protobuf.encode(input, Bn256AddInput.encode)).store();

    const resPtr = __CryptoApi__.bn256Add(inputPtr);
    const resRaw = new AUint8Array();
    resRaw.load(resPtr);
    return new G1Point().decode(resRaw.get());
  }

  /**
   * bn256ScalarMul implements a native elliptic curve scalar multiplication conforming to Istanbul consensus rules.
   * @param p
   * @param scalar
   *
   * @returns
   */
  public bn256ScalarMul(p: G1Point, scalar: Uint256): G1Point {
    const input = new Bn256ScalarMulInput(
      new G1(p.x.toUint8Array(), p.y.toUint8Array()),
      scalar.toUint8Array(),
    );
    const inputPtr = new AUint8Array(Protobuf.encode(input, Bn256ScalarMulInput.encode)).store();

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
    const ts: Array<G2> = [];

    for (let i = 0; i < g1Points.length; i++) {
      const c = new G1(g1Points[i].x.toUint8Array(), g1Points[i].y.toUint8Array());
      const t = new G2(
        g2Points[i].x[0].toUint8Array(),
        g2Points[i].x[1].toUint8Array(),
        g2Points[i].y[0].toUint8Array(),
        g2Points[i].y[1].toUint8Array(),
      );
      cs.push(c);
      ts.push(t);
    }

    const input = new Bn256PairingInput(cs, ts);
    const inputPtr = new AUint8Array(Protobuf.encode(input, Bn256PairingInput.encode)).store();

    const resPtr = __CryptoApi__.bn256Pairing(inputPtr);
    const resRaw = new AUint8Array();
    resRaw.load(resPtr);
    if (resRaw.get().length != 32) {
      return false;
    }
    return resRaw.get().at(31) == 1;
  }

  /**
   * blake2F implements blake2F to Istanbul consensus rules.
   * @param h
   * @param m
   * @param t
   * @param final
   * @param rounds
   * @returns
   */
  public blake2F(
    h: Uint8Array,
    m: Uint8Array,
    t: Uint8Array,
    final: bool,
    rounds: Uint8Array,
  ): Uint8Array {
    if (h.length != 64 || m.length != 128 || t.length != 16 || rounds.length != 4) {
      return new Uint8Array(0);
    }

    const input = new Blake2FInput(h, m, t, final, rounds);
    const inputPtr = new AUint8Array(Protobuf.encode(input, Blake2FInput.encode)).store();

    const resPtr = __CryptoApi__.blake2F(inputPtr);
    const resRaw = new AUint8Array();
    resRaw.load(resPtr);

    return resRaw.get();
  }
}
