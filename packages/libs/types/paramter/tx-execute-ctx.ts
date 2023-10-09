import {
  AspectStateModifiable,
  EvmCallableCtx,
  InherentCallableCtx,
  StateQueryAble,
  StaticCallAble,
} from '../../common';
import {
  AspectContext,
  AspectProperty,
  BlockContext,
  EnvContext,
  MutableAspectState,
  StateQuery,
  StaticCaller,
  TxContext
} from "../../components";

export class PreTxExecuteCtx
    implements EvmCallableCtx, InherentCallableCtx, AspectStateModifiable, StaticCallAble, StateQueryAble
{
  private readonly _aspectContext: AspectContext;

  private readonly _aspectProperty: AspectProperty;
  private readonly _mutableAspectState: MutableAspectState
  private readonly _staticCall: StaticCaller;
  private readonly _stateContext: StateQuery;

  private readonly _blockContext: BlockContext;
  private readonly _txContext: TxContext;
  private readonly _env: EnvContext;

  constructor() {
    this._aspectContext = AspectContext.instance();
    this._aspectProperty = AspectProperty.instance();
    this._mutableAspectState = MutableAspectState.instance(this);
    this._staticCall = StaticCaller.instance(this);
    this._stateContext = StateQuery.instance(this);

    this._blockContext = BlockContext.instance();
    this._txContext = TxContext.instance();
    this._env = EnvContext.instance();
  }


  get tx(): TxContext {
    return this._txContext;
  }

  get stateDB(): StateQuery {
    return this._stateContext;
  }

  get block(): BlockContext {
    return this._blockContext;
  }

  get aspect(): AspectContext {
    return this._aspectContext;
  }

  get env(): EnvContext {
    return this._env;
  }

  get property(): AspectProperty {
    return this._aspectProperty;
  }

  get mutableState(): MutableAspectState {
    return this._mutableAspectState;
  }

  get staticCall(): StaticCaller {
    return this._staticCall;
  }

  __stateQueryableImplemented(): void {
  }

  __staticCallableImplemented(): void {
  }
  __evmCallableImplemented(): void {}

  __inherentCallableImplemented(): void {}

  __modifiableAspectStateImplemented(): void {}

  __readonlyAspectStateImplemented(): void {}
}

export class PostTxExecuteCtx
    implements EvmCallableCtx, InherentCallableCtx, AspectStateModifiable, StaticCallAble, StateQueryAble
{
  private readonly _aspectContext: AspectContext;

  private readonly _aspectProperty: AspectProperty;
  private readonly _mutableAspectState: MutableAspectState
  private readonly _staticCall: StaticCaller;
  private readonly _stateContext: StateQuery;

  private readonly _blockContext: BlockContext;
  private readonly _txContext: TxContext;
  private readonly _env: EnvContext;

  constructor() {
    this._aspectContext = AspectContext.instance();
    this._aspectProperty = AspectProperty.instance();
    this._mutableAspectState = MutableAspectState.instance(this);
    this._staticCall = StaticCaller.instance(this);
    this._stateContext = StateQuery.instance(this);

    this._blockContext = BlockContext.instance();
    this._txContext = TxContext.instance();
    this._env = EnvContext.instance();
  }


  get tx(): TxContext {
    return this._txContext;
  }

  get stateDB(): StateQuery {
    return this._stateContext;
  }

  get block(): BlockContext {
    return this._blockContext;
  }

  get aspect(): AspectContext {
    return this._aspectContext;
  }

  get env(): EnvContext {
    return this._env;
  }

  get property(): AspectProperty {
    return this._aspectProperty;
  }

  get mutableState(): MutableAspectState {
    return this._mutableAspectState;
  }

  get staticCall(): StaticCaller {
    return this._staticCall;
  }

  __stateQueryableImplemented(): void {
  }

  __staticCallableImplemented(): void {
  }
  __evmCallableImplemented(): void {}

  __inherentCallableImplemented(): void {}

  __modifiableAspectStateImplemented(): void {}

  __readonlyAspectStateImplemented(): void {}
}