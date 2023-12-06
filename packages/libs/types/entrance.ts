import {EntryPoint} from "./aspect-entry";
import {
    IBlockJP,
    IPostContractCallJP,
    IPostTxCommitJP,
    IPostTxExecuteJP,
    IPreContractCallJP,
    IPreTxExecuteJP,
    ITransactionVerifier
} from "./aspect-interface"
import {MessageUtil} from "../common";

const messageUtil = MessageUtil.instance();
export const entryPoint = new EntryPoint();
export function execute(methodPtr: i32, argPtr: i32): i32 {
    return entryPoint.execute(methodPtr, argPtr);
}

export function isBlockLevel(): i32 {
    let is = false
    if (entryPoint.getAspect() != null && entryPoint.getAspect() instanceof IBlockJP) {
        is = true
    }
    return messageUtil.StoreOutputBool(is);
}

export function isTransactionLevel(): i32 {
    if (entryPoint.getAspect() == null) {
        return messageUtil.StoreOutputBool(false);
    }
    if (entryPoint.getAspect() instanceof IPreTxExecuteJP
        || entryPoint.getAspect() instanceof IPreContractCallJP
        || entryPoint.getAspect() instanceof IPostContractCallJP
        || entryPoint.getAspect() instanceof IPostTxExecuteJP
        || entryPoint.getAspect() instanceof IPostTxCommitJP
    ) {
        return messageUtil.StoreOutputBool(true);
    }
    return messageUtil.StoreOutputBool(false);
}

export function isTransactionVerifier(): i32 {
    let is = false
    if (entryPoint.getAspect() != null && entryPoint.getAspect() instanceof ITransactionVerifier) {
        is = true
    }
    return messageUtil.StoreOutputBool(is);
}

export function allocate(size: i32): i32 {
    return heap.alloc(size);
}
