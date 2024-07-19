// The entry file of your WebAssembly module.

import {
  allocate,
  entryPoint,
  execute,
  InitInput,
  IPostContractCallJP,
  IPreContractCallJP,
  PostContractCallInput,
  PreContractCallInput,
  sys,
  uint8ArrayToHex,
  uint8ArrayToString,
} from '@artela/aspect-libs';

class GuardByCountAspect implements IPostContractCallJP, IPreContractCallJP {
  init(input: InitInput): void {}

  isOwner(sender: Uint8Array): bool {
    const value = sys.aspect.property.get<Uint8Array>('owner');
    return uint8ArrayToHex(value).includes(uint8ArrayToHex(sender));
  }

  readonly _CONTEXT_KEY: string = '{InnerTxToAddr}_LOCK';
  readonly _NOT_ENTERED: string = '0';
  readonly _ENTERED: string = '1';

  preContractCall(input: PreContractCallInput): void {
    const curContract = uint8ArrayToHex(input.call!.to);
    const reentKey = this._CONTEXT_KEY.replace('{InnerTxToAddr}', curContract);

    // 2.Check if another transaction has already occupied.
    if (this._ENTERED == sys.aspect.transientStorage.get<string>(reentKey).unwrap()) {
      sys.revert('revert');
    }
    // 3.Set reentrant lock entered.
    sys.aspect.transientStorage.get<string>(reentKey).set<string>(this._ENTERED);
  }

  postContractCall(input: PostContractCallInput): void {
    // 1.Get reentrant lock key of current contract.
    const curContract = uint8ArrayToHex(input.call!.to);
    const reentKey = this._CONTEXT_KEY.replace('{InnerTxToAddr}', curContract);

    // 2.Set reentrant lock not entered.
    sys.aspect.transientStorage.get<string>(reentKey).set<string>(this._NOT_ENTERED);
  }
}

// 2.register aspect Instance
const aspect = new GuardByCountAspect();
entryPoint.setAspect(aspect);

// 3.must export it
export { execute, allocate };
