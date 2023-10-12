// The entry file of your WebAssembly module.

import { sys } from '@artela/aspect-libs';

export function TestNotNull(): Uint8Array {
  const uint8Array = sys.utils.hexToUint8Array('0x00000');
  return sys.crypto.keccak(uint8Array);
}
