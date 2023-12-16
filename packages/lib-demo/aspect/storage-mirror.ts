import {ethereum, IPostContractCallJP, JitInherentRequest, PostContractCallCtx,  sys,entryPoint,execute, allocate} from '@artela/aspect-libs';

class StorageMirror implements IPostContractCallJP {

    isOwner(sender: string): bool {
        const value = sys.aspect.property.get<string>('owner');
        return value.includes(sender);
    }

    postContractCall(ctx: PostContractCallCtx): void {
        const txData = sys.utils.uint8ArrayToHex(ctx.tx.content.unwrap().input);
        // calling store method
        if (txData.startsWith('6057361d')) {
            // then we try to mirror the call to another storage contract
            const walletAddress = sys.aspect.property.get<string>('wallet');
            const contractAddress = sys.aspect.property.get<string>('contract');
            const callData = ethereum.abiEncode('execute', [
                ethereum.Address.fromHexString(contractAddress),
                ethereum.Number.fromU64(0),
                ethereum.Bytes.fromHexString(txData),
            ]);

            const request = new JitInherentRequest(
                sys.utils.hexToUint8Array(walletAddress),
                new Uint8Array(0),
                new Uint8Array(0),
                sys.utils.hexToUint8Array(callData),
                sys.utils.hexToUint8Array(ethereum.Number.fromU64(1000000).encodeHex()),
                sys.utils.hexToUint8Array(ethereum.Number.fromU64(1000000).encodeHex()),
                new Uint8Array(0),
                new Uint8Array(0),
                new Uint8Array(0),
            );

            const response = sys.evm.jitCall(ctx).submit(request);
            sys.require(response.success, 'failed to call JIT');
        }
    }
}


// 2.register aspect Instance
const aspect = new StorageMirror()
entryPoint.setAspect(aspect)

// 3.must export it
export {execute, allocate}