import { Protobuf } from 'as-proto/assembly';
import { uint8ArrayToHex } from '../../common';
import { RuntimeContextApi } from '../../hostapi';
import { BytesData, UintData } from '../../proto';

const runtimeContextApi = RuntimeContextApi.instance();

export class AspectContext {
  private static _instance: AspectContext | null;

  private constructor() {}

  public get id(): string {
    const raw = runtimeContextApi.get('aspect.id');
    const id = Protobuf.decode<BytesData>(raw, BytesData.decode).data;
    return uint8ArrayToHex(id);
  }

  public get version(): u64 {
    const raw = runtimeContextApi.get('aspect.version');
    return Protobuf.decode<UintData>(raw, UintData.decode).data;
  }

  public static instance(): AspectContext {
    if (!this._instance) {
      this._instance = new AspectContext();
    }
    return this._instance!;
  }
}
