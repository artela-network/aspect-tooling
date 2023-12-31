import {
    IPostTxExecuteJP,
    IPreTxExecuteJP,
    PostTxExecuteInput,
    PreTxExecuteInput,
    allocate,
    entryPoint,
    execute,
    sys,
    uint8ArrayToHex,
    uint8ArrayToString
} from "@artela/aspect-libs";


export class CrossPhaseState implements IPostTxExecuteJP, IPreTxExecuteJP {
    keyForTest: string = "key_for_cross_consensus_phase_state_test"
    valueForTest: string = "value for test"

    isOwner(sender: Uint8Array): bool {
        const value = sys.aspect.property.get<Uint8Array>("owner")
        return !!uint8ArrayToHex(value).includes(uint8ArrayToString(sender));
    }

    preTxExecute(input: PreTxExecuteInput): void {
        sys.aspect.mutableState.get<string>(this.keyForTest).set(this.valueForTest)
        sys.aspect.transientStorage.get<string>(this.keyForTest).set(this.valueForTest)
    }

    postTxExecute(input: PostTxExecuteInput): void {
        const transientStorageResult = sys.aspect.transientStorage.get<string>(this.keyForTest).unwrap()
        if (transientStorageResult !== this.valueForTest) {
            sys.revert('incorrect value from transientStorage')
        }

        const mutableStateResult = sys.aspect.mutableState.get<string>(this.keyForTest).unwrap()
        if (mutableStateResult !== this.valueForTest) {
            sys.revert('incorrect value from mutableState')
        }
    }
}

const aspect = new CrossPhaseState()
entryPoint.setAspect(aspect)

// 3.must export it
export { allocate, execute };

