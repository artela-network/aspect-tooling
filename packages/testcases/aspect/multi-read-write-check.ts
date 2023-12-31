import {
    allocate,
    entryPoint,
    execute,
    IPostTxExecuteJP,
    IPreTxExecuteJP,
    PostTxExecuteInput,
    PreTxExecuteInput,
    sys,
    uint8ArrayToHex,
    uint8ArrayToString
} from "@artela/aspect-libs";

 class MultiReadWriteCheck implements IPostTxExecuteJP, IPreTxExecuteJP {
    ctxKey: string = 'key_for_context'
    stateKey: string = 'key_for_state'

    isOwner(sender: Uint8Array): bool {
        const value = sys.aspect.property.get<Uint8Array>("owner")
        return !!uint8ArrayToHex(value).includes(uint8ArrayToString(sender));
    }


    preTxExecute(input: PreTxExecuteInput): void {
        this.checkMultiReadWriteForContext()
       // this.checkMultiReadWriteForState()
    }

    postTxExecute(input: PostTxExecuteInput): void {
        this.checkMultiReadWriteForContext()
       // this.checkMultiReadWriteForState()
    }

    checkMultiReadWriteForContext(): void {
        const minValueForTest: u64 = 1
        const maxValueForTest: u64 = 10

        let valueForTest: u64 = minValueForTest
        sys.aspect.transientStorage.get<u64>(this.ctxKey).set<u64>(valueForTest)

        const number = sys.aspect.transientStorage.get<u64>(this.ctxKey).unwrap();

        if (number !== valueForTest) {
            sys.revert('incorrect context value after single writing')
        }

        for (valueForTest = minValueForTest; valueForTest <= maxValueForTest; valueForTest++) {
            sys.aspect.transientStorage.get<u64>(`${this.ctxKey}_${valueForTest}`).set<u64>(valueForTest)
            sys.aspect.transientStorage.get<u64>(this.ctxKey).set<u64>(valueForTest)
        }

        if (sys.aspect.transientStorage.get<u64>(this.ctxKey).unwrap() !== maxValueForTest) {
            sys.revert('incorrect context value after duplicate writing')
        }

        for (valueForTest = minValueForTest; valueForTest <= maxValueForTest; valueForTest++) {
            if (sys.aspect.transientStorage.get<u64>(`${this.ctxKey}_${valueForTest}`).unwrap() !== valueForTest) {
                sys.revert('incorrect context value after batch writing')
            }
        }

        valueForTest = u64(minValueForTest + (maxValueForTest - minValueForTest) / 2)
        sys.aspect.transientStorage.get<u64>(this.ctxKey).set<u64>(valueForTest)

        for (let i = 0; i <= 10; i++) {
            if (sys.aspect.transientStorage.get<u64>(this.ctxKey).unwrap() !== valueForTest) {
                sys.revert('incorrect context value during multiple reading')
            }
        }

    }
 
    checkMultiReadWriteForState(): void {
        const minValueForTest: u64 = 1
        const maxValueForTest: u64 = 10

        let valueForTest: u64 = minValueForTest
        sys.aspect.mutableState.get<u64>(this.stateKey).set<u64>(valueForTest)
        if (sys.aspect.mutableState.get<u64>(this.stateKey).unwrap() !== valueForTest) {
            sys.revert('incorrect context value after single writing')
        }

        for (valueForTest = minValueForTest; valueForTest <= maxValueForTest; valueForTest++) {
            sys.aspect.mutableState.get<u64>(`${this.stateKey}_${valueForTest}`).set<u64>(valueForTest)
            sys.aspect.mutableState.get<u64>(this.stateKey).set<u64>(valueForTest)
        }

        if (sys.aspect.mutableState.get<u64>(this.stateKey).unwrap() !== maxValueForTest) {
            sys.revert('incorrect context value after duplicate writing')
        }

        for (valueForTest = minValueForTest; valueForTest <= maxValueForTest; valueForTest++) {
            if (sys.aspect.mutableState.get<u64>(`${this.stateKey}_${valueForTest}`).unwrap() !== valueForTest) {
                sys.revert('incorrect context value after batch writing')
            }
        }

        valueForTest = u64(minValueForTest + (maxValueForTest - minValueForTest) / 2)
        sys.aspect.mutableState.get<u64>(this.stateKey).set<u64>(valueForTest)

        for (let i = 0; i <= 10; i++) {
            if (sys.aspect.mutableState.get<u64>(this.stateKey).unwrap() !== valueForTest) {
                sys.revert('incorrect context value during multiple reading')
            }
        }
    }
}

// 2.register aspect Instance
const aspect = new MultiReadWriteCheck()
entryPoint.setAspect(aspect)

// 3.must export it
export { allocate, execute };

