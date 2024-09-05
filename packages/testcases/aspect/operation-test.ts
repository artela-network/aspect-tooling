// The entry file of your WebAssembly module.

import {
    allocate,
    entryPoint,
    execute,
    IAspectOperation,
    OperationInput,
    uint8ArrayToHex,
    sys,
    InitInput,
} from '@artela/aspect-libs';

class AspectTest implements IAspectOperation {
    init(input: InitInput): void { }

    parseOP(calldata: string): string {
        if (calldata.startsWith('0x')) {
            return calldata.substring(2, 6);
        }
        return calldata.substring(0, 4);

    }

    parsePrams(calldata: string): string {
        if (calldata.startsWith('0x')) {
            return calldata.substring(6, calldata.length);
        }
        return calldata.substring(4, calldata.length);

    }

    operation(input: OperationInput): Uint8Array {
        // calldata encode rule
        // * 2 bytes: op code
        //      op codes lists:
        //           0x0001 | registerSysPlayer
        //
        //           ** 0x10xx means read only op **
        //           0x1001 | getSysPlayers
        //           0x1002 | getAAWaletNonce
        //
        // * variable-length bytes: params
        //      encode rule of params is defined by each method
        const calldata = uint8ArrayToHex(input.callData);
        const op = this.parseOP(calldata);
        const params = this.parsePrams(calldata);

        sys.log("||| num = " + calldata + "  params=" + params + " op=" + op);
        if (op == "0001") {
            if (params == "100001") {
                sys.log('||| adamayu in 0001');
                return new Uint8Array(0);
            }
            sys.revert("unknown params");
            return new Uint8Array(0);
        }
        if (op == "0002") {
            sys.log('|||adamayu in 0002');
            return new Uint8Array(0);
        }
        if (op == "0003") {
            sys.log('|||adamayu in 0003');
            return new Uint8Array(0);
        }
        if (op == "1001") {
            sys.log('|||adamayu in 1001');
            return new Uint8Array(0);
        }
        if (op == "1002") {
            sys.log('|||adamayu in 1002');
            return new Uint8Array(0);
        }
        if (op == "1003") {
            if (params == "101003") {
                sys.log('||| adamayu in 1003');
                return new Uint8Array(0);
            }
            sys.revert("unknown params");
            return new Uint8Array(0);
        }
        if (op == "1004") {
            sys.log('|||adamayu in 1004');
            return new Uint8Array(0);
        }

        sys.revert("unknown op");
        return new Uint8Array(0);
    }

    isOwner(sender: Uint8Array): bool {
        return true;
    }
}

// 2.register aspect Instance
const aspect = new AspectTest();
entryPoint.setOperationAspect(aspect);

// 3.must export it
export { execute, allocate };
