import {
  allocate,
  entryPoint,
  execute,
  IAspectOperation,
  IPostContractCallJP,
  IPostTxExecuteJP,
  IPreContractCallJP,
  IPreTxExecuteJP,
  ITransactionVerifier,
  OperationInput,
  PostContractCallInput,
  PostTxExecuteInput,
  PreContractCallInput,
  PreTxExecuteInput,
  StaticCallRequest,
  stringToUint8Array,
  sys,
  TxVerifyInput,
  uint8ArrayToHex,
} from '@artela/aspect-libs';

class StaticCallAspect
  implements
    IPostTxExecuteJP,
    IPreTxExecuteJP,
    IPostContractCallJP,
    IPreContractCallJP,
    ITransactionVerifier,
    IAspectOperation
{
  isOwner(sender: Uint8Array): bool {
    return true;
  }

  postContractCall(input: PostContractCallInput): void {
    const from = sys.aspect.property.get<Uint8Array>('from');
    const to = sys.aspect.property.get<Uint8Array>('to');
    const data = sys.aspect.property.get<Uint8Array>('data');

    const staticCallRequest = new StaticCallRequest(from, to, data, 1000000000);
    const staticCallResult = sys.hostApi.evmCall.staticCall(staticCallRequest);
    const hex = uint8ArrayToHex(staticCallResult.ret);
    sys.require(
      hex === '0000000000000000000000000000000000000000000000000000000000000064' &&
        staticCallResult.vmError === '',
      'static error: ' + staticCallResult.vmError,
    );

    sys.log('||| postContractCall staticCallResult.gasLeft ' + staticCallResult.gasLeft.toString());
  }

  postTxExecute(input: PostTxExecuteInput): void {
    const from = sys.aspect.property.get<Uint8Array>('from');
    const to = sys.aspect.property.get<Uint8Array>('to');
    const data = sys.aspect.property.get<Uint8Array>('data');

    const staticCallRequest = new StaticCallRequest(from, to, data, 1000000000);
    const staticCallResult = sys.hostApi.evmCall.staticCall(staticCallRequest);
    const hex = uint8ArrayToHex(staticCallResult.ret);
    sys.require(
      hex === '0000000000000000000000000000000000000000000000000000000000000064' &&
        staticCallResult.vmError === '',
      'static error: ' + staticCallResult.vmError,
    );

    sys.log('||| postTxExecute staticCallResult.gasLeft ' + staticCallResult.gasLeft.toString());
  }

  preContractCall(input: PreContractCallInput): void {
    const from = sys.aspect.property.get<Uint8Array>('from');
    const to = sys.aspect.property.get<Uint8Array>('to');
    const data = sys.aspect.property.get<Uint8Array>('data');

    const staticCallRequest = new StaticCallRequest(from, to, data, 1000000000);
    const staticCallResult = sys.hostApi.evmCall.staticCall(staticCallRequest);

    const hex = uint8ArrayToHex(staticCallResult.ret);
    sys.require(
      hex === '0000000000000000000000000000000000000000000000000000000000000064' &&
        staticCallResult.vmError === '',
      'static error: ' + staticCallResult.vmError,
    );

    sys.log('||| preContractCall staticCallResult.gasLeft ' + staticCallResult.gasLeft.toString());
  }

  preTxExecute(input: PreTxExecuteInput): void {
    const from = sys.aspect.property.get<Uint8Array>('from');

    const to = sys.aspect.property.get<Uint8Array>('to');
    const data = sys.aspect.property.get<Uint8Array>('data');

    const staticCallRequest = new StaticCallRequest(from, to, data, 1000000000);
    const staticCallResult = sys.hostApi.evmCall.staticCall(staticCallRequest);
    const hex = uint8ArrayToHex(staticCallResult.ret);
    sys.require(
      hex === '0000000000000000000000000000000000000000000000000000000000000064' &&
        staticCallResult.vmError === '',
      'static error: ' + staticCallResult.vmError,
    );

    sys.log('||| preTxExecute staticCallResult.gasLeft ' + staticCallResult.gasLeft.toString());
  }

  verifyTx(input: TxVerifyInput): Uint8Array {
    const from = sys.aspect.property.get<Uint8Array>('from');
    const to = sys.aspect.property.get<Uint8Array>('to');
    const data = sys.aspect.property.get<Uint8Array>('data');

    const staticCallRequest = new StaticCallRequest(from, to, data, 1000000000);
    const staticCallResult = sys.hostApi.evmCall.staticCall(staticCallRequest);

    sys.log('||| verifyTx staticCallResult.ret ' + staticCallResult.ret.toString());
    sys.log('||| verifyTx staticCallResult.gasLeft ' + staticCallResult.gasLeft.toString());

    return stringToUint8Array('ok');
  }

  operation(input: OperationInput): Uint8Array {
    const from = sys.aspect.property.get<Uint8Array>('from');
    const to = sys.aspect.property.get<Uint8Array>('to');
    const data = sys.aspect.property.get<Uint8Array>('data');

    const staticCallRequest = new StaticCallRequest(from, to, data, 1000000000);
    const staticCallResult = sys.hostApi.evmCall.staticCall(staticCallRequest);

    const hex = uint8ArrayToHex(staticCallResult.ret);
    sys.require(
      hex === '0000000000000000000000000000000000000000000000000000000000000064' &&
        staticCallResult.vmError === '',
      'static error: ' + staticCallResult.vmError,
    );

    sys.log('||| verifyTx staticCallResult.gasLeft ' + staticCallResult.gasLeft.toString());

    return stringToUint8Array('ok');
  }
}

// 2.register aspect Instance
const aspect = new StaticCallAspect();
entryPoint.setAspect(aspect);
entryPoint.setOperationAspect(aspect);

// 3.must export it
export { execute, allocate };
