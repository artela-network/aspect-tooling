// The entry file of your WebAssembly module.

import {
    allocate,
    entryPoint,
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
  
  // Dummy Aspect that does not do anything, just used to test the aspect basic features.
  class BasicAspect implements 
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
    }

    postContractCall(_: PostContractCallInput): void {
    }

    preTxExecute(_: PreTxExecuteInput): void {
    }

    postTxExecute(_: PostTxExecuteInput): void {
    }
  }
  
  // 2.register aspect Instance
  const aspect = new BasicAspect();
  entryPoint.setOperationAspect(aspect);
  entryPoint.setAspect(aspect);
  
  // 3.must export it
  export { execute, allocate };
  