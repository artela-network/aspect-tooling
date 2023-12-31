import { Protobuf } from 'as-proto/assembly';
import { Writer } from 'as-proto/assembly/Writer';
import { Any } from '../../proto';
import { ABool, AUint8Array } from '../wraptypes/basic-types';

export class MessageUtil {
  private static _instance: MessageUtil | null;
  private constructor() {}

  public static instance(): MessageUtil {
    if (!this._instance) {
      this._instance = new MessageUtil();
    }
    return this._instance!;
  }

  public LoadInputBytes(argPtr: i32): Uint8Array {
    const arg = new AUint8Array();
    arg.load(argPtr);
    return arg.get();
  }

  public StoreOutputBool(out: bool): i32 {
    const b = new ABool();
    b.set(out);
    return b.store();
  }

  public ToAny<TMessage>(
    typeUrl: string,
    message: TMessage,
    encoder: (message: TMessage, writer: Writer) => void,
  ): Any {
    const uint8Array = Protobuf.encode(message, encoder);
    return new Any(typeUrl, uint8Array);
  }

  public StringData: string = 'aspect.v2.StringData';
  public IntData: string = 'aspect.v2.IntData';
  public BoolData: string = 'aspect.v2.BoolData';
  public BytesData: string = 'aspect.v2.BytesData';
  public SateChangeQuery: string = 'aspect.v2.SateChangeQuery';
  public CallStackQuery: string = 'aspect.v2.CallStackQuery';
}
