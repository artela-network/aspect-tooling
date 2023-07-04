
export const  WasmIndexTmpl=`
import { Entry,utils } from "@artela/aspect-libs";
import Aspect from "./aspect/aspect";

const firstAspect = new Aspect();
const entry = new Entry(firstAspect, firstAspect);

export function execute(methodPtr: i32, argPtr: i32): i32 {
  return entry.execute(methodPtr, argPtr);
}

export function isBlockLevel(): i32 {
  return entry.isBlockLevel();
}

export function isTransactionLevel(): i32 {
  return entry.isTransactionLevel();
}

export function allocate(size: i32): i32 {
  return utils.alloc(size);
}`;
