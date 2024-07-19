// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract TransientStorage {
    address private deployer;

    constructor() {
        deployer = msg.sender;
    }

    function isOwner(address user) external view returns (bool result) {
        return user == deployer;
    }

    function call(address aspectId) public {
        bytes memory contextKey = abi.encodePacked(aspectId, "context");
        (bool success, bytes memory returnData) = address(0x64).call(contextKey);
        string memory preCallTransientStorage = success ? string(returnData) : '';
        
        require(keccak256(abi.encodePacked(preCallTransientStorage)) == keccak256(abi.encodePacked("12")), "transient storage not as expected");

        bytes memory inputData = abi.encode("context", "3");
        (success, ) = address(0x66).call(inputData);
        require(success, "Failed to set transient storage");
    }
}