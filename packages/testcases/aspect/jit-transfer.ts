import {
    allocate,
    entryPoint,
    execute,
    BigInt,
    BytesData,
    ethereum,
    hexToUint8Array,
    IAspectOperation,
    IPostContractCallJP,
    JitCallBuilder,
    OperationInput,
    PostContractCallInput,
    stringToUint8Array,
    sys,
    uint8ArrayToHex,
    uint8ArrayToString,
    InitInput, IPreContractCallJP, PreContractCallInput, JitInherentRequest,
} from "@artela/aspect-libs";
import { Protobuf } from "as-proto/assembly/Protobuf";

/**
 * There are two types of Aspect: Transaction-Level Aspect and Block-Level Aspect.
 * Transaction-Level Aspect will be triggered whenever there is a transaction calling the bound smart contract.
 * Block-Level Aspect will be triggered whenever there is a new block generated.
 *
 * An Aspect can be Transaction-Level, Block-Level,IAspectOperation or both.
 * You can implement corresponding interfaces: IAspectTransaction, IAspectBlock,IAspectOperation or both to tell Artela which
 * type of Aspect you are implementing.
 */
export class JITTransferAspect implements IPostContractCallJP, IAspectOperation {

    static readonly PAYER_KEY: string = 'PAYER_KEY';

    init(input: InitInput): void { }

    postContractCall(input: PostContractCallInput): void {
        sys.log("_____postContractCall");
        const callData = uint8ArrayToHex(input.call!.data);
        const method = this.parseCallMethod(callData);


        // if method is 'transfer(address,uint256)'
        if (method == "0xa9059cbb") {
            sys.log(`_____submit jit call`);

            const payer = this.getPayer();  // 这里的  payer 应该是 Aspect id吗？
            const to = this.getTransferAddress(callData);
            sys.log(`_____submit jit call to  ${to} from ${payer}`);


            // 构造AA调用的 user operation，感觉这里好像有问题？

            const calldata = ethereum.abiEncode('execute', [
                ethereum.Address.fromUint8Array(hexToUint8Array(to)),
                ethereum.Number.fromU64(1_000_000_000_000_000),
                ethereum.Bytes.fromUint8Array(hexToUint8Array("")),
            ]);

            sys.log(`_____Joinpoint postContractCall, method: ${method}, payer: ${payer}, receiver: ${to}`);

            const request = new JitInherentRequest(
                hexToUint8Array(payer),
                0,
                hexToUint8Array(''),
                new Uint8Array(0),
                hexToUint8Array(calldata),
                0,
                0,
                new Uint8Array(0)
            );

            const response = sys.hostApi.evmCall.jitCall(request);
            if (response.success) {
                sys.log(`_____Successfully submitted the JIT call, ret: ${uint8ArrayToString(response.ret)}`);
            } else {
                sys.log(`_____Failed to submit the JIT call, err: ${response.errorMsg}, ret: ${uint8ArrayToString(response.ret)}`);
            }
        }
    }

    operation(input: OperationInput): Uint8Array {
        const calldata = uint8ArrayToHex(input.callData);
        const op = this.parseOP(calldata);
        const params = this.parseOPPrams(calldata);

        if (op == "0001") {
            this.registerPayer(params);
            return new Uint8Array(0);
        }
        if (op == "1001") {
            const ret = this.getPayer();
            return stringToUint8Array(ret);
        }

        sys.revert("unknown op");
        return new Uint8Array(0);
    }

    parseCallMethod(calldata: string): string {
        if (calldata.startsWith('0x')) {
            return calldata.substring(0, 10);
        }
        return '0x' + calldata.substring(0, 8);
    }

    getTransferAddress(calldata: string): string {
        if (calldata.startsWith('0x')) {
            return '0x' + calldata.slice(34, 74);
        }
        return '0x' + calldata.slice(32, 72);
    }

    parseOP(calldata: string): string {
        if (calldata.startsWith('0x')) {
            return calldata.substring(2, 6);
        } 
            return calldata.substring(0, 4);
        
    }

    parseOPPrams(calldata: string): string {
        if (calldata.startsWith('0x')) {
            return calldata.substring(6, calldata.length);
        } 
            return calldata.substring(4, calldata.length);
        
    }

    rmPrefix(data: string): string {
        if (data.startsWith('0x')) {
            return data.substring(2, data.length);
        } 
            return data;
        
    }

    registerPayer(params: string): void {
        this.savePayer(params, JITTransferAspect.PAYER_KEY);
    }

    savePayer(params: string, storagePrefix: string): void {
        sys.require(params.length == 40, "illegal params");
        const payer = params.slice(0, 40);

        const payerStore = sys.aspect.mutableState.get<Uint8Array>(storagePrefix);
        payerStore.set(hexToUint8Array(payer));
    }

    getPayer(): string {
        const payerStore = sys.aspect.mutableState.get<Uint8Array>(JITTransferAspect.PAYER_KEY);
        return '0x' + uint8ArrayToHex(payerStore.unwrap());
    }

    //****************************
    // unused methods
    //****************************

    isOwner(sender: Uint8Array): bool {
        return true;
    }
}

// 2.register aspect Instance
const aspect = new JITTransferAspect()
entryPoint.setAspect(aspect)
entryPoint.setOperationAspect(aspect)

// 3.must export it
export { execute, allocate }