import { BlockContext, EnvContext, EthReceiptContext } from '../../context';
import { EthTransaction } from '../../proto';
import { AspectContext, StaticCaller } from '../../system';
import { ScheduleManager } from '../../components';

export class PostTxCommitCtx {
  private readonly _tx: EthTransaction;
  private readonly _receipt: EthReceiptContext;
  private readonly _aspectContext: AspectContext;
  private readonly _staticCaller: StaticCaller;
  private readonly _scheduleManager: ScheduleManager;
  private readonly _blockContext: BlockContext;
  private readonly _env: EnvContext;

  constructor(tx: EthTransaction) {
    this._tx = tx;
    this._aspectContext = AspectContext.get();
    this._receipt = EthReceiptContext.get();
    this._staticCaller = StaticCaller.get();
    this._scheduleManager = ScheduleManager.get();
    this._blockContext = BlockContext.get();
    this._env = EnvContext.get();
  }

  get blockContext(): BlockContext {
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

  get evm(): StaticCaller {
    return this._staticCaller;
  }

  get scheduler(): ScheduleManager {
    return this._scheduleManager;
  }

  get env(): EnvContext {
    return this._env;
  }
}
