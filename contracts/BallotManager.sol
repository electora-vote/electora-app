// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BallotManager {
    struct BallotInfo {
        string name;
        uint endTime;
        string sismoGroupId;
        uint8 dkgRitualId;
        string[] candidates;
        uint8 protocolVersion;
    }
    BallotInfo[] public ballots;

    constructor() {
    }

    function createBallot(
        string memory _name,
        uint _endTime, 
        string memory _sismoGroupId,
        uint8 _dkgRitualId,
        string[] memory _candidates,
        uint8 _protocolVersion
    ) public {
        uint32 _ballotId = uint32(ballots.length);
        ballots.push(BallotInfo(_name, _endTime, _sismoGroupId, _dkgRitualId, _candidates, _protocolVersion));
    }

    function getName(uint32 _ballotId) external view returns(string memory) {
        return ballots[_ballotId].name;
    }

    function getEndTime(uint32 _ballotId) external view returns(uint) {
        return ballots[_ballotId].endTime;
    }

    function getSismoGroupID(uint32 _ballotId) external view returns(string memory) {
        return ballots[_ballotId].sismoGroupId;
    }

    function getCandidates(uint32 _ballotId) external view returns(string[] memory) {
        return ballots[_ballotId].candidates;
    }

    function getProtocolVersion(uint32 _ballotId) external view returns(uint8) {
        return ballots[_ballotId].protocolVersion;
    }
}