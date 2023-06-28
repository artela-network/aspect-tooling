// The entry file of your WebAssembly module.

import {utils} from "./common";

export * from "./types";
export * from "./abi";
export * from "./common";
export * from "./states";
export * from "./entry";
export * from "./host";
export * from "./scheduler";
export * from "./proto";

export function allocate(size: i32): i32 {
  return utils.alloc(size);
}