// SPDX-License-Identifier: MIT
pragma solidity 0.8.1;

contract Proxy {

    address public otherContractAddress;

    function setOtherAddressStorage(address _otherContract) internal {
        otherContractAddress = _otherContract;
    }
}

contract NotLostStorage is Proxy {
    // TODO 25:49 + Remove nodemodules + rename repo to upgradable
}