import { AString, AUint8Array, BigInt } from '../message';
import { ValueKind, Values, Value } from '../proto';
import { utils } from '../common';
import { Protobuf } from 'as-proto/assembly';

declare namespace __Abi__ {
  function encodeParams(types: i32, val: i32): i32;

  function decodeParams(types: i32, data: i32): i32;
}

export class Abi {
  // encodeString encode a string and return the hex of encoded
  static encodeString(val: string): Uint8Array {
    let types = 'string';
    let typeValue = new TypeValue();
    typeValue.fromString(val);
    let values = new Values(new Array<Value>(1));
    values.all[0] = typeValue.value;
    return this.encode(types, values);
  }

  static encodeInt32(val: i32): Uint8Array {
    let types = 'int32';
    let typeValue = new TypeValue();
    typeValue.fromInt32(val);
    let values = new Values(new Array<Value>(1));
    values.all[0] = typeValue.value;
    return this.encode(types, values);
  }

  static encodeInt64(val: i32): Uint8Array {
    let types = 'int64';
    let typeValue = new TypeValue();
    typeValue.fromInt64(val);
    let values = new Values(new Array<Value>(1));
    values.all[0] = typeValue.value;
    return this.encode(types, values);
  }

  static encodeUInt32(val: u32): Uint8Array {
    let types = 'uint32';
    let typeValue = new TypeValue();
    typeValue.fromUint32(val);
    let values = new Values(new Array<Value>(1));
    values.all[0] = typeValue.value;
    return this.encode(types, values);
  }

  static encodeUInt64(val: i32): Uint8Array {
    let types = 'uint64';
    let typeValue = new TypeValue();
    typeValue.fromUint64(val);
    let values = new Values(new Array<Value>(1));
    values.all[0] = typeValue.value;
    return this.encode(types, values);
  }

  static encodeBool(val: bool): Uint8Array {
    let types = 'bool';
    let typeValue = new TypeValue();
    typeValue.fromBool(val);
    let values = new Values(new Array<Value>(1));
    values.all[0] = typeValue.value;
    return this.encode(types, values);
  }

  static encodeBigInit(val: BigInt): Uint8Array {
    let types = 'uint256';
    let typeValue = new TypeValue();
    typeValue.fromBigInt(val);
    let values = new Values(new Array<Value>(1));
    values.all[0] = typeValue.value;
    return this.encode(types, values);
  }

  // encode receives the types and values, return the hex of abi codes
  // the types is a array of type with a separator of ','
  // the values should be perfect match to the types.
  static encode(types: string, val: Values): Uint8Array {
    let bytes = Protobuf.encode(val, Values.encode);
    let typesPtr = new AString(types).store();
    let valPtr = new AUint8Array(bytes).store();

    let ret = new AUint8Array();
    ret.load(__Abi__.encodeParams(typesPtr, valPtr));
    return ret.get();
  }

  // decode receives types and hex of abi codes, return the values
  static decode(types: string, data: Uint8Array): Values {
    let typePtr = new AString(types).store();
    let dataPtr = new AUint8Array(data).store();
    let ret = new AUint8Array();

    ret.load(__Abi__.decodeParams(typePtr, dataPtr));
    const output = Protobuf.decode<Values>(ret.get(), Values.decode);
    return output;
  }
}

export class TypeValue {
  fromInt16(input: i16): void {
    let num = BigInt.fromInt16(input).toString(16);
    let data = utils.hexToUint8Array(num);
    this.value = new Value(ValueKind.INT16, data);
  }

  fromInt32(input: i32): void {
    let num = BigInt.fromInt32(input).toString(16);
    let data = utils.hexToUint8Array(num);
    this.value = new Value(ValueKind.INT32, data);
  }

  fromInt64(input: i64): void {
    let num = BigInt.fromInt64(input).toString(16);
    let data = utils.hexToUint8Array(num);
    this.value = new Value(ValueKind.INT64, data);
  }

  fromUint16(input: u16): void {
    let num = BigInt.fromUInt16(input).toString(16);
    let data = utils.hexToUint8Array(num);
    this.value = new Value(ValueKind.UINT16, data);
  }

  fromUint32(input: u32): void {
    let num = BigInt.fromUInt32(input).toString(16);
    let data = utils.hexToUint8Array(num);
    this.value = new Value(ValueKind.UINT32, data);
  }

  fromUint64(input: u64): void {
    let num = BigInt.fromUInt64(input).toString(16);
    let data = utils.hexToUint8Array(num);
    this.value = new Value(ValueKind.UINT64, data);
  }

  fromBigInt(input: BigInt): void {
    let data = utils.hexToUint8Array(input.toString(16));
    this.value = new Value(ValueKind.UINT256, data);
  }

  fromBool(input: bool): void {
    let data = new Uint8Array(1);
    data[0] = 1;
    this.value = new Value(ValueKind.BOOL, data);
  }

  fromString(input: string): void {
    this.value = new Value(ValueKind.STRING);
    this.value.data = utils.stringToUint8Array(input);
  }

  toString(): string {
    if (this.value.kind != ValueKind.STRING) {
      return '';
    }
    return utils.uint8ArrayToString(this.value.data);
  }

  // little endian
  toInt32(): i32 {
    if (this.value.kind != ValueKind.INT32 || this.value.data.length < 4) {
      return 0;
    }
    let ret: i32 = 0;
    for (let i = 0; i < 4; i++) {
      let add = i32(this.value.data[i]) << (8 * i);
      ret += add;
    }
    return ret;
  }

  // little endian
  toInt64(): i64 {
    if (this.value.kind != ValueKind.INT64 || this.value.data.length < 8) {
      return 0;
    }
    let ret: i64 = 0;
    for (let i = 0; i < 8; i++) {
      let add = i64(this.value.data[i]) << (8 * i);
      ret += add;
    }
    return ret;
  }

  constructor(value: Value = new Value()) {
    this.value = value;
  }

  value: Value;
}
