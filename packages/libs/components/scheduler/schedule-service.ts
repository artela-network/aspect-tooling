import { EthTransaction, ScheduleMsg, ScheduleMsgId, ScheduleStatus } from '../../proto';
import { UtilityProvider, ScheduleAccessor } from '../../system';

export class ScheduleManager {
  public periodic(name: string): PeriodicSchedule {
    return PeriodicSchedule.new(name);
  }

  public adHoc(name: string): AdHocSchedule {
    return AdHocSchedule.new(name);
  }
}

export interface Scheduler {
  submit(tran: EthTransaction): bool;
}

export class PeriodicSchedule implements Scheduler {
  public submit(tran: EthTransaction): bool {
    const sch = new ScheduleMsg();
    sch.count = this._count;
    sch.startBlock = this._startBlock;
    sch.maxRetry = this._maxRetry;
    sch.everyNBlock = this._everyNBlocks;
    sch.status = ScheduleStatus.Open;
    sch.tx = tran;

    sch.id = new ScheduleMsgId(this._name, '');
    // sch.id.aspectId, createHeight will be set in the hostapi
    return ScheduleAccessor.submit(sch);
  }

  public static new(name: string): PeriodicSchedule {
    return new PeriodicSchedule(name);
  }

  public startAfter(num: u64): PeriodicSchedule {
    this._startBlock = num; // add current height in host api.
    return this;
  }

  public everyNBlocks(num: u32): PeriodicSchedule {
    this._everyNBlocks = num;
    return this;
  }

  public maxRetry(num: u32): PeriodicSchedule {
    this._maxRetry = num;
    return this;
  }

  public count(num: u64): PeriodicSchedule {
    this._count = num;
    return this;
  }

  private _name: string;
  private _everyNBlocks: u32;
  private _maxRetry: u32;
  private _count: u64;
  private _startBlock: u64;

  constructor(
    name: string = '',
    startAfter: u64 = 0,
    everyNBlocks: u32 = 0,
    count: u64 = 0,
    maxRetry: u32 = 0,
  ) {
    // startBlock add current height in host api.
    this._startBlock = startAfter;
    this._name = name;
    this._everyNBlocks = everyNBlocks;
    this._maxRetry = maxRetry;
    this._count = count;
  }
}

export class AdHocSchedule implements Scheduler {
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
    return ScheduleAccessor.submit(sch);
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

  private _name: string;
  private _maxRetry: u32;
  private _nextNBlocks: u64;

  constructor(name: string = '', maxRetry: u32 = 0, nextNBlocks: u64 = 0) {
    this._name = name;
    this._nextNBlocks = nextNBlocks;
    this._maxRetry = maxRetry;
  }
}

export class ScheduleTx {
  public New(input: string, msg: Opts): EthTransaction {
    const inputBytes = UtilityProvider.stringToUint8Array(input);

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

  constructor(address: string) {
    this._address = address;
  }

  _address: string;
}

export class Opts {
  value: u64;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
  broker: string;

  constructor(
    value: u64 = 0,
    maxFeePerGas: string = '',
    maxPriorityFeePerGas: string = '',
    broker: string = '',
  ) {
    this.value = value;
    this.maxFeePerGas = maxFeePerGas;
    this.maxPriorityFeePerGas = maxPriorityFeePerGas;
    this.broker = broker;
  }
}
