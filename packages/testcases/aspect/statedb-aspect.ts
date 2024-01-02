import {
  allocate,
  BigInt,
  entryPoint,
  execute,
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
  uint8ArrayToHex,
} from '@artela/aspect-libs';

class ContextAspect
  implements
    IPostTxExecuteJP,
    IPreTxExecuteJP,
    IPostContractCallJP,
    IPreContractCallJP,
    ITransactionVerifier
{
  verifyTx(input: TxVerifyInput): Uint8Array {
    const sender = sys.aspect.property.get<Uint8Array>('sender');
    const contract = sys.aspect.property.get<Uint8Array>('contract');
    const hashKey = sys.aspect.property.get<Uint8Array>('hashKey');

    const nonce = sys.hostApi.stateDb.nonce(sender);
    sys.log('|||sate nonce ' + nonce.toString());
    sys.require(nonce > 0, 'invalid nonce.');

    const balance = sys.hostApi.stateDb.balance(contract);
    const bigInt = BigInt.fromUint8Array(balance);
    sys.log('|||sate balance ' + bigInt.toInt64().toString());
    sys.require(bigInt.toInt64() == 0, 'invalid balance.');

    const codeSize = sys.hostApi.stateDb.codeSize(contract);
    sys.log('|||sate codeSize ' + codeSize.toString());
    sys.require(codeSize > 0, 'invalid codeSize.');

    const codeHash = sys.hostApi.stateDb.codeHash(contract);
    sys.log('|||codeHash ' + uint8ArrayToHex(codeHash));

    const hasSuicided = sys.hostApi.stateDb.hasSuicided(contract);
    sys.log('|||hasSuicided ' + hasSuicided.toString());
    sys.require(hasSuicided == false, 'invalid hasSuicided.');

    const state = sys.hostApi.stateDb.stateAt(contract, hashKey);
    sys.log('|||sate stateAt ' + uint8ArrayToHex(state));

    sys.require(state.length > 0, 'failed to get state.');

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
    sys.log('|||sate nonce ' + nonce.toString());
    sys.require(nonce > 0, 'invalid nonce.');

    const balance = sys.hostApi.stateDb.balance(contract);
    const bigInt = BigInt.fromUint8Array(balance);
    sys.log('|||sate balance ' + bigInt.toInt64().toString());
    sys.require(bigInt.toInt64() == 0, 'invalid balance.');

    const codeSize = sys.hostApi.stateDb.codeSize(contract);
    sys.log('|||sate codeSize ' + codeSize.toString());
    sys.require(codeSize > 0, 'invalid codeSize.');

    const codeHash = sys.hostApi.stateDb.codeHash(contract);
    sys.log('|||codeHash ' + uint8ArrayToHex(codeHash));

    const hasSuicided = sys.hostApi.stateDb.hasSuicided(contract);
    sys.log('|||hasSuicided ' + hasSuicided.toString());
    sys.require(hasSuicided == false, 'invalid hasSuicided.');

    const state = sys.hostApi.stateDb.stateAt(contract, hashKey);
    sys.log('|||sate stateAt ' + uint8ArrayToHex(state));

    sys.require(state.length > 0, 'failed to get state.');
  }

  postTxExecute(input: PostTxExecuteInput): void {
    const sender = sys.aspect.property.get<Uint8Array>('sender');
    const contract = sys.aspect.property.get<Uint8Array>('contract');
    const hashKey = sys.aspect.property.get<Uint8Array>('hashKey');

    const nonce = sys.hostApi.stateDb.nonce(sender);
    sys.log('|||sate nonce ' + nonce.toString());
    sys.require(nonce > 0, 'invalid nonce.');

    const balance = sys.hostApi.stateDb.balance(contract);
    const bigInt = BigInt.fromUint8Array(balance);
    sys.log('|||sate balance ' + bigInt.toInt64().toString());
    sys.require(bigInt.toInt64() == 0, 'invalid balance.');

    const codeSize = sys.hostApi.stateDb.codeSize(contract);
    sys.log('|||sate codeSize ' + codeSize.toString());
    sys.require(codeSize > 0, 'invalid codeSize.');

    const codeHash = sys.hostApi.stateDb.codeHash(contract);
    sys.log('|||codeHash ' + uint8ArrayToHex(codeHash));

    const hasSuicided = sys.hostApi.stateDb.hasSuicided(contract);
    sys.log('|||hasSuicided ' + hasSuicided.toString());
    sys.require(hasSuicided == false, 'invalid hasSuicided.');

    const state = sys.hostApi.stateDb.stateAt(contract, hashKey);
    sys.log('|||sate stateAt ' + uint8ArrayToHex(state));

    sys.require(state.length > 0, 'failed to get state.');
  }

  postContractCall(input: PostContractCallInput): void {
    const sender = sys.aspect.property.get<Uint8Array>('sender');
    const contract = sys.aspect.property.get<Uint8Array>('contract');
    const hashKey = sys.aspect.property.get<Uint8Array>('hashKey');

    const nonce = sys.hostApi.stateDb.nonce(sender);
    sys.log('|||sate nonce ' + nonce.toString());
    sys.require(nonce > 0, 'invalid nonce.');

    const balance = sys.hostApi.stateDb.balance(contract);
    const bigInt = BigInt.fromUint8Array(balance);
    sys.log('|||sate balance ' + bigInt.toInt64().toString());
    sys.require(bigInt.toInt64() == 0, 'invalid balance.');

    const codeSize = sys.hostApi.stateDb.codeSize(contract);
    sys.log('|||sate codeSize ' + codeSize.toString());
    sys.require(codeSize > 0, 'invalid codeSize.');

    const codeHash = sys.hostApi.stateDb.codeHash(contract);
    sys.log('|||codeHash ' + uint8ArrayToHex(codeHash));

    const hasSuicided = sys.hostApi.stateDb.hasSuicided(contract);
    sys.log('|||hasSuicided ' + hasSuicided.toString());
    sys.require(hasSuicided == false, 'invalid hasSuicided.');

    const state = sys.hostApi.stateDb.stateAt(contract, hashKey);
    sys.log('|||sate stateAt ' + uint8ArrayToHex(state));

    sys.require(state.length > 0, 'failed to get state.');
  }

  preContractCall(input: PreContractCallInput): void {
    const sender = sys.aspect.property.get<Uint8Array>('sender');
    const contract = sys.aspect.property.get<Uint8Array>('contract');
    const hashKey = sys.aspect.property.get<Uint8Array>('hashKey');

    const nonce = sys.hostApi.stateDb.nonce(sender);
    sys.log('|||sate nonce ' + nonce.toString());
    sys.require(nonce > 0, 'invalid nonce.');

    const balance = sys.hostApi.stateDb.balance(contract);
    const bigInt = BigInt.fromUint8Array(balance);
    sys.log('|||sate balance ' + bigInt.toInt64().toString());
    sys.require(bigInt.toInt64() == 0, 'invalid balance.');

    const codeSize = sys.hostApi.stateDb.codeSize(contract);
    sys.log('|||sate codeSize ' + codeSize.toString());
    sys.require(codeSize > 0, 'invalid codeSize.');

    const codeHash = sys.hostApi.stateDb.codeHash(contract);
    sys.log('|||codeHash ' + uint8ArrayToHex(codeHash));

    const hasSuicided = sys.hostApi.stateDb.hasSuicided(contract);
    sys.log('|||hasSuicided ' + hasSuicided.toString());
    sys.require(hasSuicided == false, 'invalid hasSuicided.');

    const state = sys.hostApi.stateDb.stateAt(contract, hashKey);
    sys.log('|||sate stateAt ' + uint8ArrayToHex(state));

    sys.require(state.length > 0, 'failed to get state.');
  }
}

// 2.register aspect Instance
const aspect = new ContextAspect();
entryPoint.setAspect(aspect);

// 3.must export it
export { execute, allocate };
