import {
  allocate,
  BytesData,
  entryPoint,
  execute,
  hexToUint8Array,
  InitInput,
  IPostContractCallJP,
  IPostTxExecuteJP,
  IPreContractCallJP,
  IPreTxExecuteJP,
  ITransactionVerifier,
  PostContractCallInput,
  PostTxExecuteInput,
  PreContractCallInput,
  PreTxExecuteInput,
  sys,
  TxVerifyInput,
  Uint256,
  uint8ArrayToHex,
  UintData,
} from '@artela/aspect-libs';

import { Protobuf } from 'as-proto/assembly/Protobuf';

class StateDBAspect
  implements
    IPostTxExecuteJP,
    IPreTxExecuteJP,
    IPostContractCallJP,
    IPreContractCallJP,
    ITransactionVerifier
{
  init(input: InitInput): void {}

  getTxNonce(): u64 {
    const txNonceRaw = sys.hostApi.runtimeContext.get('tx.nonce');
    return Protobuf.decode<UintData>(txNonceRaw, UintData.decode).data
  }

  getValue(): Uint256 {
    const txValueRaw = sys.hostApi.runtimeContext.get('tx.value');
    return Uint256.fromUint8Array(Protobuf.decode<BytesData>(txValueRaw, BytesData.decode).data)
  }

  verifyTx(input: TxVerifyInput): Uint8Array {
    const sender = sys.aspect.property.get<Uint8Array>('sender');
    const contract = sys.aspect.property.get<Uint8Array>('contract');
    const stateValue = Uint256.fromUint8Array(sys.aspect.property.get<Uint8Array>('value'));

    const nonce = sys.hostApi.stateDb.nonce(sender);
    sys.log('|||state nonce ' + nonce.toString());
    sys.require(nonce > this.getTxNonce() - 1, 'invalid nonce.');

    const balance = sys.hostApi.stateDb.balance(contract);
    const bigInt = Uint256.fromUint8Array(balance);
    sys.log('|||state balance ' + bigInt.toInt64().toString());
    sys.require(bigInt.toInt64() == 0, 'invalid balance.');

    const codeSize = sys.hostApi.stateDb.codeSize(contract);
    sys.log('|||state codeSize ' + codeSize.toString());
    sys.require(codeSize == sys.aspect.property.get<u64>('codeSize'), 'invalid codeSize.');

    const codeHash = sys.hostApi.stateDb.codeHash(contract);
    sys.log('|||codeHash ' + uint8ArrayToHex(codeHash));
    sys.require(uint8ArrayToHex(codeHash) == sys.aspect.property.get<string>('codeHash'), 'invalid hash.');

    const hasSuicided = sys.hostApi.stateDb.hasSuicided(contract);
    sys.log('|||hasSuicided ' + hasSuicided.toString());
    sys.require(hasSuicided == false, 'invalid hasSuicided.');

    const state = sys.hostApi.stateDb.stateAt(contract, hexToUint8Array('0x'));
    sys.log('|||state stateAt ' + uint8ArrayToHex(state));

    sys.require(Uint256.fromUint8Array(state).cmp(stateValue) == 0, 'invalid state');

    return sender;
  }

  isOwner(sender: Uint8Array): bool {
    const value = sys.aspect.property.get<Uint8Array>('owner');
    return uint8ArrayToHex(value).includes(uint8ArrayToHex(sender));
  }

  preTxExecute(input: PreTxExecuteInput): void {
    const sender = sys.aspect.property.get<Uint8Array>('sender');
    const contract = sys.aspect.property.get<Uint8Array>('contract');
    const hashKey = sys.aspect.property.get<Uint8Array>('hashKey');

    const nonce = sys.hostApi.stateDb.nonce(sender);
    sys.log('|||state nonce ' + nonce.toString());
    sys.require(nonce > this.getTxNonce(), 'invalid nonce.');

    const balance = sys.hostApi.stateDb.balance(contract);
    const bigInt = Uint256.fromUint8Array(balance);
    sys.log('|||state balance ' + bigInt.toInt64().toString());
    sys.require(bigInt.toInt64() == 0, 'invalid balance.');

    const codeSize = sys.hostApi.stateDb.codeSize(contract);
    sys.log('|||state codeSize ' + codeSize.toString());
    sys.require(codeSize == sys.aspect.property.get<u64>('codeSize'), 'invalid codeSize.');

    const codeHash = sys.hostApi.stateDb.codeHash(contract);
    sys.log('|||codeHash ' + uint8ArrayToHex(codeHash));
    sys.require(uint8ArrayToHex(codeHash) == sys.aspect.property.get<string>('codeHash'), 'invalid hash.');

    const hasSuicided = sys.hostApi.stateDb.hasSuicided(contract);
    sys.log('|||hasSuicided ' + hasSuicided.toString());
    sys.require(hasSuicided == false, 'invalid hasSuicided.');

    const state = sys.hostApi.stateDb.stateAt(contract, hashKey);
    sys.log('|||state stateAt ' + uint8ArrayToHex(state));

    sys.require(state.length > 0, 'failed to get state.');
  }

  postTxExecute(input: PostTxExecuteInput): void {
    const sender = sys.aspect.property.get<Uint8Array>('sender');
    const contract = sys.aspect.property.get<Uint8Array>('contract');
    const hashKey = sys.aspect.property.get<Uint8Array>('hashKey');

    const nonce = sys.hostApi.stateDb.nonce(sender);
    sys.log('|||state nonce ' + nonce.toString());
    sys.require(nonce > this.getTxNonce(), 'invalid nonce.');

    const balance = sys.hostApi.stateDb.balance(contract);
    const bigInt = Uint256.fromUint8Array(balance);
    sys.log('|||state balance ' + bigInt.toInt64().toString());
    sys.require(bigInt.toInt64() == 0, 'invalid balance.');

    const codeSize = sys.hostApi.stateDb.codeSize(contract);
    sys.log('|||state codeSize ' + codeSize.toString());
    sys.require(codeSize == sys.aspect.property.get<u64>('codeSize'), 'invalid codeSize.');

    const codeHash = sys.hostApi.stateDb.codeHash(contract);
    sys.log('|||codeHash ' + uint8ArrayToHex(codeHash));
    sys.require(uint8ArrayToHex(codeHash) == sys.aspect.property.get<string>('codeHash'), 'invalid hash.');

    const hasSuicided = sys.hostApi.stateDb.hasSuicided(contract);
    sys.log('|||hasSuicided ' + hasSuicided.toString());
    sys.require(hasSuicided == false, 'invalid hasSuicided.');

    const state = sys.hostApi.stateDb.stateAt(contract, hashKey);
    sys.log('|||state stateAt ' + uint8ArrayToHex(state));

    sys.require(state.length > 0, 'failed to get state.');
  }

  postContractCall(input: PostContractCallInput): void {
    const sender = sys.aspect.property.get<Uint8Array>('sender');
    const contract = sys.aspect.property.get<Uint8Array>('contract');
    const hashKey = sys.aspect.property.get<Uint8Array>('hashKey');

    const nonce = sys.hostApi.stateDb.nonce(sender);
    sys.log('|||state nonce ' + nonce.toString());
    sys.require(nonce > this.getTxNonce(), 'invalid nonce.');

    const balance = sys.hostApi.stateDb.balance(contract);
    const bigInt = Uint256.fromUint8Array(balance);
    sys.log('|||state balance ' + bigInt.toInt64().toString());
    sys.require(bigInt.toInt64() == 0, 'invalid balance.');

    const codeSize = sys.hostApi.stateDb.codeSize(contract);
    sys.log('|||state codeSize ' + codeSize.toString());
    sys.require(codeSize == sys.aspect.property.get<u64>('codeSize'), 'invalid codeSize.');

    const codeHash = sys.hostApi.stateDb.codeHash(contract);
    sys.log('|||codeHash ' + uint8ArrayToHex(codeHash));
    sys.require(uint8ArrayToHex(codeHash) == sys.aspect.property.get<string>('codeHash'), 'invalid hash.');

    const hasSuicided = sys.hostApi.stateDb.hasSuicided(contract);
    sys.log('|||hasSuicided ' + hasSuicided.toString());
    sys.require(hasSuicided == false, 'invalid hasSuicided.');

    const state = sys.hostApi.stateDb.stateAt(contract, hashKey);
    sys.log('|||state stateAt ' + uint8ArrayToHex(state));

    sys.require(state.length > 0, 'failed to get state.');
  }

  preContractCall(input: PreContractCallInput): void {
    const sender = sys.aspect.property.get<Uint8Array>('sender');
    const contract = sys.aspect.property.get<Uint8Array>('contract');
    const hashKey = sys.aspect.property.get<Uint8Array>('hashKey');

    const nonce = sys.hostApi.stateDb.nonce(sender);
    sys.log('|||state nonce ' + nonce.toString());
    sys.require(nonce > this.getTxNonce(), 'invalid nonce.');

    const balance = sys.hostApi.stateDb.balance(contract);
    const bigInt = Uint256.fromUint8Array(balance);
    sys.log('|||state balance ' + bigInt.toInt64().toString());
    sys.require(bigInt.toInt64() == 0, 'invalid balance.');

    const codeSize = sys.hostApi.stateDb.codeSize(contract);
    sys.log('|||state codeSize ' + codeSize.toString());
    sys.require(codeSize == sys.aspect.property.get<u64>('codeSize'), 'invalid codeSize.');

    const codeHash = sys.hostApi.stateDb.codeHash(contract);
    sys.log('|||codeHash ' + uint8ArrayToHex(codeHash));
    sys.require(uint8ArrayToHex(codeHash) == sys.aspect.property.get<string>('codeHash'), 'invalid hash.');

    const hasSuicided = sys.hostApi.stateDb.hasSuicided(contract);
    sys.log('|||hasSuicided ' + hasSuicided.toString());
    sys.require(hasSuicided == false, 'invalid hasSuicided.');

    const state = sys.hostApi.stateDb.stateAt(contract, hashKey);
    sys.log('|||state stateAt ' + uint8ArrayToHex(state));

    sys.require(state.length > 0, 'failed to get state.');
  }
}

// 2.register aspect Instance
const aspect = new StateDBAspect();
entryPoint.setAspect(aspect);

// 3.must export it
export { execute, allocate };
