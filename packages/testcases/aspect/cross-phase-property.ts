import {
  allocate,
  entryPoint,
  execute,
  InitInput,
  IPostTxExecuteJP,
  IPreTxExecuteJP,
  ITransactionVerifier,
  PostTxExecuteInput,
  PreTxExecuteInput,
  sys,
  TxVerifyInput,
  uint8ArrayToHex,
  uint8ArrayToString,
} from '@artela/aspect-libs';

class CrossPhaseProperty implements IPostTxExecuteJP, IPreTxExecuteJP, ITransactionVerifier {
  propKey: string = 'verifyAccount';
  stateKeyPrefix: string = 'state_key';

  propFromVerifyTx: string = `${this.stateKeyPrefix}_verifyTx`;
  propFromPreTxExecute: string = `${this.stateKeyPrefix}_preTxExecute`;
  propFromPostTxExecute: string = `${this.stateKeyPrefix}_postTxExecute`;

  init(input: InitInput): void {}

  isOwner(sender: Uint8Array): bool {
    const value = sys.aspect.property.get<Uint8Array>('owner');
    return !!uint8ArrayToHex(value).includes(uint8ArrayToString(sender));
  }

  verifyTx(input: TxVerifyInput): Uint8Array {
    const valueFromVerifyTx = uint8ArrayToString(sys.aspect.property.get<Uint8Array>(this.propKey));
    sys.aspect.transientStorage.get<string>(this.propFromVerifyTx).set<string>(valueFromVerifyTx);

    return sys.aspect.property.get<Uint8Array>('verifyAccount');
  }

  preTxExecute(input: PreTxExecuteInput): void {
    const valueFromPreTxExecute = uint8ArrayToString(
      sys.aspect.property.get<Uint8Array>(this.propKey),
    );
    sys.aspect.transientStorage
      .get<string>(this.propFromPreTxExecute)
      .set<string>(valueFromPreTxExecute);
  }

  postTxExecute(input: PostTxExecuteInput): void {
    const valueFromPostTxExecute = uint8ArrayToString(
      sys.aspect.property.get<Uint8Array>(this.propKey),
    );

    const valueFromVerifyTx = sys.aspect.transientStorage
      .get<string>(this.propFromVerifyTx)
      .unwrap();
    const valueFromPreTxExecute = sys.aspect.transientStorage
      .get<string>(this.propFromPreTxExecute)
      .unwrap();
    if (
      valueFromPostTxExecute !== valueFromPreTxExecute ||
      valueFromPostTxExecute !== valueFromVerifyTx ||
      valueFromPreTxExecute !== valueFromVerifyTx
    ) {
      sys.revert('mismatch property value from different consensus phases');
    }
  }
}

const aspect = new CrossPhaseProperty();
entryPoint.setAspect(aspect);

// 3.must export it
export { allocate, execute };
