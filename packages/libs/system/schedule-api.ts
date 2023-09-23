import { ScheduleMsg } from '../proto';
import { ABool, AUint8Array } from '../types';
import { Protobuf } from 'as-proto/assembly';

declare namespace __ScheduleApi__ {
  function submit(sch: i32): i32;
}

export class Scheduler {
  private static instance: Scheduler;

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

  public static get(): Scheduler {
    Scheduler.instance ||= new Scheduler();
    return Scheduler.instance;
  }
}
