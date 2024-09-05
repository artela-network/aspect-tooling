// The entry file of your WebAssembly module.

import {
  allocate, CallTreeQuery,
  entryPoint, EthCallTree,
  execute,
  IAspectOperation,
  InitInput,
  IPostContractCallJP,
  IPostTxExecuteJP,
  IPreContractCallJP,
  IPreTxExecuteJP,
  OperationInput,
  PostContractCallInput,
  PostTxExecuteInput,
  PreContractCallInput,
  PreTxExecuteInput,
  sys,
  uint8ArrayToHex,
} from '@artela/aspect-libs';
import {Protobuf} from "as-proto/assembly";

// Dummy Aspect that does not do anything, just used to test the aspect basic features.
class CallTreeAspect implements
  IAspectOperation,
  IPreContractCallJP,
  IPostContractCallJP,
  IPreTxExecuteJP,
  IPostTxExecuteJP {
  init(input: InitInput): void {}

  isOwner(sender: Uint8Array): bool {
    const value = sys.aspect.property.get<Uint8Array>("owner");
    return uint8ArrayToHex(value) == uint8ArrayToHex(sender);
  }

  operation(input: OperationInput): Uint8Array {
    return input.callData;
  }

  preContractCall(_: PreContractCallInput): void {
    sys.revert("preContractCall revert");
  }

  postContractCall(_: PostContractCallInput): void {
    const rawCallTree = sys.hostApi.trace.queryCallTree(new CallTreeQuery(-1));
    sys.aspect.mutableState.get<Uint8Array>('dummy').set(rawCallTree);

    const callTree = Protobuf.decode<EthCallTree>(rawCallTree, EthCallTree.decode);
    for (let i = 0; i < callTree.calls.length; i++) {
      const call = callTree.calls[i];
      sys.log("=================== call.index: " + call.index.toString(10));
      sys.log("=================== call.from: " + uint8ArrayToHex(call.from));
      sys.log("=================== call.to: " + uint8ArrayToHex(call.to));
    }
  }

  preTxExecute(_: PreTxExecuteInput): void {
    sys.revert("preTx revert");
  }

  postTxExecute(_: PostTxExecuteInput): void {
    sys.revert("postTx revert");
  }
}

// 2.register aspect Instance
const aspect = new CallTreeAspect();
entryPoint.setOperationAspect(aspect);
entryPoint.setAspect(aspect);

// 3.must export it
export { execute, allocate };
