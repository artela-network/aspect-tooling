import { ResultUnwrap } from './key-path';
import { BytesData, EthBlockHeader, IntData, StringData, TxExtProperty } from '../proto';
import { Protobuf } from 'as-proto/assembly';

export class EthBlockHeaderUnwrap implements ResultUnwrap<EthBlockHeader> {
  public decode(u: Uint8Array): EthBlockHeader {
    return Protobuf.decode<EthBlockHeader>(u, EthBlockHeader.decode);
  }
}

export class StringUnwrap implements ResultUnwrap<string> {
  public decode(u: Uint8Array): string {
    const stringData = Protobuf.decode<StringData>(u, StringData.decode);
    return stringData.data;
  }
}

export class Uint64Unwrap implements ResultUnwrap<u64> {
  public decode(u: Uint8Array): u64 {
    const intData = Protobuf.decode<IntData>(u, IntData.decode);
    return <u64>intData.data;
  }
}

export class Uint8ArrayUnwrap implements ResultUnwrap<Uint8Array> {
  public decode(u: Uint8Array): Uint8Array {
    const bytesData = Protobuf.decode<BytesData>(u, BytesData.decode);
    return bytesData.data;
  }
}

export class TxExtPropertyUnwrap implements ResultUnwrap<TxExtProperty> {
  public decode(u: Uint8Array): TxExtProperty {
    return Protobuf.decode<TxExtProperty>(u, TxExtProperty.decode);
  }
}
