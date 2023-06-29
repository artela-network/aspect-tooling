import { AspTransaction, ScheduleMsg, ScheduleMsgId, ScheduleStatus } from '../proto';
import { Opts } from './opts';
import { utils } from '../common/utils';
import {ScheduleCtx} from "../entry";

export interface Schedule {
  submit(tran: AspTransaction): bool;
}

export class PeriodicSchedule implements Schedule {
  public submit(tran: AspTransaction): bool {
    let sch = new ScheduleMsg();
    sch.count = this._count;
    sch.startBlock = this._startBlock;
    sch.maxRetry = this._maxRetry;
    sch.everyNBlock = this._everyNBlocks;
    sch.status = ScheduleStatus.Open;
    sch.tx = tran;

    sch.id = new ScheduleMsgId(this._name, '');
    // sch.id.aspectId, createHeight will be set in the hostapi
    return this._ctx.scheduleTx(sch);
  }

  public static new(ctx: ScheduleCtx, name: string): PeriodicSchedule {
    return new PeriodicSchedule(ctx, name);
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
  private _ctx: ScheduleCtx;

  constructor(
      ctx: ScheduleCtx,
      name: string = "",
      startAfter: u64 = 0,
      everyNBlocks: u32 = 0,
      count: u64 = 0,
      maxRetry: u32 = 0,
  ) {
    this._ctx = ctx;
    // startBlock add current height in host api.
    this._startBlock = startAfter;
    this._name = name;
    this._everyNBlocks = everyNBlocks;
    this._maxRetry = maxRetry;
    this._count = count;
  }
}

export class AdHocSchedule implements Schedule {
  public submit(tran: AspTransaction): bool {
    let sch = new ScheduleMsg();
    sch.count = 1;
    // startBlock add current height in host api.
    sch.startBlock = this._nextNBlocks;
    sch.maxRetry = this._maxRetry;
    sch.status = ScheduleStatus.Open;
    sch.tx = tran;

    sch.id = new ScheduleMsgId(this._name, "");
    // sch.id.aspectId, createHeight will be set in the hostapi
    return this._ctx.scheduleTx(sch);
  }

  public static new(ctx: ScheduleCtx, name: string): AdHocSchedule {
    return new AdHocSchedule(ctx, name);
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
  private _ctx: ScheduleCtx;

  constructor(
      ctx: ScheduleCtx,
      name: string = "",
      maxRetry: u32 = 0,
      nextNBlocks: u64 = 0,
  ) {
    this._ctx = ctx;
    this._name = name;
    this._nextNBlocks = nextNBlocks;
    this._maxRetry = maxRetry;
  }
}

export class ScheduleTx {
  public New(input: string, msg: Opts): AspTransaction {
    let inputBytes = utils.stringToUint8Array(input);

    let tx = new AspTransaction();
    tx.chainId = "";
    tx.nonce = 0;
    tx.gasTipCap = msg.maxPriorityFeePerGas;
    tx.gasFeeCap = msg.maxFeePerGas;
    tx.gasLimit = 0;
    tx.gasPrice = 0;
    tx.to = this._address;
    tx.value = msg.value;
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