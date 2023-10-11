import { StateDbApi } from '../../hostapi';
import { NotAuthorizedFail, StateContextAble } from '../../common';

export class StateContext {
  private stateDbApi: StateDbApi;

  private constructor() {
    this.stateDbApi = StateDbApi.instance();
  }

  public balance(addr: string): string {
    return this.stateDbApi.balance(addr);
  }

  public stateAt(addr: string, hash: string): string {
    return this.stateDbApi.stateAt(addr, hash);
  }

  public refund(): i64 {
    return this.stateDbApi.refund();
  }

  public codeHash(addr: string): string {
    return this.stateDbApi.codeHash(addr);
  }

  public nonce(addr: string): i64 {
    return this.stateDbApi.nonce(addr);
  }

  private static _instance: StateContext | null;

  public static instance(ctx: StateContextAble): StateContext {
    if (ctx == null) {
      throw NotAuthorizedFail;
    }
    if (!this._instance) {
      this._instance = new StateContext();
    }
    return this._instance!;
  }
}
