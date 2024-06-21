export class Uint256 {
    private data: Array<u64> = new Array<u64>(4);

    // Constructors
    constructor(value: u64 = 0) {
        this.data[0] = value;
        this.data[1] = 0;
        this.data[2] = 0;
        this.data[3] = 0;
    }

    private isZero(): bool {
        return this.data[0] == 0 && this.data[1] == 0 && this.data[2] == 0 && this.data[3] == 0;
    }

    private isValidHexCharacter(char: string): bool {
        let charCode = char.charCodeAt(0);
        return (
            (charCode >= 48 && charCode <= 57) ||  // 0-9
            (charCode >= 65 && charCode <= 70) ||  // A-F
            (charCode >= 97 && charCode <= 102)    // a-f
        );
    }

    private isValidHexString(hexString: string): bool {
        for (let i = 0; i < hexString.length; i++) {
            if (!this.isValidHexCharacter(hexString.charAt(i))) {
                return false;
            }
        }
        return true;
    }

    public add(other: Uint256): Uint256 {
        let result = new Uint256(0);
        let carry: u64 = 0;

        for (let i = 0; i < 4; i++) {
            let sum = this.data[i] + other.data[i] + carry;
            result.data[i] = sum;

            if (sum < this.data[i] || sum - carry < other.data[i]) {
                carry = 1;
            } else {
                carry = 0;
            }
        }

        return result;
    }

    public addU64(other: u64): Uint256 {
        let result = new Uint256(0);
        let carry: u64 = 0;

        let sum = this.data[0] + other + carry;
        result.data[0] = sum;
        if (sum < this.data[0]) {
            carry = 1;
        } else {
            carry = 0;
        }

        for (let i = 1; i < 4; i++) {
            sum = this.data[i] + carry;
            result.data[i] = sum;
            if (sum < this.data[i]) {
                carry = 1;
            } else {
                carry = 0;
            }
        }

        return result;
    }

    public sub(other: Uint256): Uint256 {
        let result = new Uint256(0);
        let borrow: u64 = 0;

        for (let i = 0; i < 4; i++) {
            let diff: u64;
            let otherValue = other.data[i];

            if (this.data[i] >= otherValue + borrow) {
                diff = this.data[i] - otherValue - borrow;
                borrow = 0;
            } else {
                diff = u64.MAX_VALUE - otherValue + this.data[i] + 1 - borrow;
                borrow = 1;
            }

            result.data[i] = diff;
        }

        return result;
    }

    public mul(other: Uint256): Uint256 {
        let result = new Uint256(0);

        for (let i = 0; i < 4; i++) {
            let carry: u64 = 0;

            for (let j = 0; j < 4; j++) {
                if (i + j < 4) {
                    let product = this.data[j] * other.data[i] + result.data[i + j] + carry;
                    result.data[i + j]
                    result.data[i + j] = product;

                    if (product < result.data[i + j]) {
                        carry = (product - result.data[i + j]) / u64.MAX_VALUE;
                    } else {
                        carry = 0;
                    }
                }
            }
        }
        return result;
    }

    public div(other: Uint256): Uint256 {
        if (other.isZero()) {
            throw new Error("Division by zero");
        }

        let result = new Uint256(0);
        let remainder = new Uint256(0);
        for (let i = 3; i >= 0; i--) {
            remainder = remainder.mulU64(u64.MAX_VALUE).addU64(this.data[i]);
            if (!remainder.isZero()) {
                let segmentResult = remainder.data[0] / other.data[0];  // Simplification
                result.data[i] = segmentResult;
                remainder = remainder.sub(other.mulU64(segmentResult));
            }
        }

        return result;
    }

    public divU64(other: u64): Uint256 {
        if (other == 0) {
            throw new Error("Division by zero");
        }

        let result = new Uint256(0);
        let carry: u64 = 0;

        for (let i = 3; i >= 0; i--) {
            let temp = (carry * u64.MAX_VALUE) + this.data[i];
            result.data[i] = temp / other;
            carry = temp % other;
        }

        return result;
    }

    public mulU64(other: u64): Uint256 {
        let result = new Uint256(0);
        let carry: u64 = 0;

        for (let i = 0; i < 4; i++) {
            let product = this.data[i] * other + carry;
            result.data[i] = product;

            if (product < this.data[i]) {
                carry = (product - result.data[i]) / u64.MAX_VALUE;
            } else {
                carry = 0;
            }
        }

        return result;
    }

    public mod(other: Uint256): Uint256 {
        return this.sub(this.div(other).mul(other));
    }

    // public mod64(other: u64): Uint256 {
    //     return this.sub(this.divU64(other).mulU64(other))
    // }

    public pow(exponent: u64): Uint256 {
        let result = new Uint256(1);
        let base = this.clone();

        while (exponent > 0) {
            if (exponent & 1) {
                result = result.mul(base);
            }
            base = base.mul(base);
            exponent >>= 1;
        }

        return result;
    }

    public sqrt(): Uint256 {
        if (this.isZero()) {
            return new Uint256(0);
        }

        let x0 = new Uint256(1);
        let x1 = this.add(x0).divU64(2);

        while (x1.sub(x0).data[3] == 0) {
            x0 = x1;
            x1 = x1.add(this.div(x1)).divU64(2);
        }

        return x0;
    }

    public cmp(other: Uint256): i32 {
        for (let i = 3; i >= 0; i--) {
            if (this.data[i] > other.data[i]) {
                return 1;
            } else if (this.data[i] < other.data[i]) {
                return -1;
            }
        }
        return 0;
    }

    public toUint8Array(): Uint8Array {
        let result = new Uint8Array(32);
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 8; j++) {
                result[31 - ((i << 3) + j)] = <u8>(this.data[i] >> (j << 3));
            }
        }
        return result;
    }

    public fromUint8Array(bytes: Uint8Array): Uint256  {
        let value = new Uint256();
        for (let i = 0; i < 4; i++) {
            let u64value: u64 = 0;
            for (let j = 0; j < 8; j++) {
                let byteValue = <u64>(bytes[31 - ((i << 3) + j)]);
                u64value |= byteValue << (j << 3);
            }
            value.data[i] = u64value;
        }
        return value
    }

    public toHex(): string {
        const hexChars = '0123456789abcdef';
        const result = new Uint8Array(64);

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 8; j++) {
                let byte = <u8>(this.data[i] >> (j << 3));
                let index = (i << 3) + j;
                result[63 - ( index << 1)] = hexChars.charCodeAt(byte & 0x0f);
                result[63 - ((index << 1) + 1)] = hexChars.charCodeAt(byte >> 4);
            }
        }
        return String.UTF8.decode(result.buffer);
    }

    public fromHex(hexString: string): Uint256 {
        if (hexString.startsWith("0x")) {
            hexString = hexString.substring(2)
        }
        if (hexString.length > 64) {
            throw new Error("Hex string length must be less than 64 characters");
        }

        if (!this.isValidHexString(hexString)) {
            throw new Error("Hex string is not valid");
        }

        hexString = hexString.padStart(64, '0');

        let value = new Uint256();
        for (let i = 0; i < 4; i++) {
            let u64value: u64 = 0;
            for (let j = 0; j < 8; j++) {
                let byteString = hexString.substring(62 - ((i << 4) + (j << 1)), 64 - ((i << 4) + (j << 1)));
                // let byteValue = <u64>parseInt(byteString, 16);
                let byteValue = U64.parseInt(byteString, 16);
                u64value |= byteValue << (j << 3);
            }
            value.data[i] = u64value;
        }
        return value;
    }

    // public fromDecimal(decimalString: string): Uint256 {
    // }
    //
    // public toDecimal(): string {
    // }

    public toInt8(): i8 {
        return <i8>this.data[0];
    }

    public toUInt8(): u8 {
        return <u8>this.data[0];
    }

    public toInt16(): i16 {
        return <i16>this.data[0];
    }

    public toUInt16(): u16 {
        return <u16>this.data[0];
    }

    public toInt32(): i32 {
        return <i32>this.data[0];
    }

    public toUInt32(): u32 {
        return <u32>this.data[0];
    }

    public toInt64(): i64 {
        return <i64>this.data[0];
    }

    public toUInt64(): u64 {
        return this.data[0];
    }

    public clone(): Uint256 {
        let cloned = new Uint256(0);
        for (let i = 0; i < 4; i++) {
            cloned.data[i] = this.data[i];
        }
        return cloned;
    }

    static get ZERO(): Uint256 {
        return new Uint256(0);
    }

    static fromHex(hexString: string): Uint256 {
        return new Uint256().fromHex(hexString);
    }

    static toHex(value: Uint256): string {
        return value.toHex();
    }

    // static fromDecimal(decimalString: string): Uint256 {
    //     return new Uint256().fromDecimal(decimalString);
    // }
    //
    // static toDecimal(value: Uint256): string {
    //     return value.toDecimal();
    // }

    static fromUint8Array(data: Uint8Array): Uint256 {
        return new Uint256().fromUint8Array(data);
    }

    static toUint8Array(value: Uint256): Uint8Array {
        return value.toUint8Array();
    }

    static fromInt16(value: i16): Uint256 {
        return new Uint256(<u64>value);
    }
    static fromUInt16(value: u16): Uint256 {
        return new Uint256(<u64>value);
    }
    static fromInt32(value: i32): Uint256 {
        return new Uint256(<u64>value);
    }
    static fromUInt32(value: u32): Uint256 {
        return new Uint256(<u64>value);
    }
    static fromInt64(value: i64): Uint256 {
        return new Uint256(<u64>value);
    }
    static fromUInt64(value: u64): Uint256 {
        return new Uint256(value);
    }
}
