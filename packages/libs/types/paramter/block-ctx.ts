import { BlockContext, EnvContext } from '../../context';
import { AspectStateModifiableCtx, EvmCallableCtx } from '../../system';
import {ScheduleManager} from "../../components";

export class OnBlockInitializeCtx implements EvmCallableCtx, AspectStateModifiableCtx {
  private readonly _blockContext: BlockContext;
  private readonly _env: EnvContext;
  private readonly _schedule:ScheduleManager;

  constructor() {
    this._blockContext = BlockContext.get();
    this._env = EnvContext.get();
    this._schedule=ScheduleManager.get();
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
  private readonly _schedule:ScheduleManager;

  constructor() {
    this._blockContext = BlockContext.get();
    this._env = EnvContext.get();
    this._schedule=ScheduleManager.get();

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
