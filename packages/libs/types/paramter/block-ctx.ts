import {AspectStateModifiable, BlockContextAble, EnvContextAble, StaticCallAble} from '../../common';
import {AspectProperty, BlockContext, EnvContext, MutableAspectState, StaticCaller} from '../../components';

export class OnBlockInitializeCtx implements AspectStateModifiable, StaticCallAble, EnvContextAble, BlockContextAble {
  constructor() {
  }

  get block(): BlockContext {
    return BlockContext.instance(this)
  }
  get env(): EnvContext {
    return EnvContext.instance(this)
  }

  get property(): AspectProperty {
    return AspectProperty.instance()
  }

  get mutableState(): MutableAspectState {
    return MutableAspectState.instance(this);
  }

  get staticCall(): StaticCaller {
    return StaticCaller.instance(this);
  }

  __blockContextImplemented(): void {
  }

  __envContextImplemented(): void {
  }

  __staticCallableImplemented(): void {
  }
  __modifiableAspectStateImplemented(): void {}

  __readonlyAspectStateImplemented(): void {}
}

export class OnBlockFinalizeCtx implements AspectStateModifiable, StaticCallAble, EnvContextAble, BlockContextAble {
  constructor() {
  }

  get block(): BlockContext {
    return BlockContext.instance(this);
  }
  get env(): EnvContext {
    return EnvContext.instance(this);
  }

  get property(): AspectProperty {
    return AspectProperty.instance();
  }

  get mutableState(): MutableAspectState {
    return MutableAspectState.instance(this);
  }

  get staticCall(): StaticCaller {
    return StaticCaller.instance(this);
  }

  __blockContextImplemented(): void {
  }
  __envContextImplemented(): void {
  }

  __staticCallableImplemented(): void {
  }

  __modifiableAspectStateImplemented(): void {}

  __readonlyAspectStateImplemented(): void {}
}
