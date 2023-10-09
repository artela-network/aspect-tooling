import { BlockContext, EnvContext, EthReceiptContext } from '../../components/context';
import { EthTransaction } from '../../proto';
import { AspectStateModifiable, EvmCallableCtx } from '../../common';
import {AspectContext} from "../../components/aspect";

export class PostTxCommitCtx implements EvmCallableCtx, AspectStateModifiable {
  private readonly _tx: EthTransaction;
  private readonly _receipt: EthReceiptContext;
  private readonly _aspectContext: AspectContext;
  private readonly _blockContext: BlockContext;
  private readonly _env: EnvContext;

  constructor(tx: EthTransaction) {
    this._tx = tx;
    this._aspectContext = AspectContext.instance();
    this._receipt = EthReceiptContext.instance();
    this._blockContext = BlockContext.instance();
    this._env = EnvContext.instance();
  }

  get block(): BlockContext {
    return this._blockContext;
  }

  get tx(): EthTransaction {
    return this._tx;
  }

  get receipt(): EthReceiptContext {
    return this._receipt;
  }

  get aspect(): AspectContext {
    return this._aspectContext;
  }

  get env(): EnvContext {
    return this._env;
  }

  __evmCallableImplemented(): void {}

  __modifiableAspectStateImplemented(): void {}

  __readonlyAspectStateImplemented(): void {}
}
