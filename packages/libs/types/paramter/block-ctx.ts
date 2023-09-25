import { StaticCaller } from '../../system';
import { ScheduleManager } from '../../components';
import {BlockContext, EnvContext} from '../../context';

export class OnBlockInitializeCtx {
  private readonly _staticCaller: StaticCaller;
  private readonly _blockContext: BlockContext;
  private readonly _schedule: ScheduleManager;
  private readonly _env: EnvContext;

  constructor() {
    this._staticCaller = StaticCaller.get();
    this._blockContext = BlockContext.get();
    this._schedule = ScheduleManager.get();
    this._env = EnvContext.get();
  }

  get block(): BlockContext {
    return this._blockContext;
  }

  get schedule(): ScheduleManager {
    return this._schedule;
  }

  get evm(): StaticCaller {
    return this._staticCaller;
  }

  get env(): EnvContext {
    return this._env;
  }
}

export class OnBlockFinalizeCtx {
  private readonly _schedule: ScheduleManager;
  private readonly _staticCaller: StaticCaller;
  private readonly _blockContext: BlockContext;
  private readonly _env: EnvContext;

  constructor() {
    this._schedule = ScheduleManager.get();
    this._staticCaller = StaticCaller.get();
    this._blockContext = BlockContext.get();
    this._env = EnvContext.get();
  }

  get block(): BlockContext {
    return this._blockContext;
  }

  get scheduler(): ScheduleManager {
    return this._schedule;
  }

  get evm(): StaticCaller {
    return this._staticCaller;
  }

  get env(): EnvContext {
    return this._env;
  }
}
