// The entry file of your WebAssembly module.
import {
    ethereum,
    EthTransaction,
    IAspectBlock,
    OnBlockFinalizeCtx,
    OnBlockInitializeCtx,
    ScheduleOpts,
    ScheduleTx,
    sys,entryPoint,execute, allocate,
} from '@artela/aspect-libs';

class SalaryPayment implements IAspectBlock {

    isOwner(sender: string): bool {
        const value = sys.aspect.property.get<string>('owner');
        return !!value.includes(sender);
    }
    onBlockFinalize(ctx: OnBlockFinalizeCtx): void {
    }

    onBlockInitialize(ctx: OnBlockInitializeCtx): void {
        // params:
        // startAfter(3): the scheduled transaction will be trigger at the 3rd block after this method is called.
        // count(1000): total count of schedulex transaction is 1000.
        // everyNBlocks(5): execution at every 5th block since started.
        // maxRetry(2): Transaction confirmation on the blockchain is not guaranteed but rather determined by the gas fee.
        // If a transaction fails to be confirmed on the blockchain, it can be retried up to a maximum of two times.
        const periodicSch = ctx.schedule
            .periodic('myPeriodic001')
            .startAfter(3)
            .execCount(1000)
            .everyNBlocks(5)
            .maxRetry(2);
        const tx = this.scheduleTx(
            sys.aspect.property.get<string>('ScheduleTo'),
            sys.aspect.property.get<string>('Broker'),
            sys.aspect.property.get<string>('TargetAddr'),
        );
        periodicSch.submit(tx);
    }

    private scheduleTx(scheduleTo: string, broker: string, target: string): EthTransaction {
        // prepare the transfer parameters, and encode them to abi input.
        let paramAddr = ethereum.Address.fromHexString(target);
        let paramNum = ethereum.Number.fromU64(100);
        let payload = ethereum.abiEncode('transfer', [paramAddr, paramNum]);

        // the scheduled transaction with params.
        return new ScheduleTx(scheduleTo).New(
            payload,
            new ScheduleOpts(0, '200000000', '30000', broker),
        );
    }
}
// 2.register aspect Instance
const aspect = new SalaryPayment()
entryPoint.setAspect(aspect)

// 3.must export it
export {execute, allocate}

