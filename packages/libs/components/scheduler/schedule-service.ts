import { EthTransaction, ScheduleMsg, ScheduleMsgId, ScheduleStatus } from '../../proto';
import { Scheduler, utils } from '../../system';

export class ScheduleManager {
  private static _instance: ScheduleManager | null = null;

  private constructor() {}

  public periodic(name: string): PeriodicSchedule {
    return PeriodicSchedule.new(name);
  }

  public adHoc(name: string): AdHocSchedule {
    return AdHocSchedule.new(name);
  }

  public static get(): ScheduleManager {
    if (this._instance == null) {
      this._instance = new ScheduleManager();
    }
    return this._instance!;
  }
}

export interface Schedule {
  submit(tran: EthTransaction): bool;
}

export class PeriodicSchedule implements Schedule {
  public submit(tran: EthTransaction): bool {
    const sch = new ScheduleMsg();
    sch.count = this._execCount;
    sch.startBlock = this._startAfter;
    sch.maxRetry = this._maxRetry;
    sch.everyNBlock = this._everyNBlocks;
    sch.status = ScheduleStatus.Open;
    sch.tx = tran;

    sch.id = new ScheduleMsgId(this._name, '');
    // sch.id.aspectId, createHeight will be set in the hostapi
    return Scheduler.get().submit(sch);
  }

  public static new(name: string): PeriodicSchedule {
    return new PeriodicSchedule(name);
  }

  public startAfter(nBlock: u64): PeriodicSchedule {
    this._startAfter = nBlock; // add current height in host api.
    return this;
  }

  public everyNBlocks(nBlock: u32): PeriodicSchedule {
    this._everyNBlocks = nBlock;
    return this;
  }

  public maxRetry(retryTimes: u32): PeriodicSchedule {
    this._maxRetry = retryTimes;
    return this;
  }

  public execCount(execCount: u64): PeriodicSchedule {
    this._execCount = execCount;
    return this;
  }

  private constructor(
    private readonly _name: string = '',
    private _startAfter: u64 = 0,
    private _everyNBlocks: u32 = 0,
    private _execCount: u64 = 0,
    private _maxRetry: u32 = 0,
  ) {}
}

export class AdHocSchedule implements Schedule {
  public submit(tran: EthTransaction): bool {
    const sch = new ScheduleMsg();
    sch.count = 1;
    // startBlock add current height in host api.
    sch.startBlock = this._nextNBlocks;
    sch.maxRetry = this._maxRetry;
    sch.status = ScheduleStatus.Open;
    sch.tx = tran;

    sch.id = new ScheduleMsgId(this._name, '');
    // sch.id.aspectId, createHeight will be set in the hostapi
    return Scheduler.get().submit(sch);
  }

  public static new(name: string): AdHocSchedule {
    return new AdHocSchedule(name);
  }

  public maxRetry(num: u32): AdHocSchedule {
    this._maxRetry = num;
    return this;
  }

  public nextNBlocks(num: u64): AdHocSchedule {
    this._nextNBlocks = num;
    return this;
  }

  private constructor(
    private readonly _name: string = '',
    private _maxRetry: u32 = 0,
    private _nextNBlocks: u64 = 0,
  ) {}
}

export class ScheduleTx {
  public New(input: string, msg: ScheduleOpts): EthTransaction {
    const inputBytes = utils.stringToUint8Array(input);

    const tx = new EthTransaction();
    tx.chainId = '';
    tx.nonce = 0;
    tx.gasTipCap = msg.maxPriorityFeePerGas;
    tx.gasFeeCap = msg.maxFeePerGas;
    tx.gas = 0;
    tx.gasPrice = '0';
    tx.to = this._address;
    tx.value = msg.value.toString();
    tx.input = inputBytes;
    tx.accessList = [];
    tx.blockHash = new Uint8Array(0);
    tx.blockNumber = 0;
    tx.from = msg.broker;
    tx.hash = new Uint8Array(0);
    tx.transactionIndex = 0;
    tx.type = 0;
    tx.v = new Uint8Array(0);
    tx.r = new Uint8Array(0);
    tx.s = new Uint8Array(0);
    return tx;
  }

  constructor(private readonly _address: string) {}
}

export class ScheduleOpts {
  constructor(
    readonly value: u64 = 0,
    readonly maxFeePerGas: string = '',
    readonly maxPriorityFeePerGas: string = '',
    readonly broker: string = '',
  ) {}
}
