import { allocate, entryPoint, execute, InitInput, sys, TxVerifyInput, uint8ArrayToHex } from '@artela/aspect-libs';
import { ITransactionVerifier } from '@artela/aspect-libs/types/aspect-interface';

/**
 * There are two types of Aspect: Transaction-Level Aspect and Block-Level Aspect.
 * Transaction-Level Aspect will be triggered whenever there is a transaction calling the bound smart contract.
 * Block-Level Aspect will be triggered whenever there is a new block generated.
 *
 * An Aspect can be Transaction-Level, Block-Level,IAspectOperation or both.
 * You can implement corresponding interfaces: IAspectTransaction, IAspectBlock,IAspectOperation or both to tell Artela which
 * type of Aspect you are implementing.
 */
class VerifierAspect implements ITransactionVerifier {
  init(input: InitInput): void {
    sys.aspect.mutableState.get<Uint8Array>('owner').set(input.tx!.from);
  }

  verifyTx(input: TxVerifyInput): Uint8Array {
    return sys.aspect.mutableState.get<Uint8Array>('owner').unwrap();
  }

  /**
   * isOwner is the governance account implemented by the Aspect, when any of the governance operation
   * (including upgrade, config, destroy) is made, isOwner method will be invoked to check
   * against the initiator's account to make sure it has the permission.
   *
   * @param ctx context of Aspect state
   * @param sender address of the operation initiator
   * @return true if check success, false if check fail
   */
  isOwner(sender: Uint8Array): bool {
    return uint8ArrayToHex(sys.aspect.mutableState.get<Uint8Array>('owner').unwrap()) == uint8ArrayToHex(sender);
  }
}

// 2.register aspect Instance
const aspect = new VerifierAspect();
entryPoint.setAspect(aspect);

// 3.must export it
export { execute, allocate };
