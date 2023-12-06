import {IPostContractCallJP, PostContractCallCtx,} from "@artela/aspect-libs";


class Aspect implements IPostContractCallJP {
    isOwner(sender: string): bool {
        return true;
    }
    postContractCall(ctx: PostContractCallCtx): void {
    }
}
@AspectEntry(name="release")
export const test=new Aspect()