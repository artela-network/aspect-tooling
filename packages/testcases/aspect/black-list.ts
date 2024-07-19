import {
    allocate,
    entryPoint,
    execute,
    IPreContractCallJP,
    uint8ArrayToHex, sys, IAspectOperation, stringToUint8Array, InitInput,
    PreContractCallInput, OperationInput, uint8ArrayToString, ethereum
} from "@artela/aspect-libs";

/**
 * Please describe what functionality this aspect needs to implement.
 *
 * About the concept of Aspect @see [join-point](https://docs.artela.network/develop/core-concepts/join-point)
 * How to develop an Aspect  @see [Aspect Structure](https://docs.artela.network/develop/reference/aspect-lib/aspect-structure)
 */
class Aspect implements IPreContractCallJP, IAspectOperation {

    /**
     * isOwner is the governance account implemented by the Aspect, when any of the governance operation
     * (including upgrade, config, destroy) is made, isOwner method will be invoked to check
     * against the initiator's account to make sure it has the permission.
     *
     * @param sender address of the transaction
     * @return true if check success, false if check fail
     */
    isOwner(sender: Uint8Array): bool {
        return true;
    }

    private RiskKey: string = "risk-accounts";

    /**
     * postContractCall is a join-point which will be invoked after a contract call has finished.
     *
     * @param input input to the current join point
     */
    preContractCall(input: PreContractCallInput): void {
        // Implement me...

        // const from = uint8ArrayToHex(input.call!.from);
        //
        // const currentCallMethod = ethereum.parseMethodSig(input.call!.data);
        //
        // // Define functions that are not allowed to be reentered.
        // const noReentrantMethods: Array<string> = [
        //     ethereum.computeMethodSig('swapExactTokensForETH(uint, uint, address[] , address , uint )'),
        //     ethereum.computeMethodSig('swapETHForExactTokens(uint , address[] , address , uint )'),
        //     ethereum.computeMethodSig('swapExactETHForTokensSupportingFeeOnTransferTokens(uint ,address[],address ,uint) '),
        //     ethereum.computeMethodSig('swapExactTokensForTokensSupportingFeeOnTransferTokens(uint ,uint ,address[] ,address ,uint )'),
        //     ethereum.computeMethodSig('swapExactTokensForETHSupportingFeeOnTransferTokens(uint ,uint ,address[] ,address ,uint)'),
        //     ethereum.computeMethodSig('swapTokensForExactETH(uint , uint , address[] , address , uint )'),
        //     ethereum.computeMethodSig('swapExactETHForTokens(uint, address[], address, uint)'),
        //     ethereum.computeMethodSig('swapTokensForExactTokens(uint,uint,address[],address,uint)'),
        //     ethereum.computeMethodSig('swapExactTokensForTokens(uint,uint,address[],address,uint)'),
        // ];
        //
        // // Verify if the current method is within the scope of functions that are not susceptible to reentrancy.
        // if (noReentrantMethods.includes(currentCallMethod)) {
        const from = uint8ArrayToHex(input.call!.from);
        sys.log("|||| preContractCall from: " + from)

        const accounts = sys.aspect.mutableState.get<string>(this.RiskKey).unwrap();
        sys.log("|||| preContractCall accounts: " + accounts)
        if (accounts.includes(from)) {
            sys.revert("tx from in risk list")
        }
        // }

    }

    operation(input: OperationInput): Uint8Array {
        // +0xssss,0xxxx  add account
        // -0x8fada,0xbbxx remove account
        const addPrefix = "+"
        const delPrefix = "-"
        const splitChar = ",";

        const callData = input.callData;
        const data = uint8ArrayToString(callData);

        const accounts = sys.aspect.mutableState.get<string>(this.RiskKey).unwrap();
        const strings = accounts.split(splitChar);
        let newSet = new Set<string>()
        for (let i = 0; i < strings.length; i++) {
            newSet.add(strings[i])
        }
        if (data.startsWith(addPrefix)) {
            let accArray = data.substring(addPrefix.length).split(splitChar);
            for (let i = 0; i < accArray.length; i++) {
                newSet.add(accArray[i])
            }
        }
        if (data.startsWith(delPrefix)) {
            let accArray = data.substring(delPrefix.length).split(splitChar);
            for (let i = 0; i < accArray.length; i++) {
                newSet.delete(accArray[i])
            }
        }

        const resultAcc = newSet.values().join(splitChar)
        sys.aspect.mutableState.get<string>(this.RiskKey).set<string>(resultAcc)
        return stringToUint8Array("success");
    }

    init(input: InitInput): void {}
}

// 2.register aspect Instance
const aspect = new Aspect()
entryPoint.setAspect(aspect)
entryPoint.setOperationAspect(aspect)

// 3.must export it
export {execute, allocate}

