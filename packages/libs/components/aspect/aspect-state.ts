import { fromUint8Array, toUint8Array } from '../../common';
import { AspectStateApi } from '../../hostapi';
import { ImmutableAspectValue, MutableAspectValue } from './aspect-state-interface';

const stateApi = AspectStateApi.instance();

export class MutableAspectState {
  private static _instance: MutableAspectState | null;

  private constructor() {}

  public get<T>(key: string): MutableStateValue<T> {
    return new MutableStateValue<T>(key);
  }

  public static instance(): MutableAspectState {
    if (!this._instance) {
      this._instance = new MutableAspectState();
    }
    return this._instance!;
  }
}

export class ImmutableAspectState {
  private static _instance: ImmutableAspectState | null;

  private constructor() {}

  public get<T>(key: string): ImmutableStateValue<T> {
    return new ImmutableStateValue<T>(key);
  }

  public static instance(): ImmutableAspectState {
    if (!this._instance) {
      this._instance = new ImmutableAspectState();
    }
    return this._instance!;
  }
}

export class ImmutableStateValue<T> implements ImmutableAspectValue<T> {
  protected val: T;
  protected loaded: boolean = false;

  constructor(protected readonly key: string) {
    this.val = fromUint8Array<T>(new Uint8Array(0));
  }

  reload(): void {
    this.val = fromUint8Array<T>(stateApi.get(this.key));
    this.loaded = true;
  }

  unwrap(): T {
    if (!this.loaded) {
      this.reload();
    }

    return this.val;
  }
}

export class MutableStateValue<T> extends ImmutableStateValue<T> implements MutableAspectValue<T> {
  set<T>(value: T): void {
    stateApi.set(this.key, toUint8Array<T>(value));
    this.loaded = false;
  }
}
