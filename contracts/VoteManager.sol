// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Election  {
    string[] public ballots;
    string public sismoGroupId;
    string[] public candidates;

    constructor(string memory _sismoGroupId, string[] memory _candidates) {
        sismoGroupId = _sismoGroupId;
        candidates = _candidates;
    }

    function vote(string memory _encryptedProofAndVote) public {
        ballots.push(_encryptedProofAndVote);
    }
}