import {
    allocate,
    BoolData,
    BytesData,
    entryPoint,
    EthAccessList,
    EthAccessTuple,
    EthLog,
    EthLogs,
    execute, IAspectOperation,
    IntArrayData,
    IntData,
    IPostContractCallJP,
    IPostTxExecuteJP,
    IPreContractCallJP,
    IPreTxExecuteJP,
    ITransactionVerifier, OperationInput,
    PostContractCallInput,
    PostTxExecuteInput,
    PreContractCallInput,
    PreTxExecuteInput,
    StringArrayData,
    StringData, stringToUint8Array,
    sys,
    TxVerifyInput,
    uint8ArrayToHex,
    UintData
} from "@artela/aspect-libs";
import {Protobuf} from "as-proto/assembly";

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

/**
 *
 * @param allKeys
 * @param keyList
 * @param skipKey
 * @param point
 */
function checkAllKeys(allKeys: Map<string, CtxType>, keyList: Set<string>, point: string): void {
    const logPrefix: string = "|||" + point
    const keys = allKeys.keys()
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        const has = keyList.has(key)
        if (has) {
            // skip hash keys
            continue
        }
        let nextKey = "";
        if (i + 1 < keys.length) {
            nextKey = keys[i + 1];
        }
        let ctx = "";
        const val = allKeys.has(key) ? allKeys.get(key) : null // OK
        if (!val) {
            continue
        }

        sys.log(logPrefix + i.toString() + " get key: " + key + ", next key: " + nextKey)
        ctx = getContext(val, key);
        sys.log(logPrefix + i.toString() + " get key: " + key + ", result: " + ctx)
    }
}

function getContext(valType: CtxType, key: string): string {
    const rawValue = sys.hostApi.runtimeContext.get(key)
    if (!(rawValue && (rawValue.length > 0))) {
        sys.log("||| failed to get '" + key + "'")
        return ""
    }
    let realValue: string
    switch (valType) {
        case CtxType.BoolData:
            realValue = Protobuf.decode<BoolData>(rawValue, BoolData.decode).data.toString()
            break
        case CtxType.BytesData:
            if (rawValue.length > 0) {
                var bytesData = Protobuf.decode<BytesData>(rawValue, BytesData.decode);
                if (bytesData.data) {
                    realValue = uint8ArrayToHex(bytesData.data);
                    break
                }
            }
            realValue = "";
            break
        case CtxType.UintData:
            realValue = Protobuf.decode<UintData>(rawValue, UintData.decode).data.toString(10)
            break
        case CtxType.IntData:
            realValue = Protobuf.decode<IntData>(rawValue, IntData.decode).data.toString(10)
            break
        case CtxType.IntArrayData:
            const intAres = Protobuf.decode<IntArrayData>(rawValue, IntArrayData.decode).data;
            realValue = `[${intAres.map((v: i64) => v.toString(10)).join(', ')}]`
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

function newAllKeys(): Map<string, CtxType> {
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

    // All join points can't access.
    ck.set("tx.chainId", CtxType.BytesData)

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

class ContextPermissionCheck implements IAspectOperation, IPostTxExecuteJP, IPreTxExecuteJP, IPostContractCallJP, IPreContractCallJP, ITransactionVerifier {

    isOwner(sender: Uint8Array): bool {
        const value = sys.aspect.property.get<Uint8Array>("owner");
        return uint8ArrayToHex(value).includes(uint8ArrayToHex(sender));
    }

    operation(input: OperationInput): Uint8Array {
        const logPrefix = "operation";
        const skipKey = new Set<string>()
        skipKey.add("msg.from");
        skipKey.add("msg.to");
        skipKey.add("msg.value");
        skipKey.add("msg.gas");
        skipKey.add("msg.input");
        skipKey.add("msg.index");
        skipKey.add("msg.result.ret");
        skipKey.add("msg.result.gasUsed");
        skipKey.add("msg.result.error");
        skipKey.add("receipt.status");
        skipKey.add("receipt.logs");
        skipKey.add("receipt.gasUsed");
        skipKey.add("receipt.cumulativeGasUsed");
        skipKey.add("receipt.bloom");
        checkAllKeys(newAllKeys(), skipKey, logPrefix);
        sys.log("||| operation end-------")
        return stringToUint8Array('test');
    }

    /**
     * All clear
     * @param input
     * @returns
     */
    verifyTx(input: TxVerifyInput): Uint8Array {

        const logPrefix = "verifyTx";
        const skipKey = new Set<string>()
        skipKey.add("block.header.parentHash");
        skipKey.add("block.header.miner");
        skipKey.add("block.header.transactionsRoot");
        skipKey.add("block.header.timestamp");
        skipKey.add("tx.chainId");
        skipKey.add("tx.bytes");
        skipKey.add("tx.hash");

        skipKey.add("tx.sig.v");
        skipKey.add("tx.sig.r");
        skipKey.add("tx.sig.s");
        skipKey.add("tx.from");
        skipKey.add("tx.index");
        skipKey.add("msg.from");
        skipKey.add("msg.to");
        skipKey.add("msg.value");
        skipKey.add("msg.gas");
        skipKey.add("msg.input");
        skipKey.add("msg.index");
        skipKey.add("msg.result.ret");
        skipKey.add("msg.result.gasUsed");
        skipKey.add("msg.result.error");
        skipKey.add("receipt.status");
        skipKey.add("receipt.logs");
        skipKey.add("receipt.gasUsed");
        skipKey.add("receipt.cumulativeGasUsed");
        skipKey.add("receipt.bloom");
        checkAllKeys(newAllKeys(), skipKey, logPrefix);
        return input.tx!.to;
    }


    /**
     * All clear
     * @param input
     */
    preTxExecute(input: PreTxExecuteInput): void {
        const logPrefix = "preTxExecute";
        const skipKey = new Set<string>()
        skipKey.add("msg.from");
        skipKey.add("msg.to");
        skipKey.add("msg.value");
        skipKey.add("msg.gas");
        skipKey.add("msg.input");
        skipKey.add("msg.index");
        skipKey.add("msg.result.ret");
        skipKey.add("msg.result.gasUsed");
        skipKey.add("msg.result.error");
        skipKey.add("receipt.status");
        skipKey.add("receipt.logs");
        skipKey.add("receipt.gasUsed");
        skipKey.add("receipt.cumulativeGasUsed");
        skipKey.add("receipt.bloom");

        checkAllKeys(newAllKeys(), skipKey, logPrefix);

    }

    /**
     * All clear
     * @param input
     */
    postTxExecute(input: PostTxExecuteInput): void {

        const logPrefix = "postTxExecute";
        const skipKey = new Set<string>()
        skipKey.add("msg.from");
        skipKey.add("msg.to");
        skipKey.add("msg.value");
        skipKey.add("msg.gas");
        skipKey.add("msg.input");
        skipKey.add("msg.index");
        skipKey.add("msg.result.ret");
        skipKey.add("msg.result.gasUsed");
        skipKey.add("msg.result.error");
        checkAllKeys(newAllKeys(), skipKey, logPrefix);
    }

    /**
     * All clear
     * @param input
     */
    postContractCall(input: PostContractCallInput): void {

        const logPrefix = "postContractCall";
        const skipKey = new Set<string>()
        skipKey.add("receipt.status");
        skipKey.add("receipt.logs");
        skipKey.add("receipt.gasUsed");
        skipKey.add("receipt.cumulativeGasUsed");
        skipKey.add("receipt.bloom");

        checkAllKeys(newAllKeys(), skipKey, logPrefix);
    }

    /**
     * All clear
     * @param input
     */
    preContractCall(input: PreContractCallInput): void {

        const logPrefix = "preContractCall";
        const skipKey = new Set<string>()

        skipKey.add("msg.result.ret");
        skipKey.add("msg.result.gasUsed");
        skipKey.add("msg.result.error");
        skipKey.add("receipt.status");
        skipKey.add("receipt.logs");
        skipKey.add("receipt.gasUsed");
        skipKey.add("receipt.cumulativeGasUsed");
        skipKey.add("receipt.bloom");

        checkAllKeys(newAllKeys(), skipKey, logPrefix);
    }


}

// 2.register aspect Instance
const aspect = new ContextPermissionCheck()
entryPoint.setAspect(aspect)
entryPoint.setOperationAspect(aspect)

// 3.must export it
export {allocate, execute};
