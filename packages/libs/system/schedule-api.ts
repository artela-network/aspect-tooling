import {
    ScheduleMsg,
} from "../proto";
import {ABool, AUint8Array} from "../types";
import {Protobuf} from "as-proto/assembly";

declare namespace __ScheduleApi__ {
    function submit(sch: i32): i32
}

class Schedule {
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
}


export const ScheduleAccessor = new Schedule()