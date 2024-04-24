// The entry file of your WebAssembly module.

import {
    allocate, BigInt,
    entryPoint,
    execute, fromUint8Array,
    IPreContractCallJP,
    PreContractCallInput,
    sys,
} from '@artela/aspect-libs';

class GuardPoolAspect implements IPreContractCallJP {
    isOwner(sender: Uint8Array): bool {
        return true;
    }


    preContractCall(input: PreContractCallInput): void {
        //get the value from tx
        const currentVal = fromUint8Array<BigInt>(input.call!.value);


        const target = BigInt.fromUInt64(10000);
        //if the value is greater than 100000 then revert
        if (currentVal.compareTo(target) > 0) {
            sys.revert('revert');
        }
    }

}

// 2.register aspect Instance
const aspect = new GuardPoolAspect();
entryPoint.setAspect(aspect);

// 3.must export it
export {execute, allocate};
