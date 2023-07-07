// SPDX-License-Identifier: GPL-3.0
export const  CounterSolTmpl=`
// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.2 <0.9.0;

contract Counter {
    uint256 private counter;

    function count(uint256 number) public {
        counter += number;
    }
}
`;