import {
  AspectStateModifiable,
  BlockContextAble,
  EnvContextAble,
  ReceiptContextAble,
  StaticCallAble,
  TxContextAble
} from '../../common';
import {
  AspectContext,
  AspectProperty,
  BlockContext,
  EnvContext,
  MutableAspectState,
  ReceiptContext,
  StaticCaller,
  TxContext
} from "../../components";

export class PostTxCommitCtx
    implements AspectStateModifiable, TxContextAble, ReceiptContextAble, BlockContextAble, EnvContextAble, StaticCallAble {
  constructor() {
  }

  get mutableState(): MutableAspectState {
    return MutableAspectState.instance(this);
  }

  get property(): AspectProperty {
    return AspectProperty.instance();
  }

  get staticCall(): StaticCaller {
    return StaticCaller.instance(this);
  }
  get block(): BlockContext {
    return BlockContext.instance(this);
  }

  get tx(): TxContext {
    return TxContext.instance(this);
  }

  get receipt(): ReceiptContext {
    return ReceiptContext.instance(this)
  }
  get aspect(): AspectContext {
    return AspectContext.instance()
  }
  get env(): EnvContext {
    return EnvContext.instance(this)
  }

  __modifiableAspectStateImplemented(): void {}

  __readonlyAspectStateImplemented(): void {}

  __blockContextImplemented(): void {
  }

  __envContextImplemented(): void {
  }

  __receiptContextImplemented(): void {
  }

  __staticCallableImplemented(): void {
  }

  __txContextImplemented(): void {
  }
}
