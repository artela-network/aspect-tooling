import { RuntimeContextApi } from '../hostapi';
import { BlockKey } from './key-block';
import { TxKey } from './key-tx';
import { EnvKey } from './key-env';
import { NewMessageError } from './errors';

export interface ResultUnwrap<T> {
  decode(u: Uint8Array): T;
}

export class ResultNotImplemented {}
export class Key<T> {
  protected parts: string[] = new Array<string>();
  protected resultUnwrap: ResultUnwrap<T> | null;

  protected constructor(
    key: string,
    prefixes: Array<string> = [],
    convert: ResultUnwrap<T> | null = null,
  ) {
    this.addAll(prefixes);
    this.add(key);
    this.resultUnwrap = convert;
  }

  protected addAll(key: string[]): void {
    for (let i = 0; i < key.length; i++) {
      this.parts.push(key[i]);
    }
  }

  protected add(key: string): void {
    this.parts.push(key);
  }

  public unwrap(): T {
    if (this.parts.length <= 1) {
      throw NewMessageError('Data that is too large cannot be loaded');
    }
    const runtimeContext = RuntimeContextApi.instance();
    const response = runtimeContext.get(this.toString());
    if (!response.data!.value) {
      throw NewMessageError(response.result!.message);
    }
    return this.resultUnwrap!.decode(response.data!.value);
  }
  public toString(): string {
    if (this.parts.length == 0) {
      return '';
    }
    let path = this.parts.join('^');
    if (path.endsWith('^')) {
      path = path.slice(0, path.length - 1);
    }
    return path;
  }
}

export class ContextKey {
  static get block(): BlockKey {
    return new BlockKey();
  }

  static get tx(): TxKey {
    return new TxKey();
  }

  static get env(): EnvKey {
    return new EnvKey();
  }
}
