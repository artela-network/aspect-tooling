// The entry file of your WebAssembly module.

import {
    allocate,
    BigInt,
    entryPoint,
    execute,
    hexToUint8Array,
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
    stringToUint8Array,
    sys,
    uint8ArrayToHex,
  } from '@artela/aspect-libs';
  
  // Dummy Aspect that does not do anything, just used to test the aspect basic features.
  class InitAspect implements 
  IAspectOperation, 
  IPreContractCallJP, 
  IPostContractCallJP, 
  IPreTxExecuteJP, 
  IPostTxExecuteJP {
    init(input: InitInput): void {
      sys.aspect.mutableState.get<Uint8Array>('init').set(input.callData);
    }
    
    isOwner(_: Uint8Array): bool {
       return false;
    }
  
    operation(_: OperationInput): Uint8Array {
      sys.require('init' == this.getData<string>(), "data not as expected");
      return this.getData<Uint8Array>();
    }
    
    preContractCall(_: PreContractCallInput): void {
      sys.require('init' == this.getData<string>(), "data not as expected");
    }

    postContractCall(_: PostContractCallInput): void {
      sys.require('init' == this.getData<string>(), "data not as expected");
    }

    preTxExecute(_: PreTxExecuteInput): void {
      sys.require('init' == this.getData<string>(), "data not as expected");
    }

    postTxExecute(_: PostTxExecuteInput): void {
      sys.require('init' == this.getData<string>(), "data not as expected");
    }

    getData<T>(): T {
      return sys.aspect.mutableState.get<T>('init').unwrap();
    }
  }
  
  // 2.register aspect Instance
  const aspect = new InitAspect();
  entryPoint.setOperationAspect(aspect);
  entryPoint.setAspect(aspect);
  
  // 3.must export it
  export { execute, allocate };
  