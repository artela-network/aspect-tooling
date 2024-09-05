import {
    allocate,
    entryPoint,
    execute,
    InitInput,
    IPostTxExecuteJP,
    IPreTxExecuteJP,
    PostTxExecuteInput,
    PreTxExecuteInput,
    sys,
    uint8ArrayToHex
} from "@artela/aspect-libs";


class UpgradeTestAspect implements IPostTxExecuteJP, IPreTxExecuteJP {
    init(input: InitInput): void {}

    isOwner(sender: Uint8Array): bool {
        const value = sys.aspect.property.get<Uint8Array>("owner");
        return uint8ArrayToHex(value).includes(uint8ArrayToHex(sender));
    }

    preTxExecute(input: PreTxExecuteInput): void {

    }

    postTxExecute(input: PostTxExecuteInput): void {

    }
}

// 2.register aspect Instance
const aspect = new UpgradeTestAspect()
entryPoint.setAspect(aspect)

// 3.must export it
export { allocate, execute };
