import {
  allocate, AspectBase,
  entryPoint,
  execute, OperationInput, PostContractCallInput,
  PostTxExecuteInput, PreContractCallInput,
  PreTxExecuteInput, stringToUint8Array,
  sys, TxVerifyInput,
  uint8ArrayToHex,
} from '@artela/aspect-libs';

class StoreAspect extends AspectBase
{
  isOwner(sender: Uint8Array): bool {
    return true
  }

  preTxExecute(input: PreTxExecuteInput): void {
    //for smart contract call
    sys.aspect.transientStorage.get<string>('ToContract').set<string>('HelloWord');
  }

  postTxExecute(input: PostTxExecuteInput): void {
    const to = uint8ArrayToHex(input.tx!.to);
    const value = sys.aspect.transientStorage.get<string>('ToAspect', to).unwrap();
    //'HelloAspect' here is set from smart contract
    sys.require(value=="HelloAspect","failed to get value by contract setting.");
  }

  operation(input: OperationInput): Uint8Array {
    return stringToUint8Array('test');
  }

  postContractCall(input: PostContractCallInput): void {
  }

  preContractCall(input: PreContractCallInput): void {
  }

  verifyTx(input: TxVerifyInput): Uint8Array {
    return stringToUint8Array('test');
  }

}

// 2.register aspect Instance
const aspect = new StoreAspect();
entryPoint.setAspect(aspect);

// 3.must export it
export { execute, allocate };
