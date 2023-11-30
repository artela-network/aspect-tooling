import {
  AspectStateModifiable,
  BlockContextAccessible,
  EnvContextAccessible,
  ScheduleAble,
  StaticCallable,
  TxContextAccessible,
} from '../../common';
import {
  AspectProperty,
  BlockContext,
  EnvContext,
  MutableAspectState,
  ScheduleManager,
  StaticCaller,
  TxContext,
} from '../../components';

export class OperationCtx
  implements
    AspectStateModifiable,
    StaticCallable,
    ScheduleAble,
    BlockContextAccessible,
    EnvContextAccessible,
    TxContextAccessible
{
  constructor() {}

  get property(): AspectProperty {
    return AspectProperty.instance();
  }

  get mutableState(): MutableAspectState {
    return MutableAspectState.instance(this);
  }

  get schedule(): ScheduleManager {
    return ScheduleManager.instance(this);
  }

  get staticCall(): StaticCaller {
    return StaticCaller.instance(this);
  }
  get tx(): TxContext {
    return TxContext.instance(this);
  }
  get env(): EnvContext {
    return EnvContext.instance(this);
  }
  get block(): BlockContext {
    return BlockContext.instance(this);
  }

  __blockContextImplemented(): void {}

  __envContextImplemented(): void {}

  __modifiableAspectStateImplemented(): void {}

  __readonlyAspectStateImplemented(): void {}

  __scheduleImplemented(): void {}

  __staticCallableImplemented(): void {}

  __txContextImplemented(): void {}
}
