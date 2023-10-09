import {EthMessage, EthMessageCallResult, JitInherentRequest, JitInherentResponse} from "../../proto";
import {EvmCallApi} from "../../hostapi";
import {JustInTimeCallAble, NotAuthorizedFail, StaticCallAble} from "../../common";


export class StaticCaller {
    private static _instance: StaticCaller | null;

    private constructor() {
    }

    public submit(request: EthMessage): EthMessageCallResult {
        return EvmCallApi.instance().staticCall(request)
    }

    public static instance(ctx: StaticCallAble): StaticCaller {
        if (ctx == null) {
            throw NotAuthorizedFail
        }
        if (!this._instance) {
            this._instance = new StaticCaller();
        }
        return this._instance!;
    }
}

export class JustInTimeCaller {
    private static _instance: JustInTimeCaller | null;

    private constructor() {
    }

    public submit(request: JitInherentRequest): JitInherentResponse {
        return EvmCallApi.instance().jitCall(request)
    }

    public static instance(ctx: JustInTimeCallAble): JustInTimeCaller {
        if (ctx == null) {
            throw NotAuthorizedFail
        }
        if (!this._instance) {
            this._instance = new JustInTimeCaller();
        }
        return this._instance!;
    }
}