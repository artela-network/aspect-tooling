import {ResultUnwrap} from "./key-path";
import {BytesData, EthBlockHeader, IntData, StringData} from "../proto";
import {Protobuf} from "as-proto/assembly";

export class EthBlockHeaderUnwrap implements ResultUnwrap<EthBlockHeader> {
    public decode(u: Uint8Array): EthBlockHeader {
        return Protobuf.decode(u, EthBlockHeader.decode);
    }
}

export class StringUnwrap implements ResultUnwrap<String> {
    public decode(u: Uint8Array): String {
        const stringData = Protobuf.decode(u, StringData.decode);
        return stringData.data
    }
}

export class Uint64Unwrap implements ResultUnwrap<u64> {
    public decode(u: Uint8Array): u64 {
        const intData = Protobuf.decode(u, IntData.decode);
        return <u64>intData.data
    }
}

export class Uint8ArrayUnwrap implements ResultUnwrap<Uint8Array> {
    public decode(u: Uint8Array): Uint8Array {
        const bytesData = Protobuf.decode(u, BytesData.decode);
        return bytesData.data
    }
}
