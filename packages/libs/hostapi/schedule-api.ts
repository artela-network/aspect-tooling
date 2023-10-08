import { Protobuf } from 'as-proto/assembly';
import { ABool, AUint8Array } from '../common';
import { ScheduleMsg } from '../proto';

declare namespace __ScheduleApi__ {
  function submit(sch: i32): i32;
}

export class ScheduleApi {
  private static _instance: ScheduleApi | null;

  private constructor() {}

  public submit(sch: ScheduleMsg): bool {
    const encoded = Protobuf.encode(sch, ScheduleMsg.encode);
    const input = new AUint8Array();
    input.set(encoded);
    const inputPtr = input.store();
    const outPtr = __ScheduleApi__.submit(inputPtr);
    const output = new ABool();
    output.load(outPtr);
    return output.get();
  }

  public static instance(): ScheduleApi {
    if (!this._instance) {
      this._instance = new ScheduleApi();
    }
    return this._instance!;
  }
}
