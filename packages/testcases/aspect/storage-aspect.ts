import {
  allocate,
  entryPoint,
  execute,
  InitInput,
  IPostContractCallJP,
  IPostTxExecuteJP,
  IPreContractCallJP,
  IPreTxExecuteJP,
  PostContractCallInput,
  PostTxExecuteInput,
  PreContractCallInput,
  PreTxExecuteInput,
  sys,
  uint8ArrayToHex,
} from '@artela/aspect-libs';

class StoreAspect
  implements IPostTxExecuteJP, IPreTxExecuteJP, IPostContractCallJP, IPreContractCallJP
{
  init(input: InitInput): void {}

  isOwner(sender: Uint8Array): bool {
    const value = sys.aspect.property.get<Uint8Array>('owner');
    return uint8ArrayToHex(value).includes(uint8ArrayToHex(sender));
  }

  preTxExecute(input: PreTxExecuteInput): void {
    //for smart contract call
    sys.aspect.transientStorage.get<string>('aspectSetKey').set<string>('HelloWord');
  }

  postTxExecute(input: PostTxExecuteInput): void {
    const to = uint8ArrayToHex(input.tx!.to);
    const value = sys.aspect.transientStorage.get<string>('contractSetKey', to).unwrap();
    //when contract setAspectContext this value equals  `HelloAspect`
    sys.log('==postTxExecute==' + value);
  }
  preContractCall(ctx: PreContractCallInput): void {
    const val = sys.aspect.mutableState.get<i32>('state-key');
    let n1 = val.unwrap();
    sys.log('|||preContractCall before value: ' + n1.toString());
    val.set<i32>(n1 + 10);
    let n2 = val.unwrap();
    sys.log('|||preContractCall after value: ' + n2.toString());
  }
  postContractCall(ctx: PostContractCallInput): void {
    const val = sys.aspect.mutableState.get<i32>('state-key');
    let n1 = val.unwrap();
    sys.log('|||postContractCall before value: ' + n1.toString());
  }
}

// 2.register aspect Instance
const aspect = new StoreAspect();
entryPoint.setAspect(aspect);

// 3.must export it
export { execute, allocate };
