import { fromUint8Array } from '../../common';
import { AspectPropertyApi } from '../../hostapi';

const propertyApi = AspectPropertyApi.instance();

export class AspectProperty {
  private static _instance: AspectProperty | null;

  private constructor() {}

  public get<T>(key: string): T {
    return fromUint8Array<T>(propertyApi.get(key));
  }

  public static instance(): AspectProperty {
    if (!this._instance) {
      this._instance = new AspectProperty();
    }
    return this._instance!;
  }
}
