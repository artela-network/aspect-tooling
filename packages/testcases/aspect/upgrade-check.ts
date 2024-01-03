import {
    allocate,
    entryPoint,
    execute,
    IPostTxExecuteJP,
    IPreTxExecuteJP,
    PostTxExecuteInput,
    PreTxExecuteInput,
    sys,
    uint8ArrayToHex
} from "@artela/aspect-libs";


class UpgradeCheck implements IPostTxExecuteJP, IPreTxExecuteJP {
    readonly ID_KEY: string = '0'

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
const aspect = new UpgradeCheck()
entryPoint.setAspect(aspect)

// 3.must export it
export { allocate, execute };
