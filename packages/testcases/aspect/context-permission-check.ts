import {
    allocate,
    BoolData,
    BytesData,
    entryPoint,
    EthAccessList,
    EthAccessTuple,
    EthLog,
    EthLogs,
    execute,
    IntArrayData,
    IntData,
    IPostContractCallJP,
    IPostTxExecuteJP,
    IPreContractCallJP,
    IPreTxExecuteJP,
    ITransactionVerifier,
    PostContractCallInput,
    PostTxExecuteInput,
    PreContractCallInput,
    PreTxExecuteInput,
    StringArrayData,
    StringData,
    stringToUint8Array,
    sys,
    TxVerifyInput,
    uint8ArrayToHex,
    uint8ArrayToString,
    UintData
} from "@artela/aspect-libs";
import { Protobuf } from "as-proto/assembly";

enum CtxType {
    BoolData,
    BytesData,
    IntData,
    UintData,
    StringData,
    IntArrayData,
    StringArrayData,
    EthAccessList,
    EthLogs,
}

function newCtxKeys(): Map<string, CtxType> {
    const ck: Map<string, CtxType> = new Map()

    ck.set("isCall", CtxType.BoolData)
    ck.set("block.header.parentHash", CtxType.BytesData)
    ck.set("block.header.miner", CtxType.BytesData)
    ck.set("block.header.transactionsRoot", CtxType.BytesData)
    ck.set("block.header.number", CtxType.UintData)
    ck.set("block.header.timestamp", CtxType.UintData)
    ck.set("env.extraEIPs", CtxType.IntArrayData)
    ck.set("env.enableCreate", CtxType.BoolData)
    ck.set("env.enableCall", CtxType.BoolData)
    ck.set("env.allowUnprotectedTxs", CtxType.BoolData)
    ck.set("env.chain.chainId", CtxType.UintData)
    ck.set("env.chain.homesteadBlock", CtxType.UintData)
    ck.set("env.chain.daoForkBlock", CtxType.UintData)
    ck.set("env.chain.daoForkSupport", CtxType.BoolData)
    ck.set("env.chain.eip150Block", CtxType.UintData)
    ck.set("env.chain.eip155Block", CtxType.UintData)
    ck.set("env.chain.eip158Block", CtxType.UintData)
    ck.set("env.chain.byzantiumBlock", CtxType.UintData)
    ck.set("env.chain.constantinopleBlock", CtxType.UintData)
    ck.set("env.chain.petersburgBlock", CtxType.UintData)
    ck.set("env.chain.istanbulBlock", CtxType.UintData)
    ck.set("env.chain.muirGlacierBlock", CtxType.UintData)
    ck.set("env.chain.berlinBlock", CtxType.UintData)
    ck.set("env.chain.londonBlock", CtxType.UintData)
    ck.set("env.chain.arrowGlacierBlock", CtxType.UintData)
    ck.set("env.chain.grayGlacierBlock", CtxType.UintData)
    ck.set("env.chain.mergeNetSplitBlock", CtxType.UintData)
    ck.set("env.chain.shanghaiTime", CtxType.UintData)
    ck.set("env.chain.cancunTime", CtxType.UintData)
    ck.set("env.chain.pragueTime", CtxType.UintData)
    ck.set("env.consensusParams.block.maxGas", CtxType.IntData)
    ck.set("env.consensusParams.block.maxBytes", CtxType.IntData)
    ck.set("env.consensusParams.evidence.maxAgeDuration", CtxType.IntData)
    ck.set("env.consensusParams.evidence.maxAgeNumBlocks", CtxType.IntData)
    ck.set("env.consensusParams.evidence.maxBytes", CtxType.IntData)
    ck.set("env.consensusParams.validator.pubKeyTypes", CtxType.StringArrayData)
    ck.set("env.consensusParams.appVersion", CtxType.UintData)
    ck.set("tx.type", CtxType.UintData)
    // ck.set("tx.chainId", CtxType.UintData)
    ck.set("tx.accessList", CtxType.EthAccessList)
    ck.set("tx.nonce", CtxType.UintData)
    ck.set("tx.gasPrice", CtxType.BytesData)
    ck.set("tx.gas", CtxType.UintData)
    ck.set("tx.gasTipCap", CtxType.BytesData)
    ck.set("tx.gasFeeCap", CtxType.BytesData)
    ck.set("tx.to", CtxType.BytesData)
    ck.set("tx.value", CtxType.BytesData)
    ck.set("tx.data", CtxType.BytesData)
    ck.set("tx.bytes", CtxType.BytesData)
    ck.set("tx.hash", CtxType.BytesData)
    ck.set("tx.unsigned.bytes", CtxType.BytesData)
    ck.set("tx.unsigned.hash", CtxType.BytesData)
    ck.set("tx.sig.v", CtxType.BytesData)
    ck.set("tx.sig.r", CtxType.BytesData)
    ck.set("tx.sig.s", CtxType.BytesData)
    ck.set("tx.from", CtxType.BytesData)
    ck.set("tx.index", CtxType.UintData)
    ck.set("aspect.id", CtxType.BytesData)
    ck.set("aspect.version", CtxType.UintData)
    ck.set("msg.from", CtxType.BytesData)
    ck.set("msg.to", CtxType.BytesData)
    ck.set("msg.value", CtxType.BytesData)
    ck.set("msg.gas", CtxType.UintData)
    ck.set("msg.input", CtxType.BytesData)
    ck.set("msg.index", CtxType.UintData)
    ck.set("msg.result.ret", CtxType.BytesData)
    ck.set("msg.result.gasUsed", CtxType.UintData)
    ck.set("msg.result.error", CtxType.StringData)
    ck.set("receipt.status", CtxType.UintData)
    ck.set("receipt.logs", CtxType.EthLogs)
    ck.set("receipt.gasUsed", CtxType.UintData)
    ck.set("receipt.cumulativeGasUsed", CtxType.UintData)
    ck.set("receipt.bloom", CtxType.BytesData)

    return ck
}

class ContextPermissionCheck implements IPostTxExecuteJP, IPreTxExecuteJP, IPostContractCallJP, IPreContractCallJP, ITransactionVerifier {
    IGNORE_KEY: string = 'ignoreKey'

    getFromCtx(valType: CtxType, key: string): string {
        const rawValue = sys.hostApi.runtimeContext.get(key)
        let realValue: string
        switch (valType) {
            case CtxType.BoolData:
                realValue = Protobuf.decode<BoolData>(rawValue, BoolData.decode).data.toString()
                break
            case CtxType.BytesData:
                realValue = uint8ArrayToHex(Protobuf.decode<BytesData>(rawValue, BytesData.decode).data)
                break
            case CtxType.UintData:
                realValue = Protobuf.decode<UintData>(rawValue, UintData.decode).data.toString(10)
                break
            case CtxType.IntData:
                realValue = Protobuf.decode<IntData>(rawValue, IntData.decode).data.toString(10)
                break
            case CtxType.IntArrayData:
                const intArrs = Protobuf.decode<IntArrayData>(rawValue, IntArrayData.decode).data
                realValue = `[${intArrs.map((v: i64) => v.toString(10)).join(', ')}]`
                break
            case CtxType.EthAccessList:
                const ethAcArr = Protobuf.decode<EthAccessList>(rawValue, EthAccessList.decode).accessList
                realValue = `[${ethAcArr.map((v: EthAccessTuple) => v.address).join(', ')}]`
                break
            case CtxType.StringArrayData:
                const strArr = Protobuf.decode<StringArrayData>(rawValue, StringArrayData.decode).data
                realValue = `[${strArr.join(', ')}]`
                break
            case CtxType.StringData:
                realValue = Protobuf.decode<StringData>(rawValue, StringData.decode).data
                break
            case CtxType.EthLogs:
                const ethLogs = Protobuf.decode<EthLogs>(rawValue, EthLogs.decode).logs
                realValue = `[${ethLogs.map((v: EthLog) => uint8ArrayToHex(v.address)).join(', ')}]`
                break
            default:
                realValue = ""
                break;
        }
        return realValue
    }

    checkCtxPermission(logPrefix: string, excludeList: Array<string>): void {
        const exSet = new Set<string>()

        const rawIgnoreKeyTuple = sys.aspect.property.get<Uint8Array>(this.IGNORE_KEY)
        const ignoreKeyTuple = uint8ArrayToString(rawIgnoreKeyTuple).split('|')

        let phase: string
        let ignoreKey: string
        if (ignoreKeyTuple.length < 2) {
            phase = 'all'
            ignoreKey = ''
        } else {
            phase = ignoreKeyTuple[0]
            ignoreKey = ignoreKeyTuple[1]
        }

        sys.log(`+++++++++++++ ${phase} ++++++ ${ignoreKey} ++++++++++++`)
        const phaseMatch = phase == 'all' || phase === logPrefix
        const ignoreAllKeys = ignoreKey === 'all' || ignoreKey == 'undefined'

        for (let i = 0; i < excludeList.length; i++) {
            if (phaseMatch && (ignoreAllKeys || ignoreKey === excludeList[i])) {
                continue
            }
            exSet.add(excludeList[i])
        }

        const ctxKeys = newCtxKeys()
        const keys = ctxKeys.keys()
        const values = ctxKeys.values()
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i]
            const val = values[i]
            if (exSet.has(key)) {
                continue
            }
            sys.log(`${logPrefix} ${key}`)
            sys.log(`${this.getFromCtx(val, key)}\n-----------`)
        }
    }

    /**
     * All clear
     * @param input 
     * @returns 
     */
    verifyTx(input: TxVerifyInput): Uint8Array {
        const logPrefix = "verifyTx";
        sys.log(`|||-${logPrefix}$$== -----------------------`)

        this.checkCtxPermission(
            logPrefix,
            [
                "block.header.parentHash",
                "block.header.miner",
                "block.header.transactionsRoot",
                "block.header.timestamp",
                "tx.chainId",
                "tx.accessList",
                "tx.bytes",
                "tx.hash",
                "tx.sig.v",
                "tx.sig.r",
                "tx.sig.s",
                "tx.from",
                "tx.index",
                "aspect.version",
                "msg.from",
                "msg.to",
                "msg.value",
                "msg.gas",
                "msg.input",
                "msg.index",
                "msg.result.ret",
                "msg.result.gasUsed",
                "msg.result.error",
                "receipt.status",
                "receipt.logs",
                "receipt.gasUsed",
                "receipt.cumulativeGasUsed",
                "receipt.bloom",
            ]
        )


        return stringToUint8Array("test log")
    }


    isOwner(sender: Uint8Array): bool {
        const value = sys.aspect.property.get<Uint8Array>("owner");
        return uint8ArrayToHex(value).includes(uint8ArrayToHex(sender));
    }

    /**
     * All clear
     * @param input 
     */
    preTxExecute(input: PreTxExecuteInput): void {
        const logPrefix = "preTxExecute";
        sys.log(`|||-${logPrefix}$$== -----------------------`)

        this.checkCtxPermission(
            logPrefix,
            [
                "aspect.version",
                "tx.chainId",
                "msg.from",
                "msg.to",
                "msg.value",
                "msg.gas",
                "msg.input",
                "msg.index",
                "msg.result.ret",
                "msg.result.gasUsed",
                "msg.result.error",
                "receipt.status",
                "receipt.logs",
                "receipt.gasUsed",
                "receipt.cumulativeGasUsed",
                "receipt.bloom",
            ]
        )
    }

    /**
     * All clear
     * @param input 
     */
    postTxExecute(input: PostTxExecuteInput): void {
        const logPrefix = "postTxExecute";
        sys.log(`|||-${logPrefix}$$== -----------------------`)

        this.checkCtxPermission(
            logPrefix,
            [
                "tx.chainId",
                "msg.from",
                "msg.to",
                "msg.value",
                "msg.gas",
                "msg.input",
                "msg.index",
                "msg.result.ret",
                "msg.result.gasUsed",
                "msg.result.error",
                "receipt.bloom",
            ]
        )
    }

    /**
     * All clear
     * @param input 
     */
    postContractCall(input: PostContractCallInput): void {
        const logPrefix = "postContractCall";
        sys.log(`|||-${logPrefix}$$== -----------------------`)

        this.checkCtxPermission(
            logPrefix,
            [
                "tx.chainId",
                "msg.from",
                "msg.to",
                "msg.value",
                "msg.gas",
                "msg.input",
                "msg.index",
                "msg.result.ret",
                "msg.result.gasUsed",
                "msg.result.error",
                "receipt.status",
                "receipt.logs",
                "receipt.gasUsed",
                "receipt.cumulativeGasUsed",
                "receipt.bloom",
            ]
        )
    }

    /**
     * All clear
     * @param input 
     */
    preContractCall(input: PreContractCallInput): void {
        const logPrefix = "preContractCall";
        sys.log(`|||-${logPrefix}$$== -----------------------`)

        this.checkCtxPermission(
            logPrefix,
            [
                "tx.chainId",
                "msg.index",
                "msg.result.ret",
                "msg.result.gasUsed",
                "msg.result.error",
                "receipt.status",
                "receipt.logs",
                "receipt.gasUsed",
                "receipt.cumulativeGasUsed",
                "receipt.bloom",
            ]
        )
    }


}

// 2.register aspect Instance
const aspect = new ContextPermissionCheck()
entryPoint.setAspect(aspect)

// 3.must export it
export { allocate, execute };
