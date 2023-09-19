// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0
//   protoc        v4.23.2

import { Writer, Reader } from "as-proto/assembly";

export class TxExtProperty {
  static encode(message: TxExtProperty, writer: Writer): void {
    const property = message.property;
    if (property !== null) {
      const propertyKeys = property.keys();
      for (let i: i32 = 0; i < propertyKeys.length; ++i) {
        const propertyKey = propertyKeys[i];
        writer.uint32(10);
        writer.fork();
        writer.uint32(10);
        writer.string(propertyKey);
        writer.uint32(18);
        writer.string(property.get(propertyKey));
        writer.ldelim();
      }
    }
  }

  static decode(reader: Reader, length: i32): TxExtProperty {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new TxExtProperty();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          let propertyKey: string = "";
          let propertyValue: string = "";
          let propertyHasKey: bool = false;
          let propertyHasValue: bool = false;
          for (
            const end: usize = reader.ptr + reader.uint32();
            reader.ptr < end;

          ) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
              case 1:
                propertyKey = reader.string();
                propertyHasKey = true;
                break;

              case 2:
                propertyValue = reader.string();
                propertyHasValue = true;
                break;

              default:
                reader.skipType(tag & 7);
                break;
            }
            if (message.property === null) {
              message.property = new Map<string, string>();
            }
            const property = message.property;
            if (property !== null && propertyHasKey && propertyHasValue) {
              property.set(propertyKey, propertyValue);
            }
          }
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  property: Map<string, string>;

  constructor(property: Map<string, string> = new Map()) {
    this.property = property;
  }
}
