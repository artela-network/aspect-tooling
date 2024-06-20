import { Protobuf } from "as-proto/assembly";
import { G1, G2 } from "../../proto";
import { Uint256 } from "../wraptypes/uint256";

export class G1Point {
  encode(): Uint8Array {
    const g1 = new G1(this.x.toUint8Array(), this.y.toUint8Array());
    return Protobuf.encode(g1, G1.encode);
  }

  decode(data: Uint8Array): G1Point {
    const curlPoint = Protobuf.decode<G1>(data, G1.decode);
    this.x = Uint256.fromUint8Array(curlPoint.x);
    this.y = Uint256.fromUint8Array(curlPoint.y);
    return this
  }

  x: Uint256;
  y: Uint256;

  constructor(
    x: Uint256 = Uint256.ZERO,
    y: Uint256 = Uint256.ZERO,
  ) {
    this.x = x;
    this.y = y;
  }
}

export class G2Point {
  x: Array<Uint256>;
  y: Array<Uint256>;

  constructor(
    x: Array<Uint256> = [Uint256.ZERO, Uint256.ZERO],
    y: Array<Uint256> = [Uint256.ZERO, Uint256.ZERO],
  ) {
    if (x.length != 2 || y.length != 2) {
      throw new Error("Array x,y must have a length of 2");
    }
    this.x = x;
    this.y = y;
  }
}