/** Exported memory */
export declare const memory: WebAssembly.Memory;
/**
 * assembly/test/operation-test/execute
 * @param methodPtr `i32`
 * @param argPtr `i32`
 * @returns `i32`
 */
export declare function execute(methodPtr: number, argPtr: number): number;
/**
 * assembly/test/operation-test/allocate
 * @param size `i32`
 * @returns `i32`
 */
export declare function allocate(size: number): number;
