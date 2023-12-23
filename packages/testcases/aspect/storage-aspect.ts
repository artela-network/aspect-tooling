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


export class StoreAspect implements IPostTxExecuteJP, IPreTxExecuteJP {


    isOwner(sender: Uint8Array): bool {
        const value = sys.aspect.property.get<Uint8Array>("owner")
        return !!uint8ArrayToHex(value).includes(uint8ArrayToString(sender));
    }


    preTxExecute(input: PreTxExecuteInput): void {
        //for smart contract call
        sys.aspect.transientStorage.get<string>("aspectSetKey").set<string>("HelloWord")
    }

    postTxExecute(input: PostTxExecuteInput): void {
        const to = uint8ArrayToHex(input.tx!.to);
        const value = sys.aspect.transientStorage.get<string>("contractSetKey", to).unwrap();
        //when contract setAspectContext this value equals  `HelloAspect`
        sys.log("==postTxExecute==" + value)
    }


}

// 2.register aspect Instance
const aspect = new StoreAspect()
entryPoint.setAspect(aspect)

// 3.must export it
export {execute, allocate}
