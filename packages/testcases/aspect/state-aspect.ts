import {
  allocate,
  entryPoint,
  execute,
  IAspectOperation,
  InitInput,
  IPostTxExecuteJP,
  IPreTxExecuteJP,
  OperationInput,
  PostTxExecuteInput,
  PreTxExecuteInput,
  stringToUint8Array,
  sys,
  toUint8Array,
  uint8ArrayToHex,
  uint8ArrayToString,
} from '@artela/aspect-libs';

 class StateAspect implements IPostTxExecuteJP, IPreTxExecuteJP, IAspectOperation {
  init(input: InitInput): void {}

  isOwner(sender: Uint8Array): bool {
    const value = sys.aspect.property.get<Uint8Array>('owner');
    return uint8ArrayToHex(value).includes(uint8ArrayToHex(sender));
  }
  preTxExecute(input: PreTxExecuteInput): void {}
  postTxExecute(input: PostTxExecuteInput): void {}

  operation(input: OperationInput): Uint8Array {
    const STATE_KEY = 'stateKey';

    let number = sys.aspect.mutableState.get<i64>(STATE_KEY).unwrap();
    number = number + 10;
    sys.aspect.mutableState.get<i64>(STATE_KEY).set<i64>(number);
    return stringToUint8Array(number.toString(10));
  }
}

// 2.register aspect Instance
const aspect = new StateAspect();
entryPoint.setAspect(aspect);
entryPoint.setOperationAspect(aspect);

// 3.must export it
export { execute, allocate };
