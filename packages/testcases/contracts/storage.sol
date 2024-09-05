// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/**
 * @title Storage
 * @dev Store & retrieve value in a variable
 * @custom:dev-run-script ./scripts/deploy_with_ethers.ts
 */
contract Storage {
    address private deployer;

    constructor() {
        deployer = msg.sender;
    }

    function isOwner(address user) external view returns (bool result) {
        if (user == deployer) {
            return true;
        } else {
            return false;
        }
    }


    uint256 number;

    struct Person {
        uint64 id;
        uint32 balance;
    }

    mapping(string => Person) public accounts;

    /**
     * @dev Store value in variable
     * @param num value to store
     */
    function store(uint256 num) public {
        number = number + num;
        accounts["tom"] = Person(101, 9900 + uint32(number));
    }

    /**
     * @dev Return value
     * @return value of 'number'
     */
    function retrieve() public view returns (uint256) {
        return number;
    }

    function getAspectContext(address aspectId, string calldata key) public returns (string memory validationData) {
        bytes memory contextKey = abi.encodePacked(aspectId, key);
        (bool success, bytes memory returnData) = address(0x64).call(contextKey);
        validationData = success ? string(returnData) : '';
    }

    function setAspectContext(string calldata key, string calldata value) public returns (bool) {
        bytes memory contextKey = abi.encode(key, value);
        (bool success, ) = address(0x66).call(contextKey);
        return success;
    }
}