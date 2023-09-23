import { StaticCaller } from '../../system';
import { ScheduleManager } from '../../components';

export class OperationCtx {
  private readonly _staticCaller: StaticCaller;
  private readonly _schedule: ScheduleManager;

  constructor() {
    this._staticCaller = StaticCaller.get();
    this._schedule = ScheduleManager.get();
  }

  get evm(): StaticCaller {
    return this._staticCaller;
  }

  get scheduler(): ScheduleManager {
    return this._schedule;
  }
}
