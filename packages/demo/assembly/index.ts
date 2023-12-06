// The entry file of your WebAssembly module.

import {IPostTxExecuteJP, IPreTxExecuteJP, PostTxExecuteCtx, PreTxExecuteCtx} from "@artela/aspect-libs";
import {IAspectBase} from "@artela/aspect-libs/types/aspect-interface";

export function add(a: i32, b: i32): i32 {
    let a1 = new A();
    let b1 = new B();

    const map = new Map<string, () => bool>()
    map.set("set", set)
    map.set("get", get)

    const str = map.has("set") ? map.get("set") : null // OK
    if (str!()) {
        a = 10
    }

    if (b1.setAspect(a1)) {
        return a + b;
    }
    return 0
}

function set(): bool {
    return true
}

function get(): bool {
    return false
}

class B {

    public setAspect(base: IAspectBase): bool {
        if (base instanceof IPostTxExecuteJP) {
            const base1 = base as IPostTxExecuteJP;
            if (base1 != null) {
                return base1.isOwner("aaa")
            }
        }
        return false
    }
}

class A implements IPostTxExecuteJP, IPreTxExecuteJP {
    isOwner(sender: string): bool {
        return true;
    }


    preTxExecute(ctx: PreTxExecuteCtx): void {

    }

    postTxExecute(ctx: PostTxExecuteCtx): void {
    }

}