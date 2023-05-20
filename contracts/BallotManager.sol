// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BallotManager {
    struct BallotInfo {
        string sismoGroupId;
        string[] candidates;
    }
    mapping(string => string[]) public votes;
    mapping(string => BallotInfo) public ballots;

    constructor() {
    }

    function createBallot(string memory _ballotId, string memory _sismoGroupId, string[] memory _candidates) public {
        ballots[_ballotId] = BallotInfo(_sismoGroupId, _candidates);
    }

    function getCandidates(string memory _ballotId) external view returns(string[] memory) {
        return ballots[_ballotId].candidates;
    }

    function getSismoGroupID(string memory _ballotId) external view returns(string memory) {
        return ballots[_ballotId].sismoGroupId;
    }

    function vote(string memory _ballotId, string memory _encryptedProofAndVote) public {
        votes[_ballotId].push(_encryptedProofAndVote);
    }
}