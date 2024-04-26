// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Store {
    uint pos0;
    mapping(address => uint) pos1;

    event LogTest(
        string text
    );

    function Storage() public {
        pos0 = 1234;
        pos1[msg.sender] = 5678;
        emit LogTest("log somethimg");
    }
}