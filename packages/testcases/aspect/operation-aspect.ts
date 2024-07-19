// The entry file of your WebAssembly module.

import {
    allocate, BigInt,
    entryPoint,
    execute,
    IAspectOperation,
    InitInput,
    OperationInput,
    stringToUint8Array,
    sys,
} from '@artela/aspect-libs';

class AspectTest implements IAspectOperation {
    operation(input: OperationInput): Uint8Array {

        const num = sys.aspect.property.get<u32>("num");
        sys.log("||| num = " + num.toString(10));

        sys.require(input.callData.length > 0, 'data is lost');

        const hash = input.tx!.hash;
        const subHash = hash.slice(0,8);
        const seed = BigInt.fromUint8ArrayWithSign(subHash).toInt64();
        Math.seedRandom(seed);
        const random = Math.random();

        return stringToUint8Array(random.toString());
    }

    isOwner(sender: Uint8Array): bool {
        return true;
    }

    init(input: InitInput): void {}
}

// 2.register aspect Instance
const aspect = new AspectTest();
entryPoint.setOperationAspect(aspect);

// 3.must export it
export {execute, allocate};
