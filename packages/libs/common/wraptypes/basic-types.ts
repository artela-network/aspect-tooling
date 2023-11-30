export enum typeIndex {
  Empty = 0,
  TypeInt8,
  TypeInt16,
  TypeInt32,
  TypeInt64,
  TypeUint8,
  TypeUint16,
  TypeUint32,
  TypeUint64,
  TypeBool,
  TypeString, // string with utf-8 encoder
  TypeByteArray,
}

class header {
  load(ptr: i32): void {
    this.dataType = i16(i32.load16_s(ptr));
    this.dataLen = i32.load(ptr + 2);
  }

  store(ptr: i32): void {
    i32.store16(ptr, this.dataType);
    i32.store(ptr + 2, this.dataLen);
  }

  len(): i32 {
    return 6; // i16 + i32
  }

  dataType: i16;
  dataLen: i32;

  constructor(type: typeIndex = typeIndex.TypeInt8, len: i32 = 0) {
    this.dataType = type as i16;
    this.dataLen = len;
  }
}

export class AString {
  public set(s: string): void {
    this.body = s;
    this.head.dataLen = String.UTF8.byteLength(s);
  }

  public get(): string {
    return this.body;
  }

  public load(ptr: i32): void {
    this.head = new header(0, 0);
    this.head.load(ptr);
    const bodyPtr = ptr + this.head.len();
    // read as a utf8 string
    this.body = String.UTF8.decodeUnsafe(bodyPtr, this.head.dataLen);
  }

  public store(): i32 {
    const ptr = heap.alloc(this.head.dataLen + this.head.len()) as i32;
    this.head.store(ptr);
    let bodyPtr = ptr + this.head.len();
    // utf-16 <--> utf8
    let encoded = Uint8Array.wrap(String.UTF8.encode(this.body));
    for (let i = 0; i < encoded.length; i++) {
      memory.fill(bodyPtr, encoded[i], 1);
      bodyPtr++;
    }

    return ptr;
  }

  head: header;
  body: string; // utf-16 encoder

  constructor(body: string = '') {
    this.body = body;
    this.head = new header(typeIndex.TypeString, String.UTF8.byteLength(body));
  }
}

export class AUint8Array {
  public set(data: Uint8Array): void {
    this.body = data;
    this.head.dataLen = data.length;
  }

  public get(): Uint8Array {
    return this.body;
  }

  public load(ptr: i32): void {
    this.head = new header(0, 0);
    this.head.load(ptr);
    let bodyPtr = ptr + this.head.len();
    this.body = new Uint8Array(this.head.dataLen);
    for (let i = 0; i < this.head.dataLen; i++) {
      this.body[i] = u8(i32.load8_u(bodyPtr));
      bodyPtr++;
    }
  }

  public store(): i32 {
    const ptr = heap.alloc(this.head.dataLen + this.head.len()) as i32;
    this.head.store(ptr);
    let bodyPtr = ptr + this.head.len();
    for (let i = 0; i < this.head.dataLen; i++) {
      memory.fill(bodyPtr, this.body[i], 1);
      bodyPtr++;
    }
    return ptr;
  }

  head: header;
  body: Uint8Array;

  constructor(body: Uint8Array = new Uint8Array(0)) {
    this.body = body;
    this.head = new header(typeIndex.TypeByteArray, body.length);
  }
}

export class ABool {
  public set(data: bool): void {
    this.body = data;
    this.head.dataLen = 1;
  }

  public get(): bool {
    return this.body;
  }

  public load(ptr: i32): void {
    this.head = new header(0, 0);
    this.head.load(ptr);
    const bodyPtr = ptr + this.head.len();
    this.body = u8(i32.load8_u(bodyPtr)) != 0;
  }

  public store(): i32 {
    const ptr = heap.alloc(this.head.dataLen + this.head.len()) as i32;
    this.head.store(ptr);
    const bodyPtr = ptr + this.head.len();
    memory.fill(bodyPtr, this.body ? 1 : 0, 1);
    return ptr;
  }

  head: header;
  body: bool;

  constructor(body: bool = false) {
    this.body = body;
    this.head = new header(typeIndex.TypeBool, 1);
  }
}

export class AI32 {
  public set(data: i32): void {
    this.body = data;
    this.head.dataLen = 4;
  }

  public get(): i32 {
    return this.body;
  }

  public load(ptr: i32): void {
    this.head = new header(0, 0);
    this.head.load(ptr);
    const bodyPtr = ptr + this.head.len();
    this.body = i32.load(bodyPtr);
  }

  public store(): i32 {
    const ptr = heap.alloc(this.head.dataLen + this.head.len()) as i32;
    this.head.store(ptr);
    const bodyPtr = ptr + this.head.len();
    i32.store(bodyPtr, this.body);
    return ptr;
  }

  head: header;
  body: i32;

  constructor(body: i32 = 0) {
    this.body = body;
    this.head = new header(typeIndex.TypeInt32, 4);
  }
}

export class AI64 {
  public set(data: i64): void {
    this.body = data;
    this.head.dataLen = 8;
  }

  public get(): i64 {
    return this.body;
  }

  public load(ptr: i32): void {
    this.head = new header(0, 0);
    this.head.load(ptr);
    const bodyPtr = ptr + this.head.len();
    this.body = i64.load(bodyPtr);
  }

  public store(): i32 {
    const ptr = heap.alloc(this.head.dataLen + this.head.len()) as i32;
    this.head.store(ptr);
    const bodyPtr = ptr + this.head.len();
    i64.store(bodyPtr, this.body);
    return ptr;
  }

  head: header;
  body: i64;

  constructor(body: i64 = 0) {
    this.body = body;
    this.head = new header(typeIndex.TypeInt64, 8);
  }
}
