import { Protobuf } from "as-proto/assembly";
import { G1, G2 } from "../../proto";
import { BigInt } from "../wraptypes/bigint";

export class G1Point {
  encode(): Uint8Array {
    const g1 = new G1(this.x.toUint8Array(), this.y.toUint8Array());
    return Protobuf.encode(g1, G1.encode);
  }

  decode(data: Uint8Array): G1Point {
    const curlPoint = Protobuf.decode(data, G1.decode);
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

export class G2Coord {
  m1 :BigInt;
  m2 :BigInt;

  constructor(m1: BigInt = BigInt.ZERO, m2: BigInt = BigInt.ZERO) {
    this.m1 = m1;
    this.m2 = m2;
  }
}

export class G2Point {
  x: G2Coord;
  y: G2Coord;

  constructor(
    x: G2Coord = new G2Coord(),
    y: G2Coord = new G2Coord(),
  ) {
    this.x = x;
    this.y = y;
  }
}