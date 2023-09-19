import {BytesArrayData} from "../proto";
import {Protobuf} from "as-proto/assembly";
import {UtilityProvider} from "../system";
import {ethereum} from "../common";

export class KeysBundle {
    _bytesAry: BytesArrayData

    constructor() {
        this._bytesAry = new BytesArrayData()
    }

    static NewBuilder(): KeysBundle {
        return new KeysBundle()
    }

    // 少个copy

    public fromString(data: string): KeysBundle {
        const dataAry = UtilityProvider.stringToUint8Array(data)
        this._bytesAry.data.push(dataAry)
        return this
    }

    public fromI8(x: i8): KeysBundle {
        const dataAry: Uint8Array = ethereum.Number.fromI64(x);
        this._bytesAry.data.push(dataAry)
        return this
    }

    public fromU8(x: u8): KeysBundle {
        const dataAry: Uint8Array = ethereum.Number.fromU64(x);
        this._bytesAry.data.push(dataAry)
        return this
    }

    public fromI16(x: i16): KeysBundle {
        const dataAry: Uint8Array = ethereum.Number.fromI16(x);
        this._bytesAry.data.push(dataAry)
        return this
    }

    public fromU16(x: u16): KeysBundle {
        const dataAry: Uint8Array = ethereum.Number.fromU64(x);
        this._bytesAry.data.push(dataAry)
        return this
    }

    public fromI32(x: i32): KeysBundle {
        const dataAry: Uint8Array = ethereum.Number.fromI32(x);
        this._bytesAry.data.push(dataAry)
        return this
    }

    public fromU32(x: u32): KeysBundle {
        const dataAry: Uint8Array = ethereum.Number.fromU64(x);
        this._bytesAry.data.push(dataAry)
        return this
    }

    public fromI64(x: i64): KeysBundle {
        const dataAry: Uint8Array = ethereum.Number.fromU64(x, 256, true);
        this._bytesAry.data.push(dataAry)
        return this
    }

    public fromU64(x: u64): KeysBundle {
        const dataAry: Uint8Array = ethereum.Number.fromU64(x);
        this._bytesAry.data.push(dataAry)
        return this
    }


    public marshal(): string {
        if (!this._bytesAry||!this._bytesAry.data || this._bytesAry.data.length == 0) {
            return ""
        }
        const uint8Array = Protobuf.encode(this._bytesAry, BytesArrayData.encode);
        return UtilityProvider.uint8ArrayToHex(uint8Array)
    }
}
