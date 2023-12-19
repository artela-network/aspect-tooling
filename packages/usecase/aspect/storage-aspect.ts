import {
    allocate,
    entryPoint,
    execute,
    IPostTxExecuteJP,
    IPreTxExecuteJP,
    PostTxExecuteCtx,
    PreTxExecuteCtx,
    sys
} from "@artela/aspect-libs";


export class StoreAspect implements IPostTxExecuteJP, IPreTxExecuteJP {


    isOwner(sender: string): bool {
        const value = sys.aspect.property.get<string>("owner")
        return !!value.includes(sender);
    }



    preTxExecute(ctx: PreTxExecuteCtx): void {
        //for smart contract call
        ctx.aspect.transientStorage<string>("aspectSetKey").set<string>("HelloWord")
    }

    postTxExecute(ctx: PostTxExecuteCtx): void {
        const to = ctx.tx.content.unwrap()!.to;
        const value = ctx.aspect.transientStorage<string>("contractSetKey",to).unwrap();
        //when contract setAspectContext this value equals  `HelloAspect`
        sys.log("===="+value)
    }


}

// 2.register aspect Instance
const aspect = new StoreAspect()
entryPoint.setAspect(aspect)

// 3.must export it
export {execute, allocate}