// The entry file of your WebAssembly module.

import {
  allocate,
  BigInt,
  entryPoint,
  execute,
  IPostContractCallJP,
  PostContractCallInput,
  sys,
  uint8ArrayToHex,
} from '@artela/aspect-libs';
import { HoneyPotState } from './contract/honeypot-storage';

class GuardBTraceAspect implements IPostContractCallJP {
  isOwner(sender: Uint8Array): bool {
    const value = sys.aspect.property.get<Uint8Array>('owner');
    return uint8ArrayToHex(value).includes(uint8ArrayToHex(sender));
  }

  postContractCall(input: PostContractCallInput): void {
    const mytest = sys.aspect.property.get<string>('mytest-key');
    sys.require(mytest === 'test abc ', 'failed to get property key.');

    // 1.Calculate the eth balance change of DeFi SmartContract(HoneyPot) before and after tx.
    const to = uint8ArrayToHex(input.call!.to);
    const from = uint8ArrayToHex(input.call!.from);
    const sysBalance = new HoneyPotState._balance_(to);
    const deltaSys = sysBalance.current()!.sub(sysBalance.original());

    // 2.Calculate the financial change of withdrawer in DeFi SmartContract(HoneyPot) before and after tx.
    const contractState = new HoneyPotState.balances(to);

    let deltaUser = BigInt.ZERO;

    const fromState = contractState.get(from);

    const current = fromState.current();
    const original = fromState.original();
    if (current && original) {
      deltaUser = current.sub(original);
    }
    // 3.Verify if the above two values are equal.
    if (deltaSys.compareTo(deltaUser) != 0) {
      sys.revert('risky transaction');
    }
  }
}

// 2.register aspect Instance
const aspect = new GuardBTraceAspect();
entryPoint.setAspect(aspect);

// 3.must export it
export { execute, allocate };
