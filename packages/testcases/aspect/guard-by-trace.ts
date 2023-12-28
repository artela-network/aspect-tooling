// The entry file of your WebAssembly module.

import {
    allocate,
    BigInt,
    entryPoint,
    execute,
    IPostContractCallJP,
    PostContractCallInput,
    sys,
    uint8ArrayToHex, uint8ArrayToString
} from '@artela/aspect-libs';
import {HoneyPotState} from './contract/honeypot-storage';

class GuardBTraceAspect implements IPostContractCallJP {
    isOwner(sender: Uint8Array): bool {
        const value = sys.aspect.property.get<Uint8Array>("owner");
        return uint8ArrayToHex(value).includes(uint8ArrayToHex(sender));
    }

    postContractCall(input: PostContractCallInput): void {
        sys.log("postContractCall===1");
        // 1.Calculate the eth balance change of DeFi SmartContract(HoneyPot) before and after tx.
        const to = uint8ArrayToHex(input.call!.to);
        const from = uint8ArrayToHex(input.call!.from);
        sys.log("postContractCall===2");

     //   const sysBalance = new HoneyPotState._balance_(to);
        sys.log("postContractCall===3");
        //
       // const deltaSys = sysBalance.current()!.sub(sysBalance.original());
        sys.log("postContractCall===4");
        //
        //  // 2.Calculate the financial change of withdrawer in DeFi SmartContract(HoneyPot) before and after tx.
        // // const contractState = new HoneyPotState.balances(to);
        //  const contractState =BigInt.ZERO;
        //  sys.log("postContractCall===5");
        //
        //  let deltaUser = BigInt.ZERO;
        //  sys.log("postContractCall===6");
        //
        //  const fromState = contractState.get(from);
        //  sys.log("postContractCall===7");
        //
        //  const current = fromState.current();
        //  const original = fromState.original();
        //  sys.log("postContractCall===8");
        //
        //  if (current && original) {
        //      sys.log("postContractCall===9");
        //
        //      deltaUser = current.sub(original);
        //  }
        //  sys.log("postContractCall===10");
        //
        //  // 3.Verify if the above two values are equal.
        //  if (deltaSys.compareTo(deltaUser) != 0) {
        //      sys.log("postContractCall===11");
        //
        //      sys.revert('risky transaction');
        //  }
        //  sys.log("postContractCall===12");

    }
}

// 2.register aspect Instance
const aspect = new GuardBTraceAspect()
entryPoint.setAspect(aspect)

// 3.must export it
export {execute, allocate}
