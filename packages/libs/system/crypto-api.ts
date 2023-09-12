import {AI32, AUint8Array} from "../types";

declare namespace __CryptoApi__ {
    function hash(hasher: i32, dataPtr: i32): i32;
}

enum Hasher {
    Keccak,
}

class Crypto {
    public keccak(data: Uint8Array): Uint8Array {
        const dataPtr = new AUint8Array(data).store();
        const hashes = new AI32(Hasher.Keccak as i32).store();
        const resPtr = __CryptoApi__.hash(hashes, dataPtr);
        const resRaw = new AUint8Array();
        resRaw.load(resPtr);

        return resRaw.body;
    }
}

export const CryptoProvider = new Crypto();
