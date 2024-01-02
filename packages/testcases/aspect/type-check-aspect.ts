import {
  allocate,
  BigInt,
  entryPoint,
  execute,
  IPostTxExecuteJP,
  IPreTxExecuteJP,
  PostTxExecuteInput,
  PreTxExecuteInput,
  stringToUint8Array,
  sys,
  uint8ArrayToHex,
  uint8ArrayToString,
} from '@artela/aspect-libs';

class TypeCheckAspect implements IPostTxExecuteJP, IPreTxExecuteJP {
  isOwner(sender: Uint8Array): bool {
    const value = sys.aspect.property.get<Uint8Array>('owner');
    return !!uint8ArrayToHex(value).includes(uint8ArrayToString(sender));
  }

  preTxExecute(input: PreTxExecuteInput): void {
    this.checkForString();
    this.checkForBool();
    this.checkForUint8Array();

    this.checkForBigInt();

    this.checkForAspectNumber<i8>('i8', i8.MAX_VALUE, i8.MIN_VALUE, i8.MAX_VALUE);
    this.checkForAspectNumber<i8>('i8', i8.MIN_VALUE, i8.MIN_VALUE, i8.MAX_VALUE);
    this.checkForAspectNumber<i8>('i8', i8(25), i8.MIN_VALUE, i8.MAX_VALUE);

    this.checkForAspectNumber<u8>('u8', u8.MAX_VALUE, u8.MIN_VALUE, u8.MAX_VALUE);
    this.checkForAspectNumber<u8>('u8', u8.MIN_VALUE, u8.MIN_VALUE, u8.MAX_VALUE);
    this.checkForAspectNumber<u8>('u8', u8(25), u8.MIN_VALUE, u8.MAX_VALUE);

    this.checkForAspectNumber<i16>('i16', i16(25), i16.MIN_VALUE, i16.MAX_VALUE);
    this.checkForAspectNumber<i16>('i16', i16.MAX_VALUE, i16.MIN_VALUE, i16.MAX_VALUE);
    this.checkForAspectNumber<i16>('i16', i16.MIN_VALUE, i16.MIN_VALUE, i16.MAX_VALUE);

    this.checkForAspectNumber<u16>('u16', u16(25), u16.MIN_VALUE, u16.MAX_VALUE);
    this.checkForAspectNumber<u16>('u16', u16.MAX_VALUE, u16.MIN_VALUE, u16.MAX_VALUE);
    this.checkForAspectNumber<u16>('u16', u16.MIN_VALUE, u16.MIN_VALUE, u16.MAX_VALUE);

    this.checkForAspectNumber<i32>('i32', i32(25), i32.MIN_VALUE, i32.MAX_VALUE);
    this.checkForAspectNumber<i32>('i32', i32.MAX_VALUE, i32.MIN_VALUE, i32.MAX_VALUE);
    this.checkForAspectNumber<i32>('i32', i32.MIN_VALUE, i32.MIN_VALUE, i32.MAX_VALUE);

    this.checkForAspectNumber<u32>('u32', u32(25), u32.MIN_VALUE, u32.MAX_VALUE);
    this.checkForAspectNumber<u32>('u32', u32.MAX_VALUE, u32.MIN_VALUE, u32.MAX_VALUE);
    this.checkForAspectNumber<u32>('u32', u32.MIN_VALUE, u32.MIN_VALUE, u32.MAX_VALUE);

    this.checkForAspectNumber<i64>('i64', i64(25), i64.MIN_VALUE, i64.MAX_VALUE);
    this.checkForAspectNumber<i64>('i64', i64.MAX_VALUE, i64.MIN_VALUE, i64.MAX_VALUE);
    this.checkForAspectNumber<i64>('i64', i64.MIN_VALUE, i64.MIN_VALUE, i64.MAX_VALUE);

    this.checkForAspectNumber<u64>('u64', u64(25), u64.MIN_VALUE, u64.MAX_VALUE);
    this.checkForAspectNumber<u64>('u64', u64.MAX_VALUE, u64.MIN_VALUE, u64.MAX_VALUE);
    this.checkForAspectNumber<u64>('u64', u64.MIN_VALUE, u64.MIN_VALUE, u64.MAX_VALUE);
  }

  postTxExecute(input: PostTxExecuteInput): void {}

  checkForString(): void {
    const keyForString = 'key_for_string';
    const testValue = 'test value';

    const rawPropertyResult = sys.aspect.property.get<Uint8Array>(keyForString);
    if (!(rawPropertyResult instanceof Uint8Array)) {
      sys.revert('incorrect type convertion from property');
    }
    const propertyResult = uint8ArrayToString(rawPropertyResult);
    if (typeof propertyResult !== 'string') {
      sys.revert('incorrect type convertion from property');
    } else if (propertyResult !== testValue) {
      sys.revert('incorrect value from property');
    }

    // const rawOwnerVal = sys.aspect.property.get<Uint8Array>("owner")
    // const rawPropertyResult = sys.aspect.property.get<Uint8Array>(keyForString)
    // if (!(rawOwnerVal instanceof Uint8Array) || !(rawPropertyResult instanceof Uint8Array)) {
    //     sys.revert("incorrect type convertion from property")
    // }

    // const ownerVal = fromUint8Array<string>(rawOwnerVal)
    // const propertyResult = fromUint8Array<string>(rawPropertyResult)
    // if (typeof propertyResult !== "string") {
    //     sys.revert("incorrect type convertion from property")
    // } else if (propertyResult !== ownerVal) {
    //     sys.revert('incorrect value from property')
    // }

    sys.aspect.transientStorage.get<string>(keyForString).set<string>(testValue);
    const transientStorageResult = sys.aspect.transientStorage.get<string>(keyForString).unwrap();
    if (typeof transientStorageResult !== 'string') {
      sys.revert('incorrect type convertion from transientStorage');
    } else if (transientStorageResult !== testValue) {
      sys.revert('incorrect value from transientStorage');
    }

    sys.aspect.mutableState.get<string>(keyForString).set<string>(testValue);
    const mutableStateResult = sys.aspect.mutableState.get<string>(keyForString).unwrap();
    if (typeof mutableStateResult !== 'string') {
      sys.revert('incorrect type convertion from mutableState');
    } else if (mutableStateResult !== testValue) {
      sys.revert('incorrect value from mutableState');
    }
  }

  checkForBool(): void {
    const keyForBool = 'key_for_bool';
    const testValue = bool(true);

    sys.aspect.transientStorage.get<bool>(keyForBool).set<bool>(testValue);
    const transientStorageResult = sys.aspect.transientStorage.get<bool>(keyForBool).unwrap();
    if (!isBoolean(transientStorageResult) && typeof transientStorageResult !== 'number') {
      sys.revert('incorrect type convertion from transientStorage');
    } else if (transientStorageResult !== testValue) {
      sys.revert('incorrect value from transientStorage');
    }

    sys.aspect.mutableState.get<bool>(keyForBool).set<bool>(testValue);
    const mutableStateResult = sys.aspect.mutableState.get<bool>(keyForBool).unwrap();
    if (!isBoolean(mutableStateResult) && typeof mutableStateResult !== 'number') {
      sys.revert('incorrect type convertion from mutableState');
    } else if (mutableStateResult !== testValue) {
      sys.revert('incorrect value from mutableState');
    }
  }

  checkForUint8Array(): void {
    const keyForUint8Array = 'key_for_Uint8Array';
    const baseTestValue = 'test value';
    const testValue = stringToUint8Array(baseTestValue);

    sys.aspect.transientStorage.get<Uint8Array>(keyForUint8Array).set<Uint8Array>(testValue);
    const transientStorageResult = sys.aspect.transientStorage
      .get<Uint8Array>(keyForUint8Array)
      .unwrap();
    if (!(transientStorageResult instanceof Uint8Array)) {
      sys.revert('incorrect type convertion from transientStorage');
    } else if (uint8ArrayToString(transientStorageResult) !== baseTestValue) {
      sys.revert('incorrect value from transientStorage');
    }

    sys.aspect.mutableState.get<Uint8Array>(keyForUint8Array).set<Uint8Array>(testValue);
    const mutableStateResult = sys.aspect.mutableState.get<Uint8Array>(keyForUint8Array).unwrap();
    if (!(mutableStateResult instanceof Uint8Array)) {
      sys.revert('incorrect type convertion from mutableState');
    } else if (uint8ArrayToString(mutableStateResult) !== baseTestValue) {
      sys.revert('incorrect value from mutableState');
    }
  }

  checkForBigInt(): void {
    const keyForBigInt = 'key_for_BigInt';
    const testValue = BigInt.fromUInt16(32);

    sys.aspect.transientStorage.get<BigInt>(keyForBigInt).set(testValue);
    const transientStorageResult = sys.aspect.transientStorage.get<BigInt>(keyForBigInt).unwrap();
    if (!(transientStorageResult instanceof BigInt)) {
      sys.revert('incorrect type convertion from transientStorage');
    } else if (!transientStorageResult.eq(testValue)) {
      sys.revert('incorrect value from transientStorage');
    }

    sys.aspect.mutableState.get<BigInt>(keyForBigInt).set<BigInt>(testValue);
    const mutableStateResult = sys.aspect.mutableState.get<BigInt>(keyForBigInt).unwrap();
    if (!(mutableStateResult instanceof BigInt)) {
      sys.revert('incorrect type convertion from mutableState');
    } else if (!mutableStateResult.eq(testValue)) {
      sys.revert('incorrect value from mutableState');
    }
  }

  checkForAspectNumber<T>(nameOfType: string, testValue: T, minValue: T, maxValue: T): void {
    const keyForI8 = `key_for_${nameOfType}`;

    sys.aspect.transientStorage.get<T>(keyForI8).set<T>(testValue);
    const transientStorageResult = sys.aspect.transientStorage.get<T>(keyForI8).unwrap();
    if (!this.checkNumber<T>(transientStorageResult, minValue, maxValue)) {
      sys.revert('incorrect type convertion from transientStorage');
    } else if (transientStorageResult !== testValue) {
      sys.revert('incorrect value from transientStorage');
    }

    sys.aspect.mutableState.get<T>(keyForI8).set<T>(testValue);
    const mutableStateResult = sys.aspect.mutableState.get<T>(keyForI8).unwrap();
    if (!this.checkNumber<T>(mutableStateResult, minValue, maxValue)) {
      sys.revert('incorrect type convertion from mutableState');
    } else if (mutableStateResult !== testValue) {
      sys.revert('incorrect value from mutableState');
    }
  }

  checkNumber<T>(value: T, minValue: T, maxValue: T): bool {
    return (
      typeof value === 'number' &&
      typeof minValue === 'number' &&
      typeof maxValue === 'number' &&
      value >= minValue &&
      value <= maxValue
    );
  }
}

// 2.register aspect Instance
const aspect = new TypeCheckAspect();
entryPoint.setAspect(aspect);

// 3.must export it
export { allocate, execute };
