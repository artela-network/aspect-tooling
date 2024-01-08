import { EntryPoint } from './aspect-entry';

export const entryPoint = new EntryPoint();

export function execute(methodPtr: i32, argPtr: i32): i32 {
  return entryPoint.execute(methodPtr, argPtr);
}

export function allocate(size: i32): i32 {
  return __alloc(size) as i32;
}
