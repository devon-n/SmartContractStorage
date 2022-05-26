// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;


/* Storage contract to hold values */
contract EternalStorage {

    mapping(bytes32 => uint) UIntStorage;

    function getUIntValue(bytes32 record) public view returns (uint) {
        return UIntStorage[record];
    }

    function setUIntValue(bytes32 record, uint value) public {
        UIntStorage[record] = value;
    }

    mapping(bytes32 => bool) BooleanStorage;

    function getBooleanValue(bytes32 record) public view returns (bool) {
        return BooleanStorage[record];
    }

    function setBooleanValue(bytes32 record, bool value) public {
        BooleanStorage[record] = value;
    }
}

library ballotLib {
    function getNumberOfVotes(address _eternalStorage) public view returns (uint256) {
        return EternalStorage(_eternalStorage).getUIntValue(keccak256('votes'));
    }

    function setVoteCount(address _eternalStorage, uint _voteCount) public {
        EternalStorage(_eternalStorage).setUIntValue(keccak256('votes'), _voteCount);
    }
}

/* Ballot contract handles the logic */
contract Ballot {
    using ballotLib for address;
    address eternalStorage;

    constructor(address _eternalStorage) {
        eternalStorage = _eternalStorage;
    }

    function getNumberOfVotes() public view returns(uint) {
        return eternalStorage.getNumberOfVotes();
    }

    function vote() public {
        eternalStorage.setVoteCount(eternalStorage.getNumberOfVotes() + 1);
    }
}

/* Upgraded Contracts */

library ballotLib2 {
    function getNumberOfVotes(address _eternalStorage) public view returns (uint256) {
        return EternalStorage(_eternalStorage).getUIntValue(keccak256('votes'));
    }

    function setVoteCount(address _eternalStorage, uint _voteCount) public {
        EternalStorage(_eternalStorage).setUIntValue(keccak256('votes'), _voteCount);
    }

    /* Upgrades */
    function getUserHasVoted(address _eternalStorage) public view returns (bool) {
        return EternalStorage(_eternalStorage).getBooleanValue(keccak256(abi.encodePacked("voted", msg.sender)));
    }

    function setUserHasVoted(address _eternalStorage) public {
        EternalStorage(_eternalStorage).setBooleanValue(keccak256(abi.encodePacked("voted", msg.sender)), true);
    }
}

contract Ballot2 {
    using ballotLib2 for address;
    address eternalStorage;

    constructor(address _eternalStorage) {
        eternalStorage = _eternalStorage;
    }

    function getNumberOfVotes() public view returns(uint) {
        return eternalStorage.getNumberOfVotes();
    }

    function vote() public {
        /* Upgrades */
        require(eternalStorage.getUserHasVoted() == false, "User has already voted.");
        eternalStorage.setUserHasVoted();
        eternalStorage.setVoteCount(eternalStorage.getNumberOfVotes() + 1);
    }
}