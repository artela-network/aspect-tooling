// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Counter {
    address private deployer;

    uint256 public count;

    constructor() {
        deployer = msg.sender;
    }

    function isOwner(address user) external view returns (bool result) {
        return user == deployer;
    }

    function add(uint256 num) public {
        count += num;
    }

    function increase() public {
        add(1);
    }
}