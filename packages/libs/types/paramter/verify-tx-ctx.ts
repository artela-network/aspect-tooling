import { EthTransaction } from '../../proto';
import { AspectContext, StaticCaller } from '../../system';
import {TxContext} from "../../context";

export class VerifyTxCtx {
  private _tx: EthTransaction | null;
  private _context: AspectContext;
  private _staticCaller: StaticCaller;
  private _txContext: TxContext;

  constructor(tx: EthTransaction | null) {
    this._tx = tx;
    this._context = new AspectContext();
    this._staticCaller = new StaticCaller();
    this._txContext = new TxContext();

  }

  get staticCaller(): StaticCaller {
    return this._staticCaller;
  }

  get txContext(): TxContext {
    return this._txContext;
  }

  get tx(): EthTransaction | null {
    return this._tx;
  }

  get context(): AspectContext  {
    return this._context;
  }
}

export class VerifyAccountCtx {
  private _tx: EthTransaction | null;
  private _context: AspectContext ;
  private _staticCaller: StaticCaller;
  private _txContext: TxContext;

  constructor(tx: EthTransaction | null) {
    this._tx = tx;
    this._context = new AspectContext();
    this._staticCaller = new StaticCaller();
    this._txContext = new TxContext();
  }

  get staticCaller(): StaticCaller {
    return this._staticCaller;
  }

  get txContext(): TxContext {
    return this._txContext;
  }

  get tx(): EthTransaction | null {
    return this._tx;
  }

  get context(): AspectContext {
    return this._context;
  }
}
