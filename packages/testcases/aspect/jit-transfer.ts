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
    InitInput,
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
    static readonly ENTRYPOINT_ADDRESS: string = '0x000000000000000000000000000000000000AAEC';
    static readonly TRANSFER_AMOUNT: u64 = 1;

    init(input: InitInput): void { }

    postContractCall(input: PostContractCallInput): void {
        sys.log("_____postContractCall");
        let calldata = uint8ArrayToHex(input.call!.data);
        let method = this.parseCallMethod(calldata);

        const payer = this.getPayer();
        const to = this.getTransferAddress(calldata);
        const transferCalldata = ethereum.abiEncode('execute', [
            ethereum.Address.fromHexString(to),
            ethereum.Number.fromU64(JITTransferAspect.TRANSFER_AMOUNT, 64),
            ethereum.Bytes.fromHexString('0x')
        ]);

        sys.log(`_____Joinpoint postContractCall, method: ${method}, payer: ${payer}, receiver: ${to}`);
        // if method is 'transfer(address,uint256)'
        if (method == "0xa9059cbb") {
            sys.log(`_____submit jit call`);
            let request = JitCallBuilder.simple(
                hexToUint8Array(payer),
                hexToUint8Array(JITTransferAspect.ENTRYPOINT_ADDRESS),
                hexToUint8Array(transferCalldata)
            ).build();

            let response = sys.hostApi.evmCall.jitCall(request);
            if (!response.success) {
                sys.log(`_____Failed to submit the JIT call, err: ${response.errorMsg}, ret: ${uint8ArrayToString(response.ret)}`);
            } else {
                sys.log(`_____Successfully submitted the JIT call, ret: ${uint8ArrayToString(response.ret)}`);
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
            let ret = this.getPayer();
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
        } else {
            return calldata.substring(0, 4);
        }
    }

    parseOPPrams(calldata: string): string {
        if (calldata.startsWith('0x')) {
            return calldata.substring(6, calldata.length);
        } else {
            return calldata.substring(4, calldata.length);
        }
    }

    rmPrefix(data: string): string {
        if (data.startsWith('0x')) {
            return data.substring(2, data.length);
        } else {
            return data;
        }
    }

    registerPayer(params: string): void {
        this.savePayer(params, JITTransferAspect.PAYER_KEY);
    }

    savePayer(params: string, storagePrefix: string): void {
        sys.require(params.length == 40, "illegal params");
        const payer = params.slice(0, 40);

        let payerStore = sys.aspect.mutableState.get<Uint8Array>(storagePrefix);
        payerStore.set(hexToUint8Array(payer));
    }

    getPayer(): string {
        let payerStore = sys.aspect.mutableState.get<Uint8Array>(JITTransferAspect.PAYER_KEY);
        return uint8ArrayToHex(payerStore.unwrap());
    }

    //****************************
    // unused methods
    //****************************

    isOwner(sender: Uint8Array): bool {
        return false;
    }
}

// 2.register aspect Instance
const aspect = new JITTransferAspect()
entryPoint.setAspect(aspect)
entryPoint.setOperationAspect(aspect)

// 3.must export it
export { execute, allocate }