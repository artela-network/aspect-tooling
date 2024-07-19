// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CallerContract {
    // Event to record call details
    event CallMade(address target, bytes data, bool success, string returnData);

    /**
     * @dev Call function to invoke another contract
     * @param target The target contract address
     * @param data The call data to send
     */
    function call(address target, bytes memory data) public {
        require(target != address(0), "Invalid target address");

        try this.externalCall(target, data) returns (bool success, bytes memory returnDataBytes) {
            // Unpack return data to string
            string memory returnData = _bytesToString(returnDataBytes);

            // Trigger event to record call details
            emit CallMade(target, data, success, returnData);

            // Revert the transaction if the call failed
            require(success, "Call failed: " + returnData);
        } catch (bytes memory reason) {
            // Unpack error data to string
            string memory errorMessage = _getRevertMsg(reason);

            // Trigger event to record call failure
            emit CallMade(target, data, false, errorMessage);
            revert(errorMessage);
        }
    }

    /**
     * @dev Internal function to perform the external call
     * @param target The target contract address
     * @param data The call data to send
     * @return success Whether the call was successful
     * @return returnData The returned data from the call
     */
    function externalCall(address target, bytes memory data) external returns (bool success, bytes memory returnData) {
        (success, returnData) = target.call(data);
    }

    /**
     * @dev Internal function to convert bytes to string
     * @param data The bytes data to convert
     * @return The converted string
     */
    function _bytesToString(bytes memory data) internal pure returns (string memory) {
        return string(data);
    }

    /**
     * @dev Internal function to decode revert reason
     * @param _returnData The bytes data containing the revert reason
     * @return The decoded revert reason string
     */
    function _getRevertMsg(bytes memory _returnData) internal pure returns (string memory) {
        // If the _returnData length is less than 68, then the transaction failed silently (without a revert message)
        if (_returnData.length < 68) return "Transaction reverted silently";

        assembly {
        // Slice the sighash
            _returnData := add(_returnData, 0x04)
        }
        return abi.decode(_returnData, (string));
    }
}
