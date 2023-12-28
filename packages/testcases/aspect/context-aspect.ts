import {
    allocate,
    BoolData,
    BytesData,
    entryPoint,
    EthAccessList,
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
    stringToUint8Array,
    sys,
    TxVerifyInput,
    uint8ArrayToHex,
    UintData
} from "@artela/aspect-libs";
import {Protobuf} from "as-proto/assembly";

class ContextAspect implements IPostTxExecuteJP, IPreTxExecuteJP, IPostContractCallJP, IPreContractCallJP, ITransactionVerifier {
    verifyTx(input: TxVerifyInput): Uint8Array {
        const logPrefix = "|||-verifyTx==";
        sys.log(logPrefix + " -----------------------")

        const isCall = sys.hostApi.runtimeContext.get("isCall");
        const isCallData = Protobuf.decode<BoolData>(isCall, BoolData.decode);
        sys.log(logPrefix + " " + "is call" + " " + isCallData.data.toString())


        const number = sys.hostApi.runtimeContext.get("block.header.number");
        const numberData = Protobuf.decode<UintData>(number, UintData.decode);
        sys.log(logPrefix + " " + "block.header.number" + " " + numberData.data.toString(10))


        const extraEIPs = sys.hostApi.runtimeContext.get("env.extraEIPs");
        const extraEIPsData = Protobuf.decode<IntArrayData>(extraEIPs, IntArrayData.decode);
        for (let i = 0; i < extraEIPsData.data.length; i++) {
            sys.log(logPrefix + " " + "env.extraEIPs " + i.toString(10) + " " + extraEIPsData.data[i].toString(10));
        }
        const enableCreate = sys.hostApi.runtimeContext.get("env.enableCreate");
        const enableCreateData = Protobuf.decode<BoolData>(enableCreate, BoolData.decode);
        sys.log(logPrefix + " " + "env.enableCreate" + " " + enableCreateData.data.toString())

        const enableCall = sys.hostApi.runtimeContext.get("env.enableCall");
        const enableCallData = Protobuf.decode<BoolData>(enableCall, BoolData.decode);
        sys.log(logPrefix + " " + "env.enableCall" + " " + enableCallData.data.toString())

        const allowUnprotectedTxs = sys.hostApi.runtimeContext.get("env.allowUnprotectedTxs");
        const allowUnprotectedTxsData = Protobuf.decode<BoolData>(allowUnprotectedTxs, BoolData.decode);
        sys.log(logPrefix + " " + "env.allowUnprotectedTxs" + " " + allowUnprotectedTxsData.data.toString())

        const chainId = sys.hostApi.runtimeContext.get("env.chain.chainId");
        const chainIdData = Protobuf.decode<UintData>(chainId, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.chainId" + " " + chainIdData.data.toString(10))

        const homesteadBlock = sys.hostApi.runtimeContext.get("env.chain.homesteadBlock");
        const homesteadBlockData = Protobuf.decode<UintData>(homesteadBlock, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.homesteadBlock" + " " + homesteadBlockData.data.toString(10))


        const daoForkBlock = sys.hostApi.runtimeContext.get("env.chain.daoForkBlock");
        const daoForkBlockData = Protobuf.decode<UintData>(daoForkBlock, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.daoForkBlock" + " " + daoForkBlockData.data.toString(10))

        const daoForkSupport = sys.hostApi.runtimeContext.get("env.chain.daoForkSupport");
        const daoForkSupportData = Protobuf.decode<BoolData>(daoForkSupport, BoolData.decode);
        sys.log(logPrefix + " " + "env.chain.daoForkSupport" + " " + daoForkSupportData.data.toString())

        const eip150Block = sys.hostApi.runtimeContext.get("env.chain.eip150Block");
        const eip150BlockData = Protobuf.decode<UintData>(eip150Block, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.eip150Block" + " " + eip150BlockData.data.toString(10))

        const eip155Block = sys.hostApi.runtimeContext.get("env.chain.eip155Block");
        const eip155BlockData = Protobuf.decode<UintData>(eip155Block, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.eip155Block" + " " + eip155BlockData.data.toString(10))

        const eip158Block = sys.hostApi.runtimeContext.get("env.chain.eip158Block");
        const eip158BlockData = Protobuf.decode<UintData>(eip158Block, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.eip158Block" + " " + eip158BlockData.data.toString(10))

        const byzantiumBlock = sys.hostApi.runtimeContext.get("env.chain.byzantiumBlock");
        const byzantiumBlockData = Protobuf.decode<UintData>(byzantiumBlock, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.byzantiumBlock" + " " + byzantiumBlockData.data.toString(10))

        const constantinopleBlock = sys.hostApi.runtimeContext.get("env.chain.constantinopleBlock");
        const constantinopleBlockData = Protobuf.decode<UintData>(constantinopleBlock, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.constantinopleBlock" + " " + constantinopleBlockData.data.toString(10))

        const petersburgBlock = sys.hostApi.runtimeContext.get("env.chain.petersburgBlock");
        const petersburgBlockData = Protobuf.decode<UintData>(petersburgBlock, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.petersburgBlock" + " " + petersburgBlockData.data.toString(10))

        const istanbulBlock = sys.hostApi.runtimeContext.get("env.chain.istanbulBlock");
        const istanbulBlockData = Protobuf.decode<UintData>(istanbulBlock, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.istanbulBlock" + " " + istanbulBlockData.data.toString(10))

        const muirGlacierBlock = sys.hostApi.runtimeContext.get("env.chain.muirGlacierBlock");
        const muirGlacierBlockData = Protobuf.decode<UintData>(muirGlacierBlock, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.muirGlacierBlock" + " " + muirGlacierBlockData.data.toString(10))

        const berlinBlock = sys.hostApi.runtimeContext.get("env.chain.berlinBlock");
        const berlinBlockData = Protobuf.decode<UintData>(berlinBlock, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.berlinBlock" + " " + berlinBlockData.data.toString(10))


        const londonBlock = sys.hostApi.runtimeContext.get("env.chain.londonBlock");
        const londonBlockData = Protobuf.decode<UintData>(londonBlock, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.londonBlock" + " " + londonBlockData.data.toString(10))

        const arrowGlacierBlock = sys.hostApi.runtimeContext.get("env.chain.arrowGlacierBlock");
        const arrowGlacierBlockData = Protobuf.decode<UintData>(arrowGlacierBlock, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.arrowGlacierBlock" + " " + arrowGlacierBlockData.data.toString(10))

        const grayGlacierBlock = sys.hostApi.runtimeContext.get("env.chain.grayGlacierBlock");
        const grayGlacierBlockData = Protobuf.decode<UintData>(grayGlacierBlock, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.grayGlacierBlock" + " " + grayGlacierBlockData.data.toString(10))

        const mergeNetSplitBlock = sys.hostApi.runtimeContext.get("env.chain.mergeNetSplitBlock");
        const mergeNetSplitBlockData = Protobuf.decode<UintData>(mergeNetSplitBlock, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.mergeNetSplitBlock" + " " + mergeNetSplitBlockData.data.toString(10))

        const cancunTime = sys.hostApi.runtimeContext.get("env.chain.cancunTime");
        const cancunTimeData = Protobuf.decode<UintData>(cancunTime, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.cancunTime" + " " + cancunTimeData.data.toString(10))

        const pragueTime = sys.hostApi.runtimeContext.get("env.chain.pragueTime");
        const pragueTimeData = Protobuf.decode<UintData>(pragueTime, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.pragueTime" + " " + pragueTimeData.data.toString(10))

        const shanghaiTime = sys.hostApi.runtimeContext.get("env.chain.shanghaiTime");
        const shanghaiTimeData = Protobuf.decode<UintData>(shanghaiTime, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.shanghaiTime" + " " + shanghaiTimeData.data.toString(10))


        const blockGas = sys.hostApi.runtimeContext.get("env.consensusParams.block.maxGas");
        const blockGasData = Protobuf.decode<IntData>(blockGas, IntData.decode);
        sys.log(logPrefix + " " + "env.consensusParams.block.maxGas" + " " + blockGasData.data.toString(10));

        const maxBytes = sys.hostApi.runtimeContext.get("env.consensusParams.block.maxBytes");
        const maxBytesData = Protobuf.decode<IntData>(maxBytes, IntData.decode);
        sys.log(logPrefix + " " + "env.consensusParams.block.maxBytes" + " " + maxBytesData.data.toString(10))

        const maxAgeDuration = sys.hostApi.runtimeContext.get("env.consensusParams.evidence.maxAgeDuration");
        const maxAgeDurationData = Protobuf.decode<IntData>(maxAgeDuration, IntData.decode);
        sys.log(logPrefix + " " + "env.consensusParams.evidence.maxAgeDuration" + " " + maxAgeDurationData.data.toString(10))

        const maxAgeNumBlocks = sys.hostApi.runtimeContext.get("env.consensusParams.evidence.maxAgeNumBlocks");
        const maxAgeNumBlocksData = Protobuf.decode<IntData>(maxAgeNumBlocks, IntData.decode);
        sys.log(logPrefix + " " + "env.consensusParams.evidence.maxAgeNumBlocks" + " " + maxAgeNumBlocksData.data.toString(10))

        const envMaxBytes = sys.hostApi.runtimeContext.get("env.consensusParams.evidence.maxBytes");
        const envMaxBytesData = Protobuf.decode<IntData>(envMaxBytes, IntData.decode);
        sys.log(logPrefix + " " + "env.consensusParams.evidence.maxBytes" + " " + envMaxBytesData.data.toString(10))

        const pubKeyTypes = sys.hostApi.runtimeContext.get("env.consensusParams.validator.pubKeyTypes");
        const pubKeyTypesData = Protobuf.decode<StringArrayData>(pubKeyTypes, StringArrayData.decode);
        sys.log(logPrefix + " " + "env.consensusParams.validator.pubKeyTypes" + " " + pubKeyTypesData.data.join(","))

        const appVersion = sys.hostApi.runtimeContext.get("env.consensusParams.appVersion");
        const appVersionData = Protobuf.decode<UintData>(appVersion, UintData.decode);
        sys.log(logPrefix + " " + "env.consensusParams.appVersion" + " " + appVersionData.data.toString(10))

        const txType = sys.hostApi.runtimeContext.get("tx.type");
        const txTypeData = Protobuf.decode<UintData>(txType, UintData.decode);
        sys.log(logPrefix + " " + "tx.type" + " " + txTypeData.data.toString(10))

        // const accessList = sys.hostApi.runtimeContext.get("tx.accessList");
        // const accessListData = Protobuf.decode<EthAccessList>(accessList, EthAccessList.decode);
        // for (let i = 0; i < accessListData.accessList.length; i++) {
        //     sys.log(logPrefix + " " + "tx.accessList" + " " + i.toString(10) + " " + uint8ArrayToHex(accessListData.accessList[i].address))
        // }

        const txNonce = sys.hostApi.runtimeContext.get("tx.nonce");
        const txNonceData = Protobuf.decode<UintData>(txNonce, UintData.decode);
        sys.log(logPrefix + " " + "tx.nonce" + " " + txNonceData.data.toString(10))

        const gasPrice = sys.hostApi.runtimeContext.get("tx.gasPrice");
        const gasPriceData = Protobuf.decode<BytesData>(gasPrice, BytesData.decode);
        sys.log(logPrefix + " " + "tx.gasPrice" + " " + uint8ArrayToHex(gasPriceData.data))

        const txGas = sys.hostApi.runtimeContext.get("tx.gas");
        const txGasData = Protobuf.decode<UintData>(txGas, UintData.decode);
        sys.log(logPrefix + " " + "tx.gas" + " " + txGasData.data.toString(10))

        const gasTipCap = sys.hostApi.runtimeContext.get("tx.gasTipCap");
        const gasTipCapData = Protobuf.decode<BytesData>(gasTipCap, BytesData.decode);
        sys.log(logPrefix + " " + "tx.gasTipCap" + " " + uint8ArrayToHex(gasTipCapData.data))

        const gasFeeCap = sys.hostApi.runtimeContext.get("tx.gasFeeCap");
        const gasFeeCapData = Protobuf.decode<BytesData>(gasFeeCap, BytesData.decode);
        sys.log(logPrefix + " " + "tx.gasFeeCap" + " " + uint8ArrayToHex(gasFeeCapData.data))

        const txTo = sys.hostApi.runtimeContext.get("tx.to");
        const txToData = Protobuf.decode<BytesData>(txTo, BytesData.decode);
        sys.log(logPrefix + " " + "tx.to" + " " + uint8ArrayToHex(txToData.data))

        const toValue = sys.hostApi.runtimeContext.get("tx.value");
        const toValueData = Protobuf.decode<BytesData>(toValue, BytesData.decode);
        sys.log(logPrefix + " " + "tx.value" + " " + uint8ArrayToHex(toValueData.data));

        const tx = sys.hostApi.runtimeContext.get("tx.data");
        const txData = Protobuf.decode<BytesData>(tx, BytesData.decode);
        sys.log(logPrefix + " " + "tx.data" + " " + uint8ArrayToHex(txData.data))

        const txBytes = sys.hostApi.runtimeContext.get("tx.bytes");
        const txBytesData = Protobuf.decode<BytesData>(txBytes, BytesData.decode);
        sys.log(logPrefix + " " + "tx.bytes" + " " + uint8ArrayToHex(txBytesData.data))

        const txHash = sys.hostApi.runtimeContext.get("tx.hash");
        const txHashData = Protobuf.decode<BytesData>(txHash, BytesData.decode);
        sys.log(logPrefix + " " + "tx.hash" + " " + uint8ArrayToHex(txHashData.data))

        const txUnBytes = sys.hostApi.runtimeContext.get("tx.unsigned.bytes");
        const txUnBytesData = Protobuf.decode<BytesData>(txUnBytes, BytesData.decode);
        sys.log(logPrefix + " " + "tx.unsigned.bytes" + " " + uint8ArrayToHex(txUnBytesData.data))

        const txUnHash = sys.hostApi.runtimeContext.get("tx.unsigned.hash");
        const txUnHashData = Protobuf.decode<BytesData>(txUnHash, BytesData.decode);
        sys.log(logPrefix + " " + "env.chain.berlinBlock" + " " + uint8ArrayToHex(txUnHashData.data))


        const aspectId = sys.hostApi.runtimeContext.get("aspect.id");
        const aspectIdData = Protobuf.decode<BytesData>(aspectId, BytesData.decode);
        sys.log(logPrefix + " " + "aspect.id" + " " + uint8ArrayToHex(aspectIdData.data))

        const aspectVer = sys.hostApi.runtimeContext.get("aspect.version");
        const aspectVerData = Protobuf.decode<UintData>(aspectVer, UintData.decode);
        sys.log(logPrefix + " " + "aspect.version" + " " + aspectVerData.data.toString(10))


        return stringToUint8Array("test log")
    }


    isOwner(sender: Uint8Array): bool {
        const value = sys.aspect.property.get<Uint8Array>("owner");
        return uint8ArrayToHex(value).includes(uint8ArrayToHex(sender));
    }

    /**
     * IsCall,
     *
     *    BlockHeaderParentHash,
     *    BlockHeaderMiner,
     *    BlockHeaderTransactionsRoot,
     *    BlockHeaderNumber,
     *    BlockHeaderTimestamp,
     *
     *    EnvExtraEIPs,
     *    EnvEnableCreate,
     *    EnvEnableCall,
     *    EnvAllowUnprotectedTxs,
     *    EnvChainChainId,
     *    EnvChainHomesteadBlock,
     *    EnvChainDaoForkBlock,
     *    EnvChainDaoForkSupport,
     *    EnvChainEip150Block,
     *    EnvChainEip155Block,
     *    EnvChainEip158Block,
     *    EnvChainByzantiumBlock,
     *    EnvChainConstantinopleBlock,
     *    EnvChainPetersburgBlock,
     *    EnvChainIstanbulBlock,
     *    EnvChainMuirGlacierBlock,
     *    EnvChainBerlinBlock,
     *    EnvChainLondonBlock,
     *    EnvChainArrowGlacierBlock,
     *    EnvChainGrayGlacierBlock,
     *    EnvChainMergeNetSplitBlock,
     *    EnvChainShanghaiTime,
     *    EnvChainCancunTime,
     *    EnvChainPragueTime,
     *    EnvConsensusParamsBlockMaxGas,
     *    EnvConsensusParamsBlockMaxBytes,
     *    EnvConsensusParamsEvidenceMaxAgeDuration,
     *    EnvConsensusParamsEvidenceMaxAgeNumBlocks,
     *    EnvConsensusParamsEvidenceMaxBytes,
     *    EnvConsensusParamsValidatorPubKeyTypes,
     *    EnvConsensusParamsAppVersion,
     *
     *    TxType,
     *    TxChainId,
     *    TxAccessList,
     *    TxNonce,
     *    TxGasPrice,
     *    TxGas,
     *    TxGasTipCap,
     *    TxGasFeeCap,
     *    TxTo,
     *    TxValue,
     *    TxData,
     *    TxBytes,
     *    TxHash,
     *    TxUnsignedBytes,
     *    TxUnsignedHash,
     *    TxSigV,
     *    TxSigR,
     *    TxSigS,
     *    TxFrom,
     *    TxIndex,
     *
     *    AspectId,
     *    AspectVersion,
     * @param input
     */

    preTxExecute(input: PreTxExecuteInput): void {
        const logPrefix = "|||-PreTxExecute$$==";
        sys.log(logPrefix + " -----------------------")

        const isCall = sys.hostApi.runtimeContext.get("isCall");
        const isCallData = Protobuf.decode<BoolData>(isCall, BoolData.decode);
        sys.log(logPrefix + " " + "is call" + " " + isCallData.data.toString())

        const rawUnsignedHash = sys.hostApi.runtimeContext.get("block.header.parentHash");
        const unsignedHash = Protobuf.decode<BytesData>(rawUnsignedHash, BytesData.decode);
        sys.log(logPrefix + " " + "block.header.parentHash" + " " + uint8ArrayToHex(unsignedHash.data))

        const miner = sys.hostApi.runtimeContext.get("block.header.miner");
        const minerProto = Protobuf.decode<BytesData>(miner, BytesData.decode);
        sys.log(logPrefix + " " + "block.header.miner" + " " + uint8ArrayToHex(minerProto.data))

        const transactionsRoot = sys.hostApi.runtimeContext.get("block.header.transactionsRoot");
        const transactionsRootData = Protobuf.decode<BytesData>(transactionsRoot, BytesData.decode);
        sys.log(logPrefix + " " + "block.header.transactionsRoot" + " " + uint8ArrayToHex(transactionsRootData.data))

        const number = sys.hostApi.runtimeContext.get("block.header.number");
        const numberData = Protobuf.decode<UintData>(number, UintData.decode);
        sys.log(logPrefix + " " + "block.header.number" + " " + numberData.data.toString(10))

        const timestamp = sys.hostApi.runtimeContext.get("block.header.timestamp");
        const timestampData = Protobuf.decode<UintData>(timestamp, UintData.decode);
        sys.log(logPrefix + " " + "block.header.timestamp" + " " + timestampData.data.toString(10))


        const extraEIPs = sys.hostApi.runtimeContext.get("env.extraEIPs");
        const extraEIPsData = Protobuf.decode<IntArrayData>(extraEIPs, IntArrayData.decode);
        for (let i = 0; i < extraEIPsData.data.length; i++) {
            sys.log(logPrefix + " " + "env.extraEIPs " + i.toString(10) + " " + extraEIPsData.data[i].toString(10));
        }
        const enableCreate = sys.hostApi.runtimeContext.get("env.enableCreate");
        const enableCreateData = Protobuf.decode<BoolData>(enableCreate, BoolData.decode);
        sys.log(logPrefix + " " + "env.enableCreate" + " " + enableCreateData.data.toString())

        const enableCall = sys.hostApi.runtimeContext.get("env.enableCall");
        const enableCallData = Protobuf.decode<BoolData>(enableCall, BoolData.decode);
        sys.log(logPrefix + " " + "env.enableCall" + " " + enableCallData.data.toString())

        const allowUnprotectedTxs = sys.hostApi.runtimeContext.get("env.allowUnprotectedTxs");
        const allowUnprotectedTxsData = Protobuf.decode<BoolData>(allowUnprotectedTxs, BoolData.decode);
        sys.log(logPrefix + " " + "env.allowUnprotectedTxs" + " " + allowUnprotectedTxsData.data.toString())

        const chainId = sys.hostApi.runtimeContext.get("env.chain.chainId");
        const chainIdData = Protobuf.decode<UintData>(chainId, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.chainId" + " " + chainIdData.data.toString(10))

        const homesteadBlock = sys.hostApi.runtimeContext.get("env.chain.homesteadBlock");
        const homesteadBlockData = Protobuf.decode<UintData>(homesteadBlock, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.homesteadBlock" + " " + homesteadBlockData.data.toString(10))


        const daoForkBlock = sys.hostApi.runtimeContext.get("env.chain.daoForkBlock");
        const daoForkBlockData = Protobuf.decode<UintData>(daoForkBlock, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.daoForkBlock" + " " + daoForkBlockData.data.toString(10))

        const daoForkSupport = sys.hostApi.runtimeContext.get("env.chain.daoForkSupport");
        const daoForkSupportData = Protobuf.decode<BoolData>(daoForkSupport, BoolData.decode);
        sys.log(logPrefix + " " + "env.chain.daoForkSupport" + " " + daoForkSupportData.data.toString())

        const eip150Block = sys.hostApi.runtimeContext.get("env.chain.eip150Block");
        const eip150BlockData = Protobuf.decode<UintData>(eip150Block, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.eip150Block" + " " + eip150BlockData.data.toString(10))

        const eip155Block = sys.hostApi.runtimeContext.get("env.chain.eip155Block");
        const eip155BlockData = Protobuf.decode<UintData>(eip155Block, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.eip155Block" + " " + eip155BlockData.data.toString(10))

        const eip158Block = sys.hostApi.runtimeContext.get("env.chain.eip158Block");
        const eip158BlockData = Protobuf.decode<UintData>(eip158Block, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.eip158Block" + " " + eip158BlockData.data.toString(10))

        const byzantiumBlock = sys.hostApi.runtimeContext.get("env.chain.byzantiumBlock");
        const byzantiumBlockData = Protobuf.decode<UintData>(byzantiumBlock, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.byzantiumBlock" + " " + byzantiumBlockData.data.toString(10))

        const constantinopleBlock = sys.hostApi.runtimeContext.get("env.chain.constantinopleBlock");
        const constantinopleBlockData = Protobuf.decode<UintData>(constantinopleBlock, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.constantinopleBlock" + " " + constantinopleBlockData.data.toString(10))

        const petersburgBlock = sys.hostApi.runtimeContext.get("env.chain.petersburgBlock");
        const petersburgBlockData = Protobuf.decode<UintData>(petersburgBlock, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.petersburgBlock" + " " + petersburgBlockData.data.toString(10))

        const istanbulBlock = sys.hostApi.runtimeContext.get("env.chain.istanbulBlock");
        const istanbulBlockData = Protobuf.decode<UintData>(istanbulBlock, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.istanbulBlock" + " " + istanbulBlockData.data.toString(10))

        const muirGlacierBlock = sys.hostApi.runtimeContext.get("env.chain.muirGlacierBlock");
        const muirGlacierBlockData = Protobuf.decode<UintData>(muirGlacierBlock, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.muirGlacierBlock" + " " + muirGlacierBlockData.data.toString(10))

        const berlinBlock = sys.hostApi.runtimeContext.get("env.chain.berlinBlock");
        const berlinBlockData = Protobuf.decode<UintData>(berlinBlock, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.berlinBlock" + " " + berlinBlockData.data.toString(10))


        const londonBlock = sys.hostApi.runtimeContext.get("env.chain.londonBlock");
        const londonBlockData = Protobuf.decode<UintData>(londonBlock, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.londonBlock" + " " + londonBlockData.data.toString(10))

        const arrowGlacierBlock = sys.hostApi.runtimeContext.get("env.chain.arrowGlacierBlock");
        const arrowGlacierBlockData = Protobuf.decode<UintData>(arrowGlacierBlock, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.arrowGlacierBlock" + " " + arrowGlacierBlockData.data.toString(10))

        const grayGlacierBlock = sys.hostApi.runtimeContext.get("env.chain.grayGlacierBlock");
        const grayGlacierBlockData = Protobuf.decode<UintData>(grayGlacierBlock, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.grayGlacierBlock" + " " + grayGlacierBlockData.data.toString(10))

        const mergeNetSplitBlock = sys.hostApi.runtimeContext.get("env.chain.mergeNetSplitBlock");
        const mergeNetSplitBlockData = Protobuf.decode<UintData>(mergeNetSplitBlock, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.mergeNetSplitBlock" + " " + mergeNetSplitBlockData.data.toString(10))

        const cancunTime = sys.hostApi.runtimeContext.get("env.chain.cancunTime");
        const cancunTimeData = Protobuf.decode<UintData>(cancunTime, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.cancunTime" + " " + cancunTimeData.data.toString(10))

        const pragueTime = sys.hostApi.runtimeContext.get("env.chain.pragueTime");
        const pragueTimeData = Protobuf.decode<UintData>(pragueTime, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.pragueTime" + " " + pragueTimeData.data.toString(10))

        const shanghaiTime = sys.hostApi.runtimeContext.get("env.chain.shanghaiTime");
        const shanghaiTimeData = Protobuf.decode<UintData>(shanghaiTime, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.shanghaiTime" + " " + shanghaiTimeData.data.toString(10))


        const blockGas = sys.hostApi.runtimeContext.get("env.consensusParams.block.maxGas");
        const blockGasData = Protobuf.decode<IntData>(blockGas, IntData.decode);
        sys.log(logPrefix + " " + "env.consensusParams.block.maxGas" + " " + blockGasData.data.toString(10));

        const maxBytes = sys.hostApi.runtimeContext.get("env.consensusParams.block.maxBytes");
        const maxBytesData = Protobuf.decode<IntData>(maxBytes, IntData.decode);
        sys.log(logPrefix + " " + "env.consensusParams.block.maxBytes" + " " + maxBytesData.data.toString(10))

        const maxAgeDuration = sys.hostApi.runtimeContext.get("env.consensusParams.evidence.maxAgeDuration");
        const maxAgeDurationData = Protobuf.decode<IntData>(maxAgeDuration, IntData.decode);
        sys.log(logPrefix + " " + "env.consensusParams.evidence.maxAgeDuration" + " " + maxAgeDurationData.data.toString(10))

        const maxAgeNumBlocks = sys.hostApi.runtimeContext.get("env.consensusParams.evidence.maxAgeNumBlocks");
        const maxAgeNumBlocksData = Protobuf.decode<IntData>(maxAgeNumBlocks, IntData.decode);
        sys.log(logPrefix + " " + "env.consensusParams.evidence.maxAgeNumBlocks" + " " + maxAgeNumBlocksData.data.toString(10))

        const envMaxBytes = sys.hostApi.runtimeContext.get("env.consensusParams.evidence.maxBytes");
        const envMaxBytesData = Protobuf.decode<IntData>(envMaxBytes, IntData.decode);
        sys.log(logPrefix + " " + "env.consensusParams.evidence.maxBytes" + " " + envMaxBytesData.data.toString(10))

        const pubKeyTypes = sys.hostApi.runtimeContext.get("env.consensusParams.validator.pubKeyTypes");
        const pubKeyTypesData = Protobuf.decode<StringArrayData>(pubKeyTypes, StringArrayData.decode);
        sys.log(logPrefix + " " + "env.consensusParams.validator.pubKeyTypes" + " " + pubKeyTypesData.data.join(","))

        const appVersion = sys.hostApi.runtimeContext.get("env.consensusParams.appVersion");
        const appVersionData = Protobuf.decode<UintData>(appVersion, UintData.decode);
        sys.log(logPrefix + " " + "env.consensusParams.appVersion" + " " + appVersionData.data.toString(10))

        const txType = sys.hostApi.runtimeContext.get("tx.type");
        const txTypeData = Protobuf.decode<UintData>(txType, UintData.decode);
        sys.log(logPrefix + " " + "tx.type" + " " + txTypeData.data.toString(10))

        // const txChainId = sys.hostApi.runtimeContext.get("tx.chainId");
        // const txChainIdData = Protobuf.decode<UintData>(txChainId, UintData.decode);
        // sys.log(logPrefix + " " + "tx.chainId" + " " + txChainIdData.data.toString(10))

        const accessList = sys.hostApi.runtimeContext.get("tx.accessList");
        const accessListData = Protobuf.decode<EthAccessList>(accessList, EthAccessList.decode);
        for (let i = 0; i < accessListData.accessList.length; i++) {
            sys.log(logPrefix + " " + "tx.accessList" + " " + i.toString(10) + " " + uint8ArrayToHex(accessListData.accessList[i].address))
        }

        const txNonce = sys.hostApi.runtimeContext.get("tx.nonce");
        const txNonceData = Protobuf.decode<UintData>(txNonce, UintData.decode);
        sys.log(logPrefix + " " + "tx.nonce" + " " + txNonceData.data.toString(10))

        const gasPrice = sys.hostApi.runtimeContext.get("tx.gasPrice");
        const gasPriceData = Protobuf.decode<BytesData>(gasPrice, BytesData.decode);
        sys.log(logPrefix + " " + "tx.gasPrice" + " " + uint8ArrayToHex(gasPriceData.data))

        const txGas = sys.hostApi.runtimeContext.get("tx.gas");
        const txGasData = Protobuf.decode<UintData>(txGas, UintData.decode);
        sys.log(logPrefix + " " + "tx.gas" + " " + txGasData.data.toString(10))

        const gasTipCap = sys.hostApi.runtimeContext.get("tx.gasTipCap");
        const gasTipCapData = Protobuf.decode<BytesData>(gasTipCap, BytesData.decode);
        sys.log(logPrefix + " " + "tx.gasTipCap" + " " + uint8ArrayToHex(gasTipCapData.data))

        const gasFeeCap = sys.hostApi.runtimeContext.get("tx.gasFeeCap");
        const gasFeeCapData = Protobuf.decode<BytesData>(gasFeeCap, BytesData.decode);
        sys.log(logPrefix + " " + "tx.gasFeeCap" + " " + uint8ArrayToHex(gasFeeCapData.data))

        const txTo = sys.hostApi.runtimeContext.get("tx.to");
        const txToData = Protobuf.decode<BytesData>(txTo, BytesData.decode);
        sys.log(logPrefix + " " + "tx.to" + " " + uint8ArrayToHex(txToData.data))

        const toValue = sys.hostApi.runtimeContext.get("tx.value");
        const toValueData = Protobuf.decode<BytesData>(toValue, BytesData.decode);
        sys.log(logPrefix + " " + "tx.value" + " " + uint8ArrayToHex(toValueData.data));

        const tx = sys.hostApi.runtimeContext.get("tx.data");
        const txData = Protobuf.decode<BytesData>(tx, BytesData.decode);
        sys.log(logPrefix + " " + "tx.data" + " " + uint8ArrayToHex(txData.data))

        const txBytes = sys.hostApi.runtimeContext.get("tx.bytes");
        const txBytesData = Protobuf.decode<BytesData>(txBytes, BytesData.decode);
        sys.log(logPrefix + " " + "tx.bytes" + " " + uint8ArrayToHex(txBytesData.data))

        const txHash = sys.hostApi.runtimeContext.get("tx.hash");
        const txHashData = Protobuf.decode<BytesData>(txHash, BytesData.decode);
        sys.log(logPrefix + " " + "tx.hash" + " " + uint8ArrayToHex(txHashData.data))

        const txUnBytes = sys.hostApi.runtimeContext.get("tx.unsigned.bytes");
        const txUnBytesData = Protobuf.decode<BytesData>(txUnBytes, BytesData.decode);
        sys.log(logPrefix + " " + "tx.unsigned.bytes" + " " + uint8ArrayToHex(txUnBytesData.data))

        const txUnHash = sys.hostApi.runtimeContext.get("tx.unsigned.hash");
        const txUnHashData = Protobuf.decode<BytesData>(txUnHash, BytesData.decode);
        sys.log(logPrefix + " " + "env.chain.berlinBlock" + " " + uint8ArrayToHex(txUnHashData.data))

        const sigV = sys.hostApi.runtimeContext.get("tx.sig.v");
        const sigVData = Protobuf.decode<BytesData>(sigV, BytesData.decode);
        sys.log(logPrefix + " " + "env.chain.berlinBlock" + " " + uint8ArrayToHex(sigVData.data))

        const sigR = sys.hostApi.runtimeContext.get("tx.sig.r");
        const sigRData = Protobuf.decode<BytesData>(sigR, BytesData.decode);
        sys.log(logPrefix + " " + "tx.sig.r" + " " + uint8ArrayToHex(sigRData.data))

        const sigS = sys.hostApi.runtimeContext.get("tx.sig.s");
        const sigSData = Protobuf.decode<BytesData>(sigS, BytesData.decode);
        sys.log(logPrefix + " " + "tx.sig.s" + " " + uint8ArrayToHex(sigSData.data))

        const txFrom = sys.hostApi.runtimeContext.get("tx.from");
        const txFromData = Protobuf.decode<BytesData>(txFrom, BytesData.decode);
        sys.log(logPrefix + " " + "tx.from" + " " + uint8ArrayToHex(txFromData.data))

        const txIndex = sys.hostApi.runtimeContext.get("tx.index");
        const txIndexData = Protobuf.decode<UintData>(txIndex, UintData.decode);
        sys.log(logPrefix + " " + "tx.index" + " " + txIndexData.data.toString(10))

        const aspectId = sys.hostApi.runtimeContext.get("aspect.id");
        const aspectIdData = Protobuf.decode<BytesData>(aspectId, BytesData.decode);
        sys.log(logPrefix + " " + "aspect.id" + " " + uint8ArrayToHex(aspectIdData.data))

        const aspectVer = sys.hostApi.runtimeContext.get("aspect.version");
        const aspectVerData = Protobuf.decode<UintData>(aspectVer, UintData.decode);
        sys.log(logPrefix + " " + "aspect.version" + " " + aspectVerData.data.toString(10))

    }

    /**
     * IsCall,
     *
     *    BlockHeaderParentHash,
     *    BlockHeaderMiner,
     *    BlockHeaderTransactionsRoot,
     *    BlockHeaderNumber,
     *    BlockHeaderTimestamp,
     *
     *    EnvExtraEIPs,
     *    EnvEnableCreate,
     *    EnvEnableCall,
     *    EnvAllowUnprotectedTxs,
     *    EnvChainChainId,
     *    EnvChainHomesteadBlock,
     *    EnvChainDaoForkBlock,
     *    EnvChainDaoForkSupport,
     *    EnvChainEip150Block,
     *    EnvChainEip155Block,
     *    EnvChainEip158Block,
     *    EnvChainByzantiumBlock,
     *    EnvChainConstantinopleBlock,
     *    EnvChainPetersburgBlock,
     *    EnvChainIstanbulBlock,
     *    EnvChainMuirGlacierBlock,
     *    EnvChainBerlinBlock,
     *    EnvChainLondonBlock,
     *    EnvChainArrowGlacierBlock,
     *    EnvChainGrayGlacierBlock,
     *    EnvChainMergeNetSplitBlock,
     *    EnvChainShanghaiTime,
     *    EnvChainCancunTime,
     *    EnvChainPragueTime,
     *    EnvConsensusParamsBlockMaxGas,
     *    EnvConsensusParamsBlockMaxBytes,
     *    EnvConsensusParamsEvidenceMaxAgeDuration,
     *    EnvConsensusParamsEvidenceMaxAgeNumBlocks,
     *    EnvConsensusParamsEvidenceMaxBytes,
     *    EnvConsensusParamsValidatorPubKeyTypes,
     *    EnvConsensusParamsAppVersion,
     *
     *    TxType,
     *    TxChainId,
     *    TxAccessList,
     *    TxNonce,
     *    TxGasPrice,
     *    TxGas,
     *    TxGasTipCap,
     *    TxGasFeeCap,
     *    TxTo,
     *    TxValue,
     *    TxData,
     *    TxBytes,
     *    TxHash,
     *    TxUnsignedBytes,
     *    TxUnsignedHash,
     *    TxSigV,
     *    TxSigR,
     *    TxSigS,
     *    TxFrom,
     *    TxIndex,
     *
     *    AspectId,
     *    AspectVersion,
     *
     *    ReceiptStatus,
     *    ReceiptLogs,
     *    ReceiptGasUsed,
     *    ReceiptCumulativeGasUsed,
     *    ReceiptBloom,
     *
     * @param input
     */
    postTxExecute(input: PostTxExecuteInput): void {
        const logPrefix = "|||-postTxExecute$$==";
        sys.log(logPrefix + " -----------------------")


        const isCall = sys.hostApi.runtimeContext.get("isCall");
        const isCallData = Protobuf.decode<BoolData>(isCall, BoolData.decode);
        sys.log(logPrefix + " " + "is call" + " " + isCallData.data.toString())

        const rawUnsignedHash = sys.hostApi.runtimeContext.get("block.header.parentHash");
        const unsignedHash = Protobuf.decode<BytesData>(rawUnsignedHash, BytesData.decode);
        sys.log(logPrefix + " " + "block.header.parentHash" + " " + uint8ArrayToHex(unsignedHash.data))

        const miner = sys.hostApi.runtimeContext.get("block.header.miner");
        const minerProto = Protobuf.decode<BytesData>(miner, BytesData.decode);
        sys.log(logPrefix + " " + "block.header.miner" + " " + uint8ArrayToHex(minerProto.data))

        const transactionsRoot = sys.hostApi.runtimeContext.get("block.header.transactionsRoot");
        const transactionsRootData = Protobuf.decode<BytesData>(transactionsRoot, BytesData.decode);
        sys.log(logPrefix + " " + "block.header.transactionsRoot" + " " + uint8ArrayToHex(transactionsRootData.data))

        const number = sys.hostApi.runtimeContext.get("block.header.number");
        const numberData = Protobuf.decode<UintData>(number, UintData.decode);
        sys.log(logPrefix + " " + "block.header.number" + " " + numberData.data.toString(10))

        const timestamp = sys.hostApi.runtimeContext.get("block.header.timestamp");
        const timestampData = Protobuf.decode<UintData>(timestamp, UintData.decode);
        sys.log(logPrefix + " " + "block.header.timestamp" + " " + timestampData.data.toString(10))


        const extraEIPs = sys.hostApi.runtimeContext.get("env.extraEIPs");
        const extraEIPsData = Protobuf.decode<IntArrayData>(extraEIPs, IntArrayData.decode);
        for (let i = 0; i < extraEIPsData.data.length; i++) {
            sys.log(logPrefix + " " + "env.extraEIPs " + i.toString(10) + " " + extraEIPsData.data[i].toString(10));
        }
        const enableCreate = sys.hostApi.runtimeContext.get("env.enableCreate");
        const enableCreateData = Protobuf.decode<BoolData>(enableCreate, BoolData.decode);
        sys.log(logPrefix + " " + "env.enableCreate" + " " + enableCreateData.data.toString())

        const enableCall = sys.hostApi.runtimeContext.get("env.enableCall");
        const enableCallData = Protobuf.decode<BoolData>(enableCall, BoolData.decode);
        sys.log(logPrefix + " " + "env.enableCall" + " " + enableCallData.data.toString())

        const allowUnprotectedTxs = sys.hostApi.runtimeContext.get("env.allowUnprotectedTxs");
        const allowUnprotectedTxsData = Protobuf.decode<BoolData>(allowUnprotectedTxs, BoolData.decode);
        sys.log(logPrefix + " " + "env.allowUnprotectedTxs" + " " + allowUnprotectedTxsData.data.toString())

        const chainId = sys.hostApi.runtimeContext.get("env.chain.chainId");
        const chainIdData = Protobuf.decode<UintData>(chainId, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.chainId" + " " + chainIdData.data.toString(10))

        const homesteadBlock = sys.hostApi.runtimeContext.get("env.chain.homesteadBlock");
        const homesteadBlockData = Protobuf.decode<UintData>(homesteadBlock, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.homesteadBlock" + " " + homesteadBlockData.data.toString(10))


        const daoForkBlock = sys.hostApi.runtimeContext.get("env.chain.daoForkBlock");
        const daoForkBlockData = Protobuf.decode<UintData>(daoForkBlock, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.daoForkBlock" + " " + daoForkBlockData.data.toString(10))

        const daoForkSupport = sys.hostApi.runtimeContext.get("env.chain.daoForkSupport");
        const daoForkSupportData = Protobuf.decode<BoolData>(daoForkSupport, BoolData.decode);
        sys.log(logPrefix + " " + "env.chain.daoForkSupport" + " " + daoForkSupportData.data.toString())

        const eip150Block = sys.hostApi.runtimeContext.get("env.chain.eip150Block");
        const eip150BlockData = Protobuf.decode<UintData>(eip150Block, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.eip150Block" + " " + eip150BlockData.data.toString(10))

        const eip155Block = sys.hostApi.runtimeContext.get("env.chain.eip155Block");
        const eip155BlockData = Protobuf.decode<UintData>(eip155Block, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.eip155Block" + " " + eip155BlockData.data.toString(10))

        const eip158Block = sys.hostApi.runtimeContext.get("env.chain.eip158Block");
        const eip158BlockData = Protobuf.decode<UintData>(eip158Block, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.eip158Block" + " " + eip158BlockData.data.toString(10))

        const byzantiumBlock = sys.hostApi.runtimeContext.get("env.chain.byzantiumBlock");
        const byzantiumBlockData = Protobuf.decode<UintData>(byzantiumBlock, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.byzantiumBlock" + " " + byzantiumBlockData.data.toString(10))

        const constantinopleBlock = sys.hostApi.runtimeContext.get("env.chain.constantinopleBlock");
        const constantinopleBlockData = Protobuf.decode<UintData>(constantinopleBlock, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.constantinopleBlock" + " " + constantinopleBlockData.data.toString(10))

        const petersburgBlock = sys.hostApi.runtimeContext.get("env.chain.petersburgBlock");
        const petersburgBlockData = Protobuf.decode<UintData>(petersburgBlock, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.petersburgBlock" + " " + petersburgBlockData.data.toString(10))

        const istanbulBlock = sys.hostApi.runtimeContext.get("env.chain.istanbulBlock");
        const istanbulBlockData = Protobuf.decode<UintData>(istanbulBlock, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.istanbulBlock" + " " + istanbulBlockData.data.toString(10))

        const muirGlacierBlock = sys.hostApi.runtimeContext.get("env.chain.muirGlacierBlock");
        const muirGlacierBlockData = Protobuf.decode<UintData>(muirGlacierBlock, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.muirGlacierBlock" + " " + muirGlacierBlockData.data.toString(10))

        const berlinBlock = sys.hostApi.runtimeContext.get("env.chain.berlinBlock");
        const berlinBlockData = Protobuf.decode<UintData>(berlinBlock, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.berlinBlock" + " " + berlinBlockData.data.toString(10))


        const londonBlock = sys.hostApi.runtimeContext.get("env.chain.londonBlock");
        const londonBlockData = Protobuf.decode<UintData>(londonBlock, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.londonBlock" + " " + londonBlockData.data.toString(10))

        const arrowGlacierBlock = sys.hostApi.runtimeContext.get("env.chain.arrowGlacierBlock");
        const arrowGlacierBlockData = Protobuf.decode<UintData>(arrowGlacierBlock, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.arrowGlacierBlock" + " " + arrowGlacierBlockData.data.toString(10))

        const grayGlacierBlock = sys.hostApi.runtimeContext.get("env.chain.grayGlacierBlock");
        const grayGlacierBlockData = Protobuf.decode<UintData>(grayGlacierBlock, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.grayGlacierBlock" + " " + grayGlacierBlockData.data.toString(10))

        const mergeNetSplitBlock = sys.hostApi.runtimeContext.get("env.chain.mergeNetSplitBlock");
        const mergeNetSplitBlockData = Protobuf.decode<UintData>(mergeNetSplitBlock, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.mergeNetSplitBlock" + " " + mergeNetSplitBlockData.data.toString(10))


        const cancunTime = sys.hostApi.runtimeContext.get("env.chain.cancunTime");
        const cancunTimeData = Protobuf.decode<UintData>(cancunTime, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.cancunTime" + " " + cancunTimeData.data.toString(10))

        const pragueTime = sys.hostApi.runtimeContext.get("env.chain.pragueTime");
        const pragueTimeData = Protobuf.decode<UintData>(pragueTime, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.pragueTime" + " " + pragueTimeData.data.toString(10))

        const shanghaiTime = sys.hostApi.runtimeContext.get("env.chain.shanghaiTime");
        const shanghaiTimeData = Protobuf.decode<UintData>(shanghaiTime, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.shanghaiTime" + " " + shanghaiTimeData.data.toString(10))


        const blockGas = sys.hostApi.runtimeContext.get("env.consensusParams.block.maxGas");
        const blockGasData = Protobuf.decode<IntData>(blockGas, IntData.decode);
        sys.log(logPrefix + " " + "env.consensusParams.block.maxGas" + " " + blockGasData.data.toString(10));

        const maxBytes = sys.hostApi.runtimeContext.get("env.consensusParams.block.maxBytes");
        const maxBytesData = Protobuf.decode<IntData>(maxBytes, IntData.decode);
        sys.log(logPrefix + " " + "env.consensusParams.block.maxBytes" + " " + maxBytesData.data.toString(10))

        const maxAgeDuration = sys.hostApi.runtimeContext.get("env.consensusParams.evidence.maxAgeDuration");
        const maxAgeDurationData = Protobuf.decode<IntData>(maxAgeDuration, IntData.decode);
        sys.log(logPrefix + " " + "env.consensusParams.evidence.maxAgeDuration" + " " + maxAgeDurationData.data.toString(10))

        const maxAgeNumBlocks = sys.hostApi.runtimeContext.get("env.consensusParams.evidence.maxAgeNumBlocks");
        const maxAgeNumBlocksData = Protobuf.decode<IntData>(maxAgeNumBlocks, IntData.decode);
        sys.log(logPrefix + " " + "env.consensusParams.evidence.maxAgeNumBlocks" + " " + maxAgeNumBlocksData.data.toString(10))

        const envMaxBytes = sys.hostApi.runtimeContext.get("env.consensusParams.evidence.maxBytes");
        const envMaxBytesData = Protobuf.decode<IntData>(envMaxBytes, IntData.decode);
        sys.log(logPrefix + " " + "env.consensusParams.evidence.maxBytes" + " " + envMaxBytesData.data.toString(10))

        const pubKeyTypes = sys.hostApi.runtimeContext.get("env.consensusParams.validator.pubKeyTypes");
        const pubKeyTypesData = Protobuf.decode<StringArrayData>(pubKeyTypes, StringArrayData.decode);
        sys.log(logPrefix + " " + "env.consensusParams.validator.pubKeyTypes" + " " + pubKeyTypesData.data.join(","))

        const appVersion = sys.hostApi.runtimeContext.get("env.consensusParams.appVersion");
        const appVersionData = Protobuf.decode<UintData>(appVersion, UintData.decode);
        sys.log(logPrefix + " " + "env.consensusParams.appVersion" + " " + appVersionData.data.toString(10))

        const txType = sys.hostApi.runtimeContext.get("tx.type");
        const txTypeData = Protobuf.decode<UintData>(txType, UintData.decode);
        sys.log(logPrefix + " " + "tx.type" + " " + txTypeData.data.toString(10))

        // const txChainId = sys.hostApi.runtimeContext.get("tx.chainId");
        // const txChainIdData = Protobuf.decode<UintData>(txChainId, UintData.decode);
        // sys.log(logPrefix + " " + "tx.chainId" + " " + txChainIdData.data.toString(10))

        const accessList = sys.hostApi.runtimeContext.get("tx.accessList");
        const accessListData = Protobuf.decode<EthAccessList>(accessList, EthAccessList.decode);
        for (let i = 0; i < accessListData.accessList.length; i++) {
            sys.log(logPrefix + " " + "tx.accessList" + " " + i.toString(10) + " " + uint8ArrayToHex(accessListData.accessList[i].address))
        }

        const txNonce = sys.hostApi.runtimeContext.get("tx.nonce");
        const txNonceData = Protobuf.decode<UintData>(txNonce, UintData.decode);
        sys.log(logPrefix + " " + "tx.nonce" + " " + txNonceData.data.toString(10))

        const gasPrice = sys.hostApi.runtimeContext.get("tx.gasPrice");
        const gasPriceData = Protobuf.decode<BytesData>(gasPrice, BytesData.decode);
        sys.log(logPrefix + " " + "tx.gasPrice" + " " + uint8ArrayToHex(gasPriceData.data))

        const txGas = sys.hostApi.runtimeContext.get("tx.gas");
        const txGasData = Protobuf.decode<UintData>(txGas, UintData.decode);
        sys.log(logPrefix + " " + "tx.gas" + " " + txGasData.data.toString(10))

        const gasTipCap = sys.hostApi.runtimeContext.get("tx.gasTipCap");
        const gasTipCapData = Protobuf.decode<BytesData>(gasTipCap, BytesData.decode);
        sys.log(logPrefix + " " + "tx.gasTipCap" + " " + uint8ArrayToHex(gasTipCapData.data))

        const gasFeeCap = sys.hostApi.runtimeContext.get("tx.gasFeeCap");
        const gasFeeCapData = Protobuf.decode<BytesData>(gasFeeCap, BytesData.decode);
        sys.log(logPrefix + " " + "tx.gasFeeCap" + " " + uint8ArrayToHex(gasFeeCapData.data))

        const txTo = sys.hostApi.runtimeContext.get("tx.to");
        const txToData = Protobuf.decode<BytesData>(txTo, BytesData.decode);
        sys.log(logPrefix + " " + "tx.to" + " " + uint8ArrayToHex(txToData.data))

        const toValue = sys.hostApi.runtimeContext.get("tx.value");
        const toValueData = Protobuf.decode<BytesData>(toValue, BytesData.decode);
        sys.log(logPrefix + " " + "tx.value" + " " + uint8ArrayToHex(toValueData.data));

        const tx = sys.hostApi.runtimeContext.get("tx.data");
        const txData = Protobuf.decode<BytesData>(tx, BytesData.decode);
        sys.log(logPrefix + " " + "tx.data" + " " + uint8ArrayToHex(txData.data))

        const txBytes = sys.hostApi.runtimeContext.get("tx.bytes");
        const txBytesData = Protobuf.decode<BytesData>(txBytes, BytesData.decode);
        sys.log(logPrefix + " " + "tx.bytes" + " " + uint8ArrayToHex(txBytesData.data))

        const txHash = sys.hostApi.runtimeContext.get("tx.hash");
        const txHashData = Protobuf.decode<BytesData>(txHash, BytesData.decode);
        sys.log(logPrefix + " " + "tx.hash" + " " + uint8ArrayToHex(txHashData.data))

        const txUnBytes = sys.hostApi.runtimeContext.get("tx.unsigned.bytes");
        const txUnBytesData = Protobuf.decode<BytesData>(txUnBytes, BytesData.decode);
        sys.log(logPrefix + " " + "tx.unsigned.bytes" + " " + uint8ArrayToHex(txUnBytesData.data))

        const txUnHash = sys.hostApi.runtimeContext.get("tx.unsigned.hash");
        const txUnHashData = Protobuf.decode<BytesData>(txUnHash, BytesData.decode);
        sys.log(logPrefix + " " + "env.chain.berlinBlock" + " " + uint8ArrayToHex(txUnHashData.data))

        const sigV = sys.hostApi.runtimeContext.get("tx.sig.v");
        const sigVData = Protobuf.decode<BytesData>(sigV, BytesData.decode);
        sys.log(logPrefix + " " + "env.chain.berlinBlock" + " " + uint8ArrayToHex(sigVData.data))

        const sigR = sys.hostApi.runtimeContext.get("tx.sig.r");
        const sigRData = Protobuf.decode<BytesData>(sigR, BytesData.decode);
        sys.log(logPrefix + " " + "tx.sig.r" + " " + uint8ArrayToHex(sigRData.data))

        const sigS = sys.hostApi.runtimeContext.get("tx.sig.s");
        const sigSData = Protobuf.decode<BytesData>(sigS, BytesData.decode);
        sys.log(logPrefix + " " + "tx.sig.s" + " " + uint8ArrayToHex(sigSData.data))

        const txFrom = sys.hostApi.runtimeContext.get("tx.from");
        const txFromData = Protobuf.decode<BytesData>(txFrom, BytesData.decode);
        sys.log(logPrefix + " " + "tx.from" + " " + uint8ArrayToHex(txFromData.data))

        const txIndex = sys.hostApi.runtimeContext.get("tx.index");
        const txIndexData = Protobuf.decode<UintData>(txIndex, UintData.decode);
        sys.log(logPrefix + " " + "tx.index" + " " + txIndexData.data.toString(10))

        const aspectId = sys.hostApi.runtimeContext.get("aspect.id");
        const aspectIdData = Protobuf.decode<BytesData>(aspectId, BytesData.decode);
        sys.log(logPrefix + " " + "aspect.id" + " " + uint8ArrayToHex(aspectIdData.data))

        const aspectVer = sys.hostApi.runtimeContext.get("aspect.version");
        const aspectVerData = Protobuf.decode<UintData>(aspectVer, UintData.decode);
        sys.log(logPrefix + " " + "aspect.version" + " " + aspectVerData.data.toString(10))


        const status = sys.hostApi.runtimeContext.get("receipt.status");
        const statusData = Protobuf.decode<UintData>(status, UintData.decode);
        sys.log(logPrefix + " " + "receipt.status" + " " + statusData.data.toString(10))

        const logs = sys.hostApi.runtimeContext.get("receipt.logs");
        const logsData = Protobuf.decode<EthLogs>(logs, EthLogs.decode);
        for (let i = 0; i < logsData.logs.length; i++) {
            sys.log(logPrefix + " " + "receipt.logs " + i.toString(10) + " " + uint8ArrayToHex(logsData.logs[i].address) + " " + uint8ArrayToHex(logsData.logs[i].data))
        }

        const gasUsed = sys.hostApi.runtimeContext.get("receipt.gasUsed");
        const gasUsedData = Protobuf.decode<UintData>(gasUsed, UintData.decode);
        sys.log(logPrefix + " " + "receipt.gasUsed" + " " + gasUsedData.data.toString(10))

        const cumulativeGasUsed = sys.hostApi.runtimeContext.get("receipt.cumulativeGasUsed");
        const cumulativeGasUsedData = Protobuf.decode<UintData>(cumulativeGasUsed, UintData.decode);
        sys.log(logPrefix + " " + "receipt.cumulativeGasUsed" + " " + cumulativeGasUsedData.data.toString(10))

        const bloom = sys.hostApi.runtimeContext.get("receipt.bloom");
        const bloomData = Protobuf.decode<BytesData>(bloom, BytesData.decode);
        sys.log(logPrefix + " " + "receipt.bloom" + " " + uint8ArrayToHex(bloomData.data))
    }

    /**
     * IsCall,
     *
     *    BlockHeaderParentHash,
     *    BlockHeaderMiner,
     *    BlockHeaderTransactionsRoot,
     *    BlockHeaderNumber,
     *    BlockHeaderTimestamp,
     *
     *    EnvExtraEIPs,
     *    EnvEnableCreate,
     *    EnvEnableCall,
     *    EnvAllowUnprotectedTxs,
     *    EnvChainChainId,
     *    EnvChainHomesteadBlock,
     *    EnvChainDaoForkBlock,
     *    EnvChainDaoForkSupport,
     *    EnvChainEip150Block,
     *    EnvChainEip155Block,
     *    EnvChainEip158Block,
     *    EnvChainByzantiumBlock,
     *    EnvChainConstantinopleBlock,
     *    EnvChainPetersburgBlock,
     *    EnvChainIstanbulBlock,
     *    EnvChainMuirGlacierBlock,
     *    EnvChainBerlinBlock,
     *    EnvChainLondonBlock,
     *    EnvChainArrowGlacierBlock,
     *    EnvChainGrayGlacierBlock,
     *    EnvChainMergeNetSplitBlock,
     *    EnvChainShanghaiTime,
     *    EnvChainCancunTime,
     *    EnvChainPragueTime,
     *    EnvConsensusParamsBlockMaxGas,
     *    EnvConsensusParamsBlockMaxBytes,
     *    EnvConsensusParamsEvidenceMaxAgeDuration,
     *    EnvConsensusParamsEvidenceMaxAgeNumBlocks,
     *    EnvConsensusParamsEvidenceMaxBytes,
     *    EnvConsensusParamsValidatorPubKeyTypes,
     *    EnvConsensusParamsAppVersion,
     *
     *    TxType,
     *    TxChainId,
     *    TxAccessList,
     *    TxNonce,
     *    TxGasPrice,
     *    TxGas,
     *    TxGasTipCap,
     *    TxGasFeeCap,
     *    TxTo,
     *    TxValue,
     *    TxData,
     *    TxBytes,
     *    TxHash,
     *    TxUnsignedBytes,
     *    TxUnsignedHash,
     *    TxSigV,
     *    TxSigR,
     *    TxSigS,
     *    TxFrom,
     *    TxIndex,
     *
     *    AspectId,
     *    AspectVersion,
     *
     *    ReceiptStatus,
     *    ReceiptLogs,
     *    ReceiptGasUsed,
     *    ReceiptCumulativeGasUsed,
     *    ReceiptBloom,
     * @param input
     */
    postContractCall(input: PostContractCallInput): void {
        const logPrefix = "|||-postContractCall$$==";
        sys.log(logPrefix + " -----------------------")

        const isCall = sys.hostApi.runtimeContext.get("isCall");
        const isCallData = Protobuf.decode<BoolData>(isCall, BoolData.decode);
        sys.log(logPrefix + " " + "is call" + " " + isCallData.data.toString())


        const rawUnsignedHash = sys.hostApi.runtimeContext.get("block.header.parentHash");
        const unsignedHash = Protobuf.decode<BytesData>(rawUnsignedHash, BytesData.decode);
        sys.log(logPrefix + " " + "block.header.parentHash" + " " + uint8ArrayToHex(unsignedHash.data))

        const miner = sys.hostApi.runtimeContext.get("block.header.miner");
        const minerProto = Protobuf.decode<BytesData>(miner, BytesData.decode);
        sys.log(logPrefix + " " + "block.header.miner" + " " + uint8ArrayToHex(minerProto.data))

        const transactionsRoot = sys.hostApi.runtimeContext.get("block.header.transactionsRoot");
        const transactionsRootData = Protobuf.decode<BytesData>(transactionsRoot, BytesData.decode);
        sys.log(logPrefix + " " + "block.header.transactionsRoot" + " " + uint8ArrayToHex(transactionsRootData.data))


        const number = sys.hostApi.runtimeContext.get("block.header.number");
        const numberData = Protobuf.decode<UintData>(number, UintData.decode);
        sys.log(logPrefix + " " + "block.header.number" + " " + numberData.data.toString(10))

        const timestamp = sys.hostApi.runtimeContext.get("block.header.timestamp");
        const timestampData = Protobuf.decode<UintData>(timestamp, UintData.decode);
        sys.log(logPrefix + " " + "block.header.timestamp" + " " + timestampData.data.toString(10))


        const extraEIPs = sys.hostApi.runtimeContext.get("env.extraEIPs");
        const extraEIPsData = Protobuf.decode<IntArrayData>(extraEIPs, IntArrayData.decode);
        for (let i = 0; i < extraEIPsData.data.length; i++) {
            sys.log(logPrefix + " " + "env.extraEIPs " + i.toString(10) + " " + extraEIPsData.data[i].toString(10));
        }
        const enableCreate = sys.hostApi.runtimeContext.get("env.enableCreate");
        const enableCreateData = Protobuf.decode<BoolData>(enableCreate, BoolData.decode);
        sys.log(logPrefix + " " + "env.enableCreate" + " " + enableCreateData.data.toString())

        const enableCall = sys.hostApi.runtimeContext.get("env.enableCall");
        const enableCallData = Protobuf.decode<BoolData>(enableCall, BoolData.decode);
        sys.log(logPrefix + " " + "env.enableCall" + " " + enableCallData.data.toString())

        const allowUnprotectedTxs = sys.hostApi.runtimeContext.get("env.allowUnprotectedTxs");
        const allowUnprotectedTxsData = Protobuf.decode<BoolData>(allowUnprotectedTxs, BoolData.decode);
        sys.log(logPrefix + " " + "env.allowUnprotectedTxs" + " " + allowUnprotectedTxsData.data.toString())

        const chainId = sys.hostApi.runtimeContext.get("env.chain.chainId");
        const chainIdData = Protobuf.decode<UintData>(chainId, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.chainId" + " " + chainIdData.data.toString(10))

        const homesteadBlock = sys.hostApi.runtimeContext.get("env.chain.homesteadBlock");
        const homesteadBlockData = Protobuf.decode<UintData>(homesteadBlock, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.homesteadBlock" + " " + homesteadBlockData.data.toString(10))


        const daoForkBlock = sys.hostApi.runtimeContext.get("env.chain.daoForkBlock");
        const daoForkBlockData = Protobuf.decode<UintData>(daoForkBlock, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.daoForkBlock" + " " + daoForkBlockData.data.toString(10))

        const daoForkSupport = sys.hostApi.runtimeContext.get("env.chain.daoForkSupport");
        const daoForkSupportData = Protobuf.decode<BoolData>(daoForkSupport, BoolData.decode);
        sys.log(logPrefix + " " + "env.chain.daoForkSupport" + " " + daoForkSupportData.data.toString())

        const eip150Block = sys.hostApi.runtimeContext.get("env.chain.eip150Block");
        const eip150BlockData = Protobuf.decode<UintData>(eip150Block, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.eip150Block" + " " + eip150BlockData.data.toString(10))

        const eip155Block = sys.hostApi.runtimeContext.get("env.chain.eip155Block");
        const eip155BlockData = Protobuf.decode<UintData>(eip155Block, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.eip155Block" + " " + eip155BlockData.data.toString(10))

        const eip158Block = sys.hostApi.runtimeContext.get("env.chain.eip158Block");
        const eip158BlockData = Protobuf.decode<UintData>(eip158Block, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.eip158Block" + " " + eip158BlockData.data.toString(10))

        const byzantiumBlock = sys.hostApi.runtimeContext.get("env.chain.byzantiumBlock");
        const byzantiumBlockData = Protobuf.decode<UintData>(byzantiumBlock, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.byzantiumBlock" + " " + byzantiumBlockData.data.toString(10))

        const constantinopleBlock = sys.hostApi.runtimeContext.get("env.chain.constantinopleBlock");
        const constantinopleBlockData = Protobuf.decode<UintData>(constantinopleBlock, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.constantinopleBlock" + " " + constantinopleBlockData.data.toString(10))

        const petersburgBlock = sys.hostApi.runtimeContext.get("env.chain.petersburgBlock");
        const petersburgBlockData = Protobuf.decode<UintData>(petersburgBlock, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.petersburgBlock" + " " + petersburgBlockData.data.toString(10))

        const istanbulBlock = sys.hostApi.runtimeContext.get("env.chain.istanbulBlock");
        const istanbulBlockData = Protobuf.decode<UintData>(istanbulBlock, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.istanbulBlock" + " " + istanbulBlockData.data.toString(10))

        const muirGlacierBlock = sys.hostApi.runtimeContext.get("env.chain.muirGlacierBlock");
        const muirGlacierBlockData = Protobuf.decode<UintData>(muirGlacierBlock, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.muirGlacierBlock" + " " + muirGlacierBlockData.data.toString(10))

        const berlinBlock = sys.hostApi.runtimeContext.get("env.chain.berlinBlock");
        const berlinBlockData = Protobuf.decode<UintData>(berlinBlock, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.berlinBlock" + " " + berlinBlockData.data.toString(10))


        const londonBlock = sys.hostApi.runtimeContext.get("env.chain.londonBlock");
        const londonBlockData = Protobuf.decode<UintData>(londonBlock, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.londonBlock" + " " + londonBlockData.data.toString(10))

        const arrowGlacierBlock = sys.hostApi.runtimeContext.get("env.chain.arrowGlacierBlock");
        const arrowGlacierBlockData = Protobuf.decode<UintData>(arrowGlacierBlock, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.arrowGlacierBlock" + " " + arrowGlacierBlockData.data.toString(10))

        const grayGlacierBlock = sys.hostApi.runtimeContext.get("env.chain.grayGlacierBlock");
        const grayGlacierBlockData = Protobuf.decode<UintData>(grayGlacierBlock, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.grayGlacierBlock" + " " + grayGlacierBlockData.data.toString(10))

        const mergeNetSplitBlock = sys.hostApi.runtimeContext.get("env.chain.mergeNetSplitBlock");
        const mergeNetSplitBlockData = Protobuf.decode<UintData>(mergeNetSplitBlock, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.mergeNetSplitBlock" + " " + mergeNetSplitBlockData.data.toString(10))


        const cancunTime = sys.hostApi.runtimeContext.get("env.chain.cancunTime");
        const cancunTimeData = Protobuf.decode<UintData>(cancunTime, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.cancunTime" + " " + cancunTimeData.data.toString(10))

        const pragueTime = sys.hostApi.runtimeContext.get("env.chain.pragueTime");
        const pragueTimeData = Protobuf.decode<UintData>(pragueTime, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.pragueTime" + " " + pragueTimeData.data.toString(10))

        const shanghaiTime = sys.hostApi.runtimeContext.get("env.chain.shanghaiTime");
        const shanghaiTimeData = Protobuf.decode<UintData>(shanghaiTime, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.shanghaiTime" + " " + shanghaiTimeData.data.toString(10))


        const blockGas = sys.hostApi.runtimeContext.get("env.consensusParams.block.maxGas");
        const blockGasData = Protobuf.decode<IntData>(blockGas, IntData.decode);
        sys.log(logPrefix + " " + "env.consensusParams.block.maxGas" + " " + blockGasData.data.toString(10));

        const maxBytes = sys.hostApi.runtimeContext.get("env.consensusParams.block.maxBytes");
        const maxBytesData = Protobuf.decode<IntData>(maxBytes, IntData.decode);
        sys.log(logPrefix + " " + "env.consensusParams.block.maxBytes" + " " + maxBytesData.data.toString(10))

        const maxAgeDuration = sys.hostApi.runtimeContext.get("env.consensusParams.evidence.maxAgeDuration");
        const maxAgeDurationData = Protobuf.decode<IntData>(maxAgeDuration, IntData.decode);
        sys.log(logPrefix + " " + "env.consensusParams.evidence.maxAgeDuration" + " " + maxAgeDurationData.data.toString(10))

        const maxAgeNumBlocks = sys.hostApi.runtimeContext.get("env.consensusParams.evidence.maxAgeNumBlocks");
        const maxAgeNumBlocksData = Protobuf.decode<IntData>(maxAgeNumBlocks, IntData.decode);
        sys.log(logPrefix + " " + "env.consensusParams.evidence.maxAgeNumBlocks" + " " + maxAgeNumBlocksData.data.toString(10))

        const envMaxBytes = sys.hostApi.runtimeContext.get("env.consensusParams.evidence.maxBytes");
        const envMaxBytesData = Protobuf.decode<IntData>(envMaxBytes, IntData.decode);
        sys.log(logPrefix + " " + "env.consensusParams.evidence.maxBytes" + " " + envMaxBytesData.data.toString(10))

        const pubKeyTypes = sys.hostApi.runtimeContext.get("env.consensusParams.validator.pubKeyTypes");
        const pubKeyTypesData = Protobuf.decode<StringArrayData>(pubKeyTypes, StringArrayData.decode);
        sys.log(logPrefix + " " + "env.consensusParams.validator.pubKeyTypes" + " " + pubKeyTypesData.data.join(","))

        const appVersion = sys.hostApi.runtimeContext.get("env.consensusParams.appVersion");
        const appVersionData = Protobuf.decode<UintData>(appVersion, UintData.decode);
        sys.log(logPrefix + " " + "env.consensusParams.appVersion" + " " + appVersionData.data.toString(10))

        const txType = sys.hostApi.runtimeContext.get("tx.type");
        const txTypeData = Protobuf.decode<UintData>(txType, UintData.decode);
        sys.log(logPrefix + " " + "tx.type" + " " + txTypeData.data.toString(10))

        // const txChainId = sys.hostApi.runtimeContext.get("tx.chainId");
        // const txChainIdData = Protobuf.decode<UintData>(txChainId, UintData.decode);
        // sys.log(logPrefix + " " + "tx.chainId" + " " + txChainIdData.data.toString(10))

        const accessList = sys.hostApi.runtimeContext.get("tx.accessList");
        const accessListData = Protobuf.decode<EthAccessList>(accessList, EthAccessList.decode);
        for (let i = 0; i < accessListData.accessList.length; i++) {
            sys.log(logPrefix + " " + "tx.accessList" + " " + i.toString(10) + " " + uint8ArrayToHex(accessListData.accessList[i].address))
        }

        const txNonce = sys.hostApi.runtimeContext.get("tx.nonce");
        const txNonceData = Protobuf.decode<UintData>(txNonce, UintData.decode);
        sys.log(logPrefix + " " + "tx.nonce" + " " + txNonceData.data.toString(10))

        const gasPrice = sys.hostApi.runtimeContext.get("tx.gasPrice");
        const gasPriceData = Protobuf.decode<BytesData>(gasPrice, BytesData.decode);
        sys.log(logPrefix + " " + "tx.gasPrice" + " " + uint8ArrayToHex(gasPriceData.data))

        const txGas = sys.hostApi.runtimeContext.get("tx.gas");
        const txGasData = Protobuf.decode<UintData>(txGas, UintData.decode);
        sys.log(logPrefix + " " + "tx.gas" + " " + txGasData.data.toString(10))

        const gasTipCap = sys.hostApi.runtimeContext.get("tx.gasTipCap");
        const gasTipCapData = Protobuf.decode<BytesData>(gasTipCap, BytesData.decode);
        sys.log(logPrefix + " " + "tx.gasTipCap" + " " + uint8ArrayToHex(gasTipCapData.data))

        const gasFeeCap = sys.hostApi.runtimeContext.get("tx.gasFeeCap");
        const gasFeeCapData = Protobuf.decode<BytesData>(gasFeeCap, BytesData.decode);
        sys.log(logPrefix + " " + "tx.gasFeeCap" + " " + uint8ArrayToHex(gasFeeCapData.data))

        const txTo = sys.hostApi.runtimeContext.get("tx.to");
        const txToData = Protobuf.decode<BytesData>(txTo, BytesData.decode);
        sys.log(logPrefix + " " + "tx.to" + " " + uint8ArrayToHex(txToData.data))

        const toValue = sys.hostApi.runtimeContext.get("tx.value");
        const toValueData = Protobuf.decode<BytesData>(toValue, BytesData.decode);
        sys.log(logPrefix + " " + "tx.value" + " " + uint8ArrayToHex(toValueData.data));

        const tx = sys.hostApi.runtimeContext.get("tx.data");
        const txData = Protobuf.decode<BytesData>(tx, BytesData.decode);
        sys.log(logPrefix + " " + "tx.data" + " " + uint8ArrayToHex(txData.data))

        const txBytes = sys.hostApi.runtimeContext.get("tx.bytes");
        const txBytesData = Protobuf.decode<BytesData>(txBytes, BytesData.decode);
        sys.log(logPrefix + " " + "tx.bytes" + " " + uint8ArrayToHex(txBytesData.data))

        const txHash = sys.hostApi.runtimeContext.get("tx.hash");
        const txHashData = Protobuf.decode<BytesData>(txHash, BytesData.decode);
        sys.log(logPrefix + " " + "tx.hash" + " " + uint8ArrayToHex(txHashData.data))

        const txUnBytes = sys.hostApi.runtimeContext.get("tx.unsigned.bytes");
        const txUnBytesData = Protobuf.decode<BytesData>(txUnBytes, BytesData.decode);
        sys.log(logPrefix + " " + "tx.unsigned.bytes" + " " + uint8ArrayToHex(txUnBytesData.data))

        const txUnHash = sys.hostApi.runtimeContext.get("tx.unsigned.hash");
        const txUnHashData = Protobuf.decode<BytesData>(txUnHash, BytesData.decode);
        sys.log(logPrefix + " " + "env.chain.berlinBlock" + " " + uint8ArrayToHex(txUnHashData.data))

        const sigV = sys.hostApi.runtimeContext.get("tx.sig.v");
        const sigVData = Protobuf.decode<BytesData>(sigV, BytesData.decode);
        sys.log(logPrefix + " " + "env.chain.berlinBlock" + " " + uint8ArrayToHex(sigVData.data))

        const sigR = sys.hostApi.runtimeContext.get("tx.sig.r");
        const sigRData = Protobuf.decode<BytesData>(sigR, BytesData.decode);
        sys.log(logPrefix + " " + "tx.sig.r" + " " + uint8ArrayToHex(sigRData.data))

        const sigS = sys.hostApi.runtimeContext.get("tx.sig.s");
        const sigSData = Protobuf.decode<BytesData>(sigS, BytesData.decode);
        sys.log(logPrefix + " " + "tx.sig.s" + " " + uint8ArrayToHex(sigSData.data))

        const txFrom = sys.hostApi.runtimeContext.get("tx.from");
        const txFromData = Protobuf.decode<BytesData>(txFrom, BytesData.decode);
        sys.log(logPrefix + " " + "tx.from" + " " + uint8ArrayToHex(txFromData.data))

        const txIndex = sys.hostApi.runtimeContext.get("tx.index");
        const txIndexData = Protobuf.decode<UintData>(txIndex, UintData.decode);
        sys.log(logPrefix + " " + "tx.index" + " " + txIndexData.data.toString(10))

        const aspectId = sys.hostApi.runtimeContext.get("aspect.id");
        const aspectIdData = Protobuf.decode<BytesData>(aspectId, BytesData.decode);
        sys.log(logPrefix + " " + "aspect.id" + " " + uint8ArrayToHex(aspectIdData.data))

        const aspectVer = sys.hostApi.runtimeContext.get("aspect.version");
        const aspectVerData = Protobuf.decode<UintData>(aspectVer, UintData.decode);
        sys.log(logPrefix + " " + "aspect.version" + " " + aspectVerData.data.toString(10))

        // const status = sys.hostApi.runtimeContext.get("receipt.status");
        // const statusData = Protobuf.decode<UintData>(status, UintData.decode);
        // sys.log(logPrefix + " " + "receipt.status" + " " + statusData.data.toString(10))
        //
        // const logs = sys.hostApi.runtimeContext.get("receipt.logs");
        // const logsData = Protobuf.decode<EthLogs>(logs, EthLogs.decode);
        // for (let i = 0; i < logsData.logs.length; i++) {
        //     sys.log(logPrefix + " " + "receipt.logs " + i.toString(10) + " " + uint8ArrayToHex(logsData.logs[i].address) + " " + uint8ArrayToHex(logsData.logs[i].data))
        // }
        //
        // const gasUsed = sys.hostApi.runtimeContext.get("receipt.gasUsed");
        // const gasUsedData = Protobuf.decode<UintData>(gasUsed, UintData.decode);
        // sys.log(logPrefix + " " + "receipt.gasUsed" + " " + gasUsedData.data.toString(10))
        //
        // const cumulativeGasUsed = sys.hostApi.runtimeContext.get("receipt.cumulativeGasUsed");
        // const cumulativeGasUsedData = Protobuf.decode<UintData>(cumulativeGasUsed, UintData.decode);
        // sys.log(logPrefix + " " + "receipt.cumulativeGasUsed" + " " + cumulativeGasUsedData.data.toString(10))
        //
        // const bloom = sys.hostApi.runtimeContext.get("receipt.bloom");
        // const bloomData = Protobuf.decode<BytesData>(bloom, BytesData.decode);
        // sys.log(logPrefix + " " + "receipt.bloom" + " " + uint8ArrayToHex(bloomData.data))

    }

    /**
     * IsCall,
     *
     *    BlockHeaderParentHash,
     *    BlockHeaderMiner,
     *    BlockHeaderTransactionsRoot,
     *    BlockHeaderNumber,
     *    BlockHeaderTimestamp,
     *
     *    EnvExtraEIPs,
     *    EnvEnableCreate,
     *    EnvEnableCall,
     *    EnvAllowUnprotectedTxs,
     *    EnvChainChainId,
     *    EnvChainHomesteadBlock,
     *    EnvChainDaoForkBlock,
     *    EnvChainDaoForkSupport,
     *    EnvChainEip150Block,
     *    EnvChainEip155Block,
     *    EnvChainEip158Block,
     *    EnvChainByzantiumBlock,
     *    EnvChainConstantinopleBlock,
     *    EnvChainPetersburgBlock,
     *    EnvChainIstanbulBlock,
     *    EnvChainMuirGlacierBlock,
     *    EnvChainBerlinBlock,
     *    EnvChainLondonBlock,
     *    EnvChainArrowGlacierBlock,
     *    EnvChainGrayGlacierBlock,
     *    EnvChainMergeNetSplitBlock,
     *    EnvChainShanghaiTime,
     *    EnvChainCancunTime,
     *    EnvChainPragueTime,
     *    EnvConsensusParamsBlockMaxGas,
     *    EnvConsensusParamsBlockMaxBytes,
     *    EnvConsensusParamsEvidenceMaxAgeDuration,
     *    EnvConsensusParamsEvidenceMaxAgeNumBlocks,
     *    EnvConsensusParamsEvidenceMaxBytes,
     *    EnvConsensusParamsValidatorPubKeyTypes,
     *    EnvConsensusParamsAppVersion,
     *
     *    TxType,
     *    TxChainId,
     *    TxAccessList,
     *    TxNonce,
     *    TxGasPrice,
     *    TxGas,
     *    TxGasTipCap,
     *    TxGasFeeCap,
     *    TxTo,
     *    TxValue,
     *    TxData,
     *    TxBytes,
     *    TxHash,
     *    TxUnsignedBytes,
     *    TxUnsignedHash,
     *    TxSigV,
     *    TxSigR,
     *    TxSigS,
     *    TxFrom,
     *    TxIndex,
     *
     *    AspectId,
     *    AspectVersion,
     *
     *    MsgFrom,
     *    MsgTo,
     *    MsgValue,
     *    MsgGas,
     *    MsgInput,
     *    MsgIndex,
     * @param input
     */
    preContractCall(input: PreContractCallInput): void {
        const logPrefix = "|||-preContractCall$$==";
        sys.log(logPrefix + " -----------------------")


        const isCall = sys.hostApi.runtimeContext.get("isCall");
        const isCallData = Protobuf.decode<BoolData>(isCall, BoolData.decode);
        sys.log(logPrefix + " " + "is call" + " " + isCallData.data.toString())


        const rawUnsignedHash = sys.hostApi.runtimeContext.get("block.header.parentHash");
        const unsignedHash = Protobuf.decode<BytesData>(rawUnsignedHash, BytesData.decode);
        sys.log(logPrefix + " " + "block.header.parentHash" + " " + uint8ArrayToHex(unsignedHash.data))

        const miner = sys.hostApi.runtimeContext.get("block.header.miner");
        const minerProto = Protobuf.decode<BytesData>(miner, BytesData.decode);
        sys.log(logPrefix + " " + "block.header.miner" + " " + uint8ArrayToHex(minerProto.data))

        const transactionsRoot = sys.hostApi.runtimeContext.get("block.header.transactionsRoot");
        const transactionsRootData = Protobuf.decode<BytesData>(transactionsRoot, BytesData.decode);
        sys.log(logPrefix + " " + "block.header.transactionsRoot" + " " + uint8ArrayToHex(transactionsRootData.data))


        const number = sys.hostApi.runtimeContext.get("block.header.number");
        const numberData = Protobuf.decode<UintData>(number, UintData.decode);
        sys.log(logPrefix + " " + "block.header.number" + " " + numberData.data.toString(10))

        const timestamp = sys.hostApi.runtimeContext.get("block.header.timestamp");
        const timestampData = Protobuf.decode<UintData>(timestamp, UintData.decode);
        sys.log(logPrefix + " " + "block.header.timestamp" + " " + timestampData.data.toString(10))


        const extraEIPs = sys.hostApi.runtimeContext.get("env.extraEIPs");
        const extraEIPsData = Protobuf.decode<IntArrayData>(extraEIPs, IntArrayData.decode);
        for (let i = 0; i < extraEIPsData.data.length; i++) {
            sys.log(logPrefix + " " + "env.extraEIPs " + i.toString(10) + " " + extraEIPsData.data[i].toString(10));
        }
        const enableCreate = sys.hostApi.runtimeContext.get("env.enableCreate");
        const enableCreateData = Protobuf.decode<BoolData>(enableCreate, BoolData.decode);
        sys.log(logPrefix + " " + "env.enableCreate" + " " + enableCreateData.data.toString())

        const enableCall = sys.hostApi.runtimeContext.get("env.enableCall");
        const enableCallData = Protobuf.decode<BoolData>(enableCall, BoolData.decode);
        sys.log(logPrefix + " " + "env.enableCall" + " " + enableCallData.data.toString())

        const allowUnprotectedTxs = sys.hostApi.runtimeContext.get("env.allowUnprotectedTxs");
        const allowUnprotectedTxsData = Protobuf.decode<BoolData>(allowUnprotectedTxs, BoolData.decode);
        sys.log(logPrefix + " " + "env.allowUnprotectedTxs" + " " + allowUnprotectedTxsData.data.toString())

        const chainId = sys.hostApi.runtimeContext.get("env.chain.chainId");
        const chainIdData = Protobuf.decode<UintData>(chainId, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.chainId" + " " + chainIdData.data.toString(10))

        const homesteadBlock = sys.hostApi.runtimeContext.get("env.chain.homesteadBlock");
        const homesteadBlockData = Protobuf.decode<UintData>(homesteadBlock, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.homesteadBlock" + " " + homesteadBlockData.data.toString(10))


        const daoForkBlock = sys.hostApi.runtimeContext.get("env.chain.daoForkBlock");
        const daoForkBlockData = Protobuf.decode<UintData>(daoForkBlock, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.daoForkBlock" + " " + daoForkBlockData.data.toString(10))

        const daoForkSupport = sys.hostApi.runtimeContext.get("env.chain.daoForkSupport");
        const daoForkSupportData = Protobuf.decode<BoolData>(daoForkSupport, BoolData.decode);
        sys.log(logPrefix + " " + "env.chain.daoForkSupport" + " " + daoForkSupportData.data.toString())

        const eip150Block = sys.hostApi.runtimeContext.get("env.chain.eip150Block");
        const eip150BlockData = Protobuf.decode<UintData>(eip150Block, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.eip150Block" + " " + eip150BlockData.data.toString(10))

        const eip155Block = sys.hostApi.runtimeContext.get("env.chain.eip155Block");
        const eip155BlockData = Protobuf.decode<UintData>(eip155Block, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.eip155Block" + " " + eip155BlockData.data.toString(10))

        const eip158Block = sys.hostApi.runtimeContext.get("env.chain.eip158Block");
        const eip158BlockData = Protobuf.decode<UintData>(eip158Block, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.eip158Block" + " " + eip158BlockData.data.toString(10))

        const byzantiumBlock = sys.hostApi.runtimeContext.get("env.chain.byzantiumBlock");
        const byzantiumBlockData = Protobuf.decode<UintData>(byzantiumBlock, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.byzantiumBlock" + " " + byzantiumBlockData.data.toString(10))

        const constantinopleBlock = sys.hostApi.runtimeContext.get("env.chain.constantinopleBlock");
        const constantinopleBlockData = Protobuf.decode<UintData>(constantinopleBlock, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.constantinopleBlock" + " " + constantinopleBlockData.data.toString(10))

        const petersburgBlock = sys.hostApi.runtimeContext.get("env.chain.petersburgBlock");
        const petersburgBlockData = Protobuf.decode<UintData>(petersburgBlock, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.petersburgBlock" + " " + petersburgBlockData.data.toString(10))

        const istanbulBlock = sys.hostApi.runtimeContext.get("env.chain.istanbulBlock");
        const istanbulBlockData = Protobuf.decode<UintData>(istanbulBlock, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.istanbulBlock" + " " + istanbulBlockData.data.toString(10))

        const muirGlacierBlock = sys.hostApi.runtimeContext.get("env.chain.muirGlacierBlock");
        const muirGlacierBlockData = Protobuf.decode<UintData>(muirGlacierBlock, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.muirGlacierBlock" + " " + muirGlacierBlockData.data.toString(10))

        const berlinBlock = sys.hostApi.runtimeContext.get("env.chain.berlinBlock");
        const berlinBlockData = Protobuf.decode<UintData>(berlinBlock, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.berlinBlock" + " " + berlinBlockData.data.toString(10))


        const londonBlock = sys.hostApi.runtimeContext.get("env.chain.londonBlock");
        const londonBlockData = Protobuf.decode<UintData>(londonBlock, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.londonBlock" + " " + londonBlockData.data.toString(10))

        const arrowGlacierBlock = sys.hostApi.runtimeContext.get("env.chain.arrowGlacierBlock");
        const arrowGlacierBlockData = Protobuf.decode<UintData>(arrowGlacierBlock, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.arrowGlacierBlock" + " " + arrowGlacierBlockData.data.toString(10))

        const grayGlacierBlock = sys.hostApi.runtimeContext.get("env.chain.grayGlacierBlock");
        const grayGlacierBlockData = Protobuf.decode<UintData>(grayGlacierBlock, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.grayGlacierBlock" + " " + grayGlacierBlockData.data.toString(10))

        const mergeNetSplitBlock = sys.hostApi.runtimeContext.get("env.chain.mergeNetSplitBlock");
        const mergeNetSplitBlockData = Protobuf.decode<UintData>(mergeNetSplitBlock, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.mergeNetSplitBlock" + " " + mergeNetSplitBlockData.data.toString(10))


        const cancunTime = sys.hostApi.runtimeContext.get("env.chain.cancunTime");
        const cancunTimeData = Protobuf.decode<UintData>(cancunTime, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.cancunTime" + " " + cancunTimeData.data.toString(10))

        const pragueTime = sys.hostApi.runtimeContext.get("env.chain.pragueTime");
        const pragueTimeData = Protobuf.decode<UintData>(pragueTime, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.pragueTime" + " " + pragueTimeData.data.toString(10))

        const shanghaiTime = sys.hostApi.runtimeContext.get("env.chain.shanghaiTime");
        const shanghaiTimeData = Protobuf.decode<UintData>(shanghaiTime, UintData.decode);
        sys.log(logPrefix + " " + "env.chain.shanghaiTime" + " " + shanghaiTimeData.data.toString(10))


        const blockGas = sys.hostApi.runtimeContext.get("env.consensusParams.block.maxGas");
        const blockGasData = Protobuf.decode<IntData>(blockGas, IntData.decode);
        sys.log(logPrefix + " " + "env.consensusParams.block.maxGas" + " " + blockGasData.data.toString(10));

        const maxBytes = sys.hostApi.runtimeContext.get("env.consensusParams.block.maxBytes");
        const maxBytesData = Protobuf.decode<IntData>(maxBytes, IntData.decode);
        sys.log(logPrefix + " " + "env.consensusParams.block.maxBytes" + " " + maxBytesData.data.toString(10))

        const maxAgeDuration = sys.hostApi.runtimeContext.get("env.consensusParams.evidence.maxAgeDuration");
        const maxAgeDurationData = Protobuf.decode<IntData>(maxAgeDuration, IntData.decode);
        sys.log(logPrefix + " " + "env.consensusParams.evidence.maxAgeDuration" + " " + maxAgeDurationData.data.toString(10))

        const maxAgeNumBlocks = sys.hostApi.runtimeContext.get("env.consensusParams.evidence.maxAgeNumBlocks");
        const maxAgeNumBlocksData = Protobuf.decode<IntData>(maxAgeNumBlocks, IntData.decode);
        sys.log(logPrefix + " " + "env.consensusParams.evidence.maxAgeNumBlocks" + " " + maxAgeNumBlocksData.data.toString(10))

        const envMaxBytes = sys.hostApi.runtimeContext.get("env.consensusParams.evidence.maxBytes");
        const envMaxBytesData = Protobuf.decode<IntData>(envMaxBytes, IntData.decode);
        sys.log(logPrefix + " " + "env.consensusParams.evidence.maxBytes" + " " + envMaxBytesData.data.toString(10))

        const pubKeyTypes = sys.hostApi.runtimeContext.get("env.consensusParams.validator.pubKeyTypes");
        const pubKeyTypesData = Protobuf.decode<StringArrayData>(pubKeyTypes, StringArrayData.decode);
        sys.log(logPrefix + " " + "env.consensusParams.validator.pubKeyTypes" + " " + pubKeyTypesData.data.join(","))

        const appVersion = sys.hostApi.runtimeContext.get("env.consensusParams.appVersion");
        const appVersionData = Protobuf.decode<UintData>(appVersion, UintData.decode);
        sys.log(logPrefix + " " + "env.consensusParams.appVersion" + " " + appVersionData.data.toString(10))

        const txType = sys.hostApi.runtimeContext.get("tx.type");
        const txTypeData = Protobuf.decode<UintData>(txType, UintData.decode);
        sys.log(logPrefix + " " + "tx.type" + " " + txTypeData.data.toString(10))

        // const txChainId = sys.hostApi.runtimeContext.get("tx.chainId");
        // const txChainIdData = Protobuf.decode<UintData>(txChainId, UintData.decode);
        // sys.log(logPrefix + " " + "tx.chainId" + " " + txChainIdData.data.toString(10))

        const accessList = sys.hostApi.runtimeContext.get("tx.accessList");
        const accessListData = Protobuf.decode<EthAccessList>(accessList, EthAccessList.decode);
        for (let i = 0; i < accessListData.accessList.length; i++) {
            sys.log(logPrefix + " " + "tx.accessList" + " " + i.toString(10) + " " + uint8ArrayToHex(accessListData.accessList[i].address))
        }

        const txNonce = sys.hostApi.runtimeContext.get("tx.nonce");
        const txNonceData = Protobuf.decode<UintData>(txNonce, UintData.decode);
        sys.log(logPrefix + " " + "tx.nonce" + " " + txNonceData.data.toString(10))

        const gasPrice = sys.hostApi.runtimeContext.get("tx.gasPrice");
        const gasPriceData = Protobuf.decode<BytesData>(gasPrice, BytesData.decode);
        sys.log(logPrefix + " " + "tx.gasPrice" + " " + uint8ArrayToHex(gasPriceData.data))

        const txGas = sys.hostApi.runtimeContext.get("tx.gas");
        const txGasData = Protobuf.decode<UintData>(txGas, UintData.decode);
        sys.log(logPrefix + " " + "tx.gas" + " " + txGasData.data.toString(10))

        const gasTipCap = sys.hostApi.runtimeContext.get("tx.gasTipCap");
        const gasTipCapData = Protobuf.decode<BytesData>(gasTipCap, BytesData.decode);
        sys.log(logPrefix + " " + "tx.gasTipCap" + " " + uint8ArrayToHex(gasTipCapData.data))

        const gasFeeCap = sys.hostApi.runtimeContext.get("tx.gasFeeCap");
        const gasFeeCapData = Protobuf.decode<BytesData>(gasFeeCap, BytesData.decode);
        sys.log(logPrefix + " " + "tx.gasFeeCap" + " " + uint8ArrayToHex(gasFeeCapData.data))

        const txTo = sys.hostApi.runtimeContext.get("tx.to");
        const txToData = Protobuf.decode<BytesData>(txTo, BytesData.decode);
        sys.log(logPrefix + " " + "tx.to" + " " + uint8ArrayToHex(txToData.data))

        const toValue = sys.hostApi.runtimeContext.get("tx.value");
        const toValueData = Protobuf.decode<BytesData>(toValue, BytesData.decode);
        sys.log(logPrefix + " " + "tx.value" + " " + uint8ArrayToHex(toValueData.data));

        const tx = sys.hostApi.runtimeContext.get("tx.data");
        const txData = Protobuf.decode<BytesData>(tx, BytesData.decode);
        sys.log(logPrefix + " " + "tx.data" + " " + uint8ArrayToHex(txData.data))

        const txBytes = sys.hostApi.runtimeContext.get("tx.bytes");
        const txBytesData = Protobuf.decode<BytesData>(txBytes, BytesData.decode);
        sys.log(logPrefix + " " + "tx.bytes" + " " + uint8ArrayToHex(txBytesData.data))

        const txHash = sys.hostApi.runtimeContext.get("tx.hash");
        const txHashData = Protobuf.decode<BytesData>(txHash, BytesData.decode);
        sys.log(logPrefix + " " + "tx.hash" + " " + uint8ArrayToHex(txHashData.data))

        const txUnBytes = sys.hostApi.runtimeContext.get("tx.unsigned.bytes");
        const txUnBytesData = Protobuf.decode<BytesData>(txUnBytes, BytesData.decode);
        sys.log(logPrefix + " " + "tx.unsigned.bytes" + " " + uint8ArrayToHex(txUnBytesData.data))

        const txUnHash = sys.hostApi.runtimeContext.get("tx.unsigned.hash");
        const txUnHashData = Protobuf.decode<BytesData>(txUnHash, BytesData.decode);
        sys.log(logPrefix + " " + "env.chain.berlinBlock" + " " + uint8ArrayToHex(txUnHashData.data))

        const sigV = sys.hostApi.runtimeContext.get("tx.sig.v");
        const sigVData = Protobuf.decode<BytesData>(sigV, BytesData.decode);
        sys.log(logPrefix + " " + "env.chain.berlinBlock" + " " + uint8ArrayToHex(sigVData.data))

        const sigR = sys.hostApi.runtimeContext.get("tx.sig.r");
        const sigRData = Protobuf.decode<BytesData>(sigR, BytesData.decode);
        sys.log(logPrefix + " " + "tx.sig.r" + " " + uint8ArrayToHex(sigRData.data))

        const sigS = sys.hostApi.runtimeContext.get("tx.sig.s");
        const sigSData = Protobuf.decode<BytesData>(sigS, BytesData.decode);
        sys.log(logPrefix + " " + "tx.sig.s" + " " + uint8ArrayToHex(sigSData.data))

        const txFrom = sys.hostApi.runtimeContext.get("tx.from");
        const txFromData = Protobuf.decode<BytesData>(txFrom, BytesData.decode);
        sys.log(logPrefix + " " + "tx.from" + " " + uint8ArrayToHex(txFromData.data))

        const txIndex = sys.hostApi.runtimeContext.get("tx.index");
        const txIndexData = Protobuf.decode<UintData>(txIndex, UintData.decode);
        sys.log(logPrefix + " " + "tx.index" + " " + txIndexData.data.toString(10))

        const aspectId = sys.hostApi.runtimeContext.get("aspect.id");
        const aspectIdData = Protobuf.decode<BytesData>(aspectId, BytesData.decode);
        sys.log(logPrefix + " " + "aspect.id" + " " + uint8ArrayToHex(aspectIdData.data))

        const aspectVer = sys.hostApi.runtimeContext.get("aspect.version");
        const aspectVerData = Protobuf.decode<UintData>(aspectVer, UintData.decode);
        sys.log(logPrefix + " " + "aspect.version" + " " + aspectVerData.data.toString(10))

        const msgFrom = sys.hostApi.runtimeContext.get("msg.from");
        const msgFromData = Protobuf.decode<BytesData>(msgFrom, BytesData.decode);
        sys.log(logPrefix + " " + "msg.from" + " " + uint8ArrayToHex(msgFromData.data))

        const msgTo = sys.hostApi.runtimeContext.get("msg.to");
        const msgToData = Protobuf.decode<BytesData>(msgTo, BytesData.decode);
        sys.log(logPrefix + " " + "msg.to" + " " + uint8ArrayToHex(msgToData.data))

        const msgValue = sys.hostApi.runtimeContext.get("msg.value");
        const msgValueData = Protobuf.decode<BytesData>(msgValue, BytesData.decode);
        sys.log(logPrefix + " " + "msg.value" + " " + uint8ArrayToHex(msgValueData.data))

        const msgGas = sys.hostApi.runtimeContext.get("msg.gas");
        const msgGasData = Protobuf.decode<UintData>(msgGas, UintData.decode);
        sys.log(logPrefix + " " + "msg.gas" + " " + msgGasData.data.toString(10))

        const msgInput = sys.hostApi.runtimeContext.get("msg.input");
        const msgInputData = Protobuf.decode<BytesData>(msgInput, BytesData.decode);
        sys.log(logPrefix + " " + "msg.input" + " " + uint8ArrayToHex(msgInputData.data))

        const msgIndex = sys.hostApi.runtimeContext.get("msg.index");
        const msgIndexData = Protobuf.decode<UintData>(msgIndex, UintData.decode);
        sys.log(logPrefix + " " + "msg.index" + " " + msgIndexData.data.toString(10))

        // const msgRet = sys.hostApi.runtimeContext.get("msg.result.ret");
        // const msgRetData = Protobuf.decode<BytesData>(msgRet, BytesData.decode);
        // sys.log(logPrefix + " " + "msg.result.ret" + " " + uint8ArrayToHex(msgRetData.data));

        // const msgGasUsed = sys.hostApi.runtimeContext.get("msg.result.gasUsed");
        // const msGasUsedData = Protobuf.decode<UintData>(msgGasUsed, UintData.decode);
        // sys.log(logPrefix + " " + "msg.result.gasUsed" + " " + msGasUsedData.data.toString(10))

        // const msgErr = sys.hostApi.runtimeContext.get("msg.result.error");
        // const msgErrData = Protobuf.decode<StringData>(msgErr, StringData.decode);
        // sys.log(logPrefix + " " + "msg.result.error" + " " + msgErrData.data)

    }


}

// 2.register aspect Instance
const aspect = new ContextAspect()
entryPoint.setAspect(aspect)

// 3.must export it
export {execute, allocate}