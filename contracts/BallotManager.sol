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
    mapping(string => BallotInfo) public ballots;

    constructor() {
    }

    function createBallot(
        string memory _ballotId,
        string memory _name,
        uint _endTime, 
        string memory _sismoGroupId,
        uint8 _dkgRitualId,
        string[] memory _candidates,
        uint8 _protocolVersion
    ) public {
        ballots[_ballotId] = BallotInfo(_name, _endTime, _sismoGroupId, _dkgRitualId, _candidates, _protocolVersion);
    }

    function getName(string memory _ballotId) external view returns(string memory) {
        return ballots[_ballotId].name;
    }

    function getEndTime(string memory _ballotId) external view returns(uint) {
        return ballots[_ballotId].endTime;
    }

    function getSismoGroupID(string memory _ballotId) external view returns(string memory) {
        return ballots[_ballotId].sismoGroupId;
    }

    function getCandidates(string memory _ballotId) external view returns(string[] memory) {
        return ballots[_ballotId].candidates;
    }

    function getProtocolVersion(string memory _ballotId) external view returns(uint8) {
        return ballots[_ballotId].protocolVersion;
    }

    function getAllBallots() external view returns(string[] memory, uint[] memory, string[] memory, uint8[] memory, string[][] memory, uint8[] memory) {
        uint length = ballots.length;
        string[] memory names = new string[](length);
        uint[] memory endTimes = new uint[](length);
        string[] memory sismoGroupIds = new string[](length);
        uint8[] memory dkgRitualIds = new uint8[](length);
        string[][] memory candidates = new string[][](length);
        uint8[] memory protocolVersions = new uint8[](length);

        for (uint i = 0; i < length; i++) {
            names[i] = ballots[i].name;
            endTimes[i] = ballots[i].endTime;
            sismoGroupIds[i] = ballots[i].sismoGroupId;
            dkgRitualIds[i] = ballots[i].dkgRitualId;
            candidates[i] = ballots[i].candidates;
            protocolVersions[i] = ballots[i].protocolVersion;
        }

        return (names, endTimes, sismoGroupIds, dkgRitualIds, candidates, protocolVersions);
    }
}