import { Protobuf } from "as-proto";
import { CurvePoint } from "../../proto";
import { BigInt } from "../wraptypes/bigint";

export class G1Point {
  encode(): Uint8Array {
    const curvePoint = new CurvePoint(this.x.toUint8Array(), this.y.toUint8Array());
    return Protobuf.encode(curvePoint, CurvePoint.encode);
  }

  decode(data: Uint8Array): G1Point {
    const curlPoint = Protobuf.decode(data, CurvePoint.decode);
    this.x = BigInt.fromUint8Array(curlPoint.x);
    this.y = BigInt.fromUint8Array(curlPoint.y);
    return this
  }

  x: BigInt;
  y: BigInt;

  constructor(
    x: BigInt = BigInt.ZERO,
    y: BigInt = BigInt.ZERO,
  ) {
    this.x = x;
    this.y = y;
  }
}

export class BigIntPair {
  m1 :BigInt;
  m2 :BigInt;

  constructor(m1: BigInt = BigInt.ZERO, m2: BigInt = BigInt.ZERO) {
    this.m1 = m1;
    this.m2 = m2;
  }
}

export class G2Point {
  x: BigIntPair;
  y: BigIntPair;

  constructor(
    x: BigIntPair = new BigIntPair(),
    y: BigIntPair = new BigIntPair(),
  ) {
    this.x = x;
    this.y = y;
  }
}