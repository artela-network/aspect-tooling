import { BlockContext, EnvContext } from '../../components/context';
import { AspectStateModifiableCtx, EvmCallableCtx } from '../../common';
import { ScheduleManager } from '../../components';

export class OnBlockInitializeCtx implements EvmCallableCtx, AspectStateModifiableCtx {
  private readonly _blockContext: BlockContext;
  private readonly _env: EnvContext;
  private readonly _schedule: ScheduleManager;

  constructor() {
    this._blockContext = BlockContext.instance();
    this._env = EnvContext.instance();
    this._schedule = ScheduleManager.instance();
  }

  get block(): BlockContext {
    return this._blockContext;
  }

  get env(): EnvContext {
    return this._env;
  }

  get schedule(): ScheduleManager {
    return this._schedule;
  }

  __evmCallableImplemented(): void {}

  __modifiableAspectStateImplemented(): void {}

  __readonlyAspectStateImplemented(): void {}
}

export class OnBlockFinalizeCtx implements EvmCallableCtx, AspectStateModifiableCtx {
  private readonly _blockContext: BlockContext;
  private readonly _env: EnvContext;
  private readonly _schedule: ScheduleManager;

  constructor() {
    this._blockContext = BlockContext.instance();
    this._env = EnvContext.instance();
    this._schedule = ScheduleManager.instance();
  }

  get block(): BlockContext {
    return this._blockContext;
  }

  get env(): EnvContext {
    return this._env;
  }
  get schedule(): ScheduleManager {
    return this._schedule;
  }

  __evmCallableImplemented(): void {}

  __modifiableAspectStateImplemented(): void {}

  __readonlyAspectStateImplemented(): void {}
}
