import { EthTransaction } from '../../proto';
import { BlockContext,TraceContext ,TxContext} from '../../context';
import { AspectContext, StaticCaller ,StateContext} from '../../system';

export class PreTxExecuteCtx {
  private _tx: EthTransaction | null;
  private _aspectContext: AspectContext;
  private _staticCaller: StaticCaller;
  private _stateContext: StateContext;
  private _blockContext: BlockContext;
  private _txContext: TxContext;

  constructor(tx: EthTransaction | null) {
    this._tx = tx;
    this._aspectContext = new AspectContext();
    this._staticCaller = new StaticCaller();
    this._stateContext = new StateContext();
    this._blockContext = new BlockContext();
    this._txContext = new TxContext();
  }

  get txContext(): TxContext {
    return this._txContext;
  }

  get staticCaller(): StaticCaller  {
    return this._staticCaller;
  }

  get stateContext(): StateContext  {
    return this._stateContext;
  }

  get blockContext(): BlockContext {
    return this._blockContext;
  }

  get tx(): EthTransaction | null {
    return this._tx;
  }

  get aspectContext(): AspectContext  {
    return this._aspectContext;
  }
}

export class PostTxExecuteCtx {
  private _tx: EthTransaction | null;
  private _aspectContext: AspectContext ;
  private _staticCaller: StaticCaller ;
  private _stateContext: StateContext;
  private _traceContext: TraceContext;
  private _blockContext: BlockContext;
  private _txContext: TxContext;

  constructor(tx: EthTransaction | null) {
    this._tx = tx;
    this._aspectContext = new AspectContext();
    this._staticCaller = new StaticCaller();
    this._stateContext = new StateContext();
    this._traceContext = new TraceContext();
    this._blockContext = new BlockContext();
    this._txContext = new TxContext();

  }


  get txContext(): TxContext {
    return this._txContext;
  }

  get staticCaller(): StaticCaller {
    return this._staticCaller;
  }

  get stateContext(): StateContext {
    return this._stateContext;
  }

  get traceContext(): TraceContext {
    return this._traceContext;
  }

  get blockContext(): BlockContext {
    return this._blockContext;
  }

  get tx(): EthTransaction | null {
    return this._tx;
  }

  get aspectContext(): AspectContext {
    return this._aspectContext;
  }
}
