import {
    allocate,
    entryPoint,
    execute,
    IAspectOperation,
    IPostTxExecuteJP,
    IPreTxExecuteJP,
    OperationInput,
    PostTxExecuteInput,
    PreTxExecuteInput, stringToUint8Array,
    sys, toUint8Array, uint8ArrayToHex, uint8ArrayToString,
} from "@artela/aspect-libs";


export class StoreAspect implements IPostTxExecuteJP, IPreTxExecuteJP, IAspectOperation {


    isOwner(sender: Uint8Array): bool {
        const value = sys.aspect.property.get<Uint8Array>("owner");
        return uint8ArrayToHex(value).includes(uint8ArrayToHex(sender));
    }
    preTxExecute(input: PreTxExecuteInput): void {

    }
    postTxExecute(input: PostTxExecuteInput): void{

    }

    operation(input: OperationInput): Uint8Array{
        const STATE_KEY = "stateKey";



        let number =sys.aspect.mutableState.get<i64>(STATE_KEY).unwrap();
        number = number + 10
        sys.aspect.mutableState.get<i64>(STATE_KEY).set<i64>(number)
        return stringToUint8Array(number.toString(10));
    }

}

// 2.register aspect Instance
const aspect = new StoreAspect()
entryPoint.setAspect(aspect)
entryPoint.setOperationAspect(aspect)

// 3.must export it
export {execute, allocate}