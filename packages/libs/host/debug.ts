import { AString } from '../message';

declare namespace __debug__ {
  function log(ptr: i32): void;
}

export namespace debug {
  export function log(data: string): void {
    let dataPtr = new AString(data).store();
    __debug__.log(dataPtr);
  }
}
