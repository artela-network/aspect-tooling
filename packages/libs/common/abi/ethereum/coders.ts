import {CryptoProvider, UtilityProvider} from "../../../system";

export namespace ethereum {

    export  function encodeAddress(val: ethereum.Address): Uint8Array {
        const s = ethereum.abiEncode("", [val])

        return UtilityProvider.hexToUint8Array(s);
    }
    export function abiEncode(method: string, types: Coder[]): string {
        let enc = '0x';
        if (method.length > 0) {
            const methodSig = method + '(' + types.map((t: Coder) => t.typeName()).join(',') + ')';
            enc += UtilityProvider.uint8ArrayToHex(CryptoProvider.keccak(UtilityProvider.stringToUint8Array(methodSig)).slice(0, 4));
        }

        let inputOffset: u64 = 0;
        for (let i = 0; i < types.length; ++i) {
            inputOffset += types[i].typeSize();
        }

        let variableInput = '';
        for (let i = 0; i < types.length; ++i) {
            const t = types[i];
            const val = t.encodeHex();
            if (t.isDynamicType()) {
                enc += Number.fromU64(inputOffset).encodeHex();
                inputOffset += (val.length >> 1);
                variableInput += val;
            } else {
                enc += val;
            }
        }

        return enc + variableInput;
    }

    enum Type {
        Number,
        BytesN,
        Address,
        Boolean,
        Array,
        Tuple,
        Bytes,
        String,
    }

    export interface Coder {
        /**
         * encode type to hex
         */
        encodeHex(): string;

        /**
         * return name of the type, used to generate function signature
         */
        typeName(): string;

        /**
         * type kind
         */
        typeKind(): Type;

        /**
         * true if type is dynamic, otherwise false
         */
        isDynamicType(): boolean;

        /**
         * encode size of the type
         */
        typeSize(): u64;
    }

    export class ByteArray extends Uint8Array implements Coder {
        protected static validateAndTrimHex(hex: string, paddingLeft: boolean = false): string {
            assert(hex.length % 2 == 0, 'input ' + hex + ' has odd length');

            // Skip possible `0x` prefix.
            if (hex.length >= 2 && hex.charAt(0) == '0' && hex.charAt(1) == 'x') {
                hex = hex.substr(2);
            }

            if (paddingLeft) {
                assert(hex.length <= 64, 'input data length too long');
            }

            return hex;
        }

        protected static calcPaddedLen(hex: string): i32 {
            return ((hex.length / 2 + 32 - 1) / 32 * 32) as i32
        }

        protected static fromHex(hex: string, output: ByteArray, paddingLeft: boolean = false): ByteArray {
            if (paddingLeft) {
                let paddingOffset = (64 - hex.length) >> 1;
                for (let i = 0; i < hex.length; i += 2) {
                    output[paddingOffset + (i >> 1)] = U8.parseInt(hex.substr(i, 2), 16);
                }
            } else {
                for (let i = 0; i < hex.length; i += 2) {
                    output[i >> 1] = U8.parseInt(hex.substr(i, 2), 16);
                }
            }

            return output;
        }

        protected static fromBuffer(buffer: ArrayBuffer, output: ByteArray, paddingLeft: boolean = false): ByteArray {
            const uint8Array = Uint8Array.wrap(buffer);
            if (paddingLeft) {
                const paddingOffset = 32 - buffer.byteLength;
                for (let i = 0; i < buffer.byteLength; ++i) {
                    output[paddingOffset + i] = uint8Array[i];
                }
            } else {
                for (let i = 0; i < buffer.byteLength; ++i) {
                    output[i] = uint8Array[i];
                }
            }

            return output;
        }

        public encodeHex(): string {
            let res = '';
            for (let i = 0; i < this.length; ++i) {
                let hex = this[i].toString(16);
                hex = hex.length % 2 != 0 ? '0' + hex : hex;
                res += hex;
            }

            return res;
        }

        typeName(): string {
            throw new Error("method not implemented.");
        }

        isDynamicType(): boolean {
            return false;
        }

        typeSize(): u64 {
            return 32;
        }

        typeKind(): Type {
            throw new Error("method not implemented.");
        }
    }

    /** A dynamically-sized byte array. */
    export class Bytes extends ByteArray {
        protected readonly contentLen: u64;

        protected constructor(str: string) {
            super(ByteArray.calcPaddedLen(str));
            this.contentLen = str.length;
        }

        /**
         * Convert the string `hex` which must consist of an even number of
         * hexadecimal digits to a `ByteArray`. The string `hex` can optionally
         * start with '0x'
         */
        static fromHexString(str: string): Bytes {
            str = this.validateAndTrimHex(str);
            return changetype<Bytes>(this.fromHex(str, new Bytes(str)));
        }

        public encodeHex(): string {
            return Number.fromU64(this.contentLen).encodeHex() + super.encodeHex();
        }

        public typeName(): string {
            return 'bytes';
        }

        isDynamicType(): boolean {
            return true;
        }

        typeKind(): Type {
            return Type.Bytes;
        }
    }

    export class String extends Bytes {

        static fromString(str: string): String {
            str = this.validateAndTrimHex(str);
            return changetype<String>(this.fromBuffer(utils.encodeStringUTF8(str), new ethereum.String(str)));
        }

        static fromUTF16String(str: string): String {
            return this.fromString(str);
        }

        public typeName(): string {
            return 'string';
        }

        typeKind(): Type {
            return Type.String;
        }
    }

    /** A fixed-sized byte array. */
    export class BytesN extends ByteArray {
        private readonly _byteSize: u8 = 32;

        private constructor(size: u8) {
            super(32);
            this._byteSize = size;
        }


        get byteSize(): u8 {
            return this._byteSize;
        }

        /**
         * Convert the string `hex` which must consist of an even number of
         * hexadecimal digits to a `ByteArray`. The string `hex` can optionally
         * start with '0x'
         */
        static fromHexString(str: string, size: u8 = 32): BytesN {
            assert(size <= 32 && size > 0, 'invalid byte size');

            str = this.validateAndTrimHex(str);
            return changetype<BytesN>(this.fromHex(str, new BytesN(size)));
        }

        public typeName(): string {
            return 'bytes' + this._byteSize.toString(10);
        }

        typeKind(): Type {
            return Type.BytesN;
        }
    }

    export class Number extends ByteArray {
        protected _byteSize: u8 = 32;
        private readonly _signed: boolean;

        protected constructor(signed: boolean = false, bitSize: u16 = 256) {
            assert(bitSize >= 8 && bitSize <= 256, 'number size must between 8 ~ 256');
            assert(bitSize % 8 == 0, 'number size must be multiple of 8');

            super(32);
            this._signed = signed;
            this._byteSize = (bitSize >> 3) as u8;
        }

        get byteSize(): u8 {
            return this._byteSize;
        }

        get bitSize(): u16 {
            return this._byteSize * 8;
        }

        get signed(): boolean {
            return this._signed;
        }

        static fromHexString(str: string, signed: boolean = false, bitSize: u16 = 256): Number {
            return this.fromHexStringWithBuffer(str, new ethereum.Number(signed, bitSize));
        }

        protected static fromHexStringWithBuffer(str: string, buffer: Number): Number {
            str = this.validateAndTrimHex(str);
            return changetype<Number>(this.fromHex(str, buffer, true));
        }

        static fromI8(x: i8, bitSize: u16 = 256): Number {
            return Number.fromI64(x, bitSize);
        }

        static fromU8(x: u8, bitSize: u16 = 256): Number {
            return Number.fromU64(x, bitSize);
        }

        static fromI16(x: i16, bitSize: u16 = 256): Number {
            return Number.fromI16(x, bitSize);
        }

        static fromU16(x: u16, bitSize: u16 = 256): Number {
            return Number.fromU64(x, bitSize);
        }

        static fromI32(x: i32, bitSize: u16 = 256): Number {
            return Number.fromI32(x, bitSize);
        }

        static fromU32(x: u32, bitSize: u16 = 256): Number {
            return Number.fromU64(x, bitSize);
        }

        static fromI64(x: i64, bitSize: u16 = 256): Number {
            return Number.fromU64(x, bitSize, true);
        }

        static fromU64(x: u64, bitSize: u16 = 256, signed: boolean = false): Number {
            assert(bitSize >= 8 && bitSize <= 256, 'number bit size must between 8 ~ 256');
            assert(bitSize % 8 == 0, 'number bit size must be multiple of 8');

            const self = new ethereum.Number(signed, bitSize);

            self[31] = x as u8;
            self[30] = (x >> 8) as u8;
            self[29] = (x >> 16) as u8;
            self[28] = (x >> 24) as u8;
            self[27] = (x >> 32) as u8;
            self[26] = (x >> 40) as u8;
            self[25] = (x >> 48) as u8;
            self[24] = (x >> 56) as u8;

            return self;
        }

        typeName(): string {
            return (this._signed ? 'int' : 'uint') + ((this._byteSize as u16) * 8).toString();
        }

        typeKind(): Type {
            return Type.Number;
        }
    }

    export class Uint extends Number {
        static fromHexString(str: string): Uint {
            return changetype<Uint>(super.fromHexStringWithBuffer(str, new Uint()));
        }

        public typeName(): string {
            return 'uint';
        }
    }

    export class Int extends Number {
        static fromHexString(str: string): Int {
            return changetype<Int>(super.fromHexStringWithBuffer(str, new Int(true)));
        }

        public typeName(): string {
            return 'int';
        }
    }

    /** An Ethereum address (20 bytes). */
    export class Address extends Number {
        private constructor() {
            super(false, 160);
        }

        static fromHexString(str: string): Address {
            assert(str.length == str.startsWith('0x') ? 42 : 40, 'invalid address');
            return changetype<Address>(this.fromHexStringWithBuffer(str, new Address()));
        }

        typeName(): string {
            return 'address';
        }

        typeKind(): Type {
            return Type.Address;
        }
    }

    export class Boolean extends ByteArray {
        private constructor(val: boolean) {
            super(32);
            this[31] = val ? 1 : 0;
        }

        static fromBoolean(x: boolean): Boolean {
            return new ethereum.Boolean(x)
        }

        typeKind(): Type {
            return Type.Boolean;
        }

        public typeName(): string {
            return 'bool';
        }
    }

    export class ArraySlice implements Coder {
        private _elements: Coder[] = [];

        private readonly _size: u64;

        get elementTypeName(): string {
            return this._elements[0].typeName();
        }

        get isFixedSize(): boolean {
            return this._size > 0;
        }

        get elements(): ethereum.Coder[] {
            return this._elements;
        }

        private constructor(coders: ethereum.Coder[], _size: u64) {
            assert(coders.length > 0, 'empty array');
            assert(_size == 0 || coders.length == _size,
                'input does not match fixed array size');

            let typeKind = coders[0].typeKind();

            for (let i = 0; i < coders.length; ++i) {
                if (i > 1) {
                    assert(typeKind == coders[i].typeKind(),
                        'coders in an array must have the same type');
                }
                this._elements.push(coders[i]);
            }

            this._size = _size;
        }

        static fromCoders(coders: ethereum.Coder[], _size: u64 = 0): ethereum.ArraySlice {
            return new ethereum.ArraySlice(coders, _size);
        }

        encodeHex(): string {
            let res = '';
            let valLen = this._elements.length;
            if (!this.isFixedSize) {
                res += ethereum.Number.fromU64(valLen).encodeHex();
            }

            let offset: u64 = 0;
            let offsetRequired = this._elements[0].isDynamicType();
            if (offsetRequired) {
                offset = this._elements[0].typeSize() * valLen;
            }

            let tail = '';
            for (let i = 0; i < valLen; ++i) {
                let e = this._elements[i];
                let val = e.encodeHex();
                if (offsetRequired) {
                    res += ethereum.Number.fromU64(offset).encodeHex();
                    offset += (val.length >> 1);
                    tail += val;
                } else {
                    res += val;
                }
            }

            return res + tail;
        }


        typeName(): string {
            assert(this._elements.length > 0, 'empty array');
            return this._elements[0].typeName() + '[]';
        }

        isDynamicType(): boolean {
            return !this.isFixedSize || this._elements[0].isDynamicType();
        }

        typeSize(): u64 {
            let element = this._elements[0];
            if (this.isFixedSize && !element.isDynamicType()) {
                if (element.typeKind() == Type.Tuple || element.typeKind() == Type.Array) {
                    return this._size * element.typeSize();
                }

                return this._size * 32;
            }

            return 32;
        }

        typeKind(): Type {
            return Type.Array;
        }
    }

    export class Tuple implements Coder {
        private _members: Coder[] = [];

        private constructor(coders: Coder[]) {
            assert(coders.length > 0, 'empty tuple');

            for (let i = 0; i < coders.length; ++i) {
                this._members.push(coders[i]);
            }
        }

        static fromCoders(coders: Coder[]): Tuple {
            return new Tuple(coders);
        }

        get members(): Coder[] {
            return this._members;
        }

        typeName(): string {
            let res = '(';
            for (let i = 0; i < this._members.length; ++i) {
                let typeName = this._members[i].typeName();
                res += (i > 0 ? ',' + typeName : typeName);
            }
            res += ')';

            return res;
        }

        isDynamicType(): boolean {
            for (let i = 0; i < this._members.length; ++i) {
                if (this._members[i].isDynamicType()) {
                    return true;
                }
            }

            return false;
        }

        typeKind(): Type {
            return Type.Tuple;
        }

        typeSize(): u64 {
            if (this.isDynamicType()) {
                return 32;
            }

            let total: u64 = 0;
            for (let i = 0; i < this._members.length; ++i) {
                total += this._members[i].typeSize();
            }

            return total;
        }

        encodeHex(): string {
            let offset: u64 = 0;
            for (let i = 0; i < this._members.length; ++i) {
                offset += this._members[i].typeSize();
            }

            let res = '';
            let tail = '';

            for (let i = 0; i < this._members.length; ++i) {
                let m = this._members[i];
                const val = m.encodeHex();
                if (m.isDynamicType()) {
                    res += Number.fromU64(offset).encodeHex();
                    tail += val;
                    offset += (val.length >> 1);
                } else {
                    res += val;
                }
            }

            return res + tail;
        }
    }
}