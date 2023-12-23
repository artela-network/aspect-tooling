import { fromUint8Array, hexToUint8Array, toUint8Array } from '../../common';
import { MutableAspectValue } from './aspect-state-interface';
import { AspectTransientStorageApi } from '../../hostapi';

const transientStorageApi = AspectTransientStorageApi.instance();

export class TransientStorage {
  private static _instance: TransientStorage | null;

  private constructor() {}

  public get<T>(key: string, aspectId: string = ''): TransientStorageValue<T> {
    return new TransientStorageValue(key, hexToUint8Array(aspectId));
  }

  public static instance(): TransientStorage {
    if (!this._instance) {
      this._instance = new TransientStorage();
    }
    return this._instance!;
  }
}

export class TransientStorageValue<T> implements MutableAspectValue<T> {
  private val: T;
  private loaded: boolean = false;

  constructor(
    private readonly key: string,
    private readonly aspectId: Uint8Array = new Uint8Array(0),
  ) {
    this.val = fromUint8Array<T>(new Uint8Array(0));
  }

  set<T>(value: T): void {
    transientStorageApi.set(this.key, toUint8Array<T>(value));
    this.loaded = false;
  }

  reload(): void {
    this.val = fromUint8Array<T>(transientStorageApi.get(this.key, this.aspectId));
    this.loaded = true;
  }

  unwrap(): T {
    if (!this.loaded) {
      this.reload();
    }

    return this.val;
  }
}
