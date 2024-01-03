import { allocate, entryPoint, execute, sys, TxVerifyInput, } from "@artela/aspect-libs";
import { ITransactionVerifier } from "@artela/aspect-libs/types/aspect-interface";

class EoaAspect implements ITransactionVerifier {
    verifyTx(input: TxVerifyInput): Uint8Array {
        return sys.aspect.property.get<Uint8Array>("verifyAccount");
    }

    isOwner(sender: Uint8Array): bool {
        return true;
    }
}

// 2.register aspect Instance
const aspect = new EoaAspect()
entryPoint.setAspect(aspect)

// 3.must export it
export { allocate, execute };

