// eslint-disable-next-line @typescript-eslint/triple-slash-reference

import {DataSpaceType, EthBlockHeader, Evidence, LastCommitInfo, MinGasPrice, GasMeter, EthTxArray} from "../proto";
import {Protobuf} from "as-proto/assembly";
import {RuntimeContextAccessor} from "../system";

export class BlockContext {


    public blockHeader(): EthBlockHeader | null {

        const response = RuntimeContextAccessor.get(DataSpaceType.BLOCK_HEADER, null);
        if (!response.data.value) {
            return null
        }
        return Protobuf.decode<EthBlockHeader>(response.data.value, EthBlockHeader.decode);

    }

    public getSimilarTxs(): EthTxArray | null {
        const response = RuntimeContextAccessor.get(DataSpaceType.BLOCK_TXS, null);
        if (!response.data.value) {
            return null
        }
        return Protobuf.decode<EthTxArray>(response.data.value, EthTxArray.decode);

    }

    public gasMeter(): GasMeter | null {
        const response = RuntimeContextAccessor.get(DataSpaceType.BLOCK_GAS_METER, null);
        if (!response.data.value) {
            return null
        }
        return Protobuf.decode<GasMeter>(response.data.value, GasMeter.decode);

    }

    public minGasPrice(): MinGasPrice | null {
        const response = RuntimeContextAccessor.get(DataSpaceType.BLOCK_MIN_GAS_PRICE, null);
        if (!response.data.value) {
            return null
        }
        return Protobuf.decode<MinGasPrice>(response.data.value, MinGasPrice.decode);
    }

    public lastCommit(): LastCommitInfo | null {
        const response = RuntimeContextAccessor.get(DataSpaceType.BLOCK_LAST_COMMIT, null);
        if (!response.data.value) {
            return null
        }
        return Protobuf.decode<LastCommitInfo>(response.data.value, LastCommitInfo.decode);
    }

    public getEvidences(): Evidence | null {
        const response = RuntimeContextAccessor.get(DataSpaceType.BLOCK_EVIDENCE, null);
        if (!response.data.value) {
            return null
        }
        return Protobuf.decode<Evidence>(response.data.value, Evidence.decode);
    }
}

