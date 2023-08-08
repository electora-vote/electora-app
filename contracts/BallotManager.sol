// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BallotManager {
    struct BallotInfo {
        string _ballotId;
        string name;
        uint endTime;
        string sismoGroupId;
        uint8 dkgRitualId;
        string[] candidates;
        uint8 protocolVersion;
    }
    BallotInfo[] public ballots;
    mapping(string => uint256) public uuidToIndex;

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
        ballots.push(BallotInfo(_ballotId, _name, _endTime, _sismoGroupId, _dkgRitualId, _candidates, _protocolVersion));
        uuidToIndex[_ballotId] = ballots.length - 1;
    }

    function getAllBallots() public view returns (BallotInfo[] memory) {
        return ballots;
    }
    
    function getName(string memory _ballotId) external view returns(string memory) {
        return ballots[uuidToIndex[_ballotId]].name;
    }
    
    function getEndTime(string memory _ballotId) external view returns(uint) {
        return ballots[uuidToIndex[_ballotId]].endTime;
    }
    
    function getSismoGroupID(string memory _ballotId) external view returns(string memory) {
        return ballots[uuidToIndex[_ballotId]].sismoGroupId;
    }
    
    function getCandidates(string memory _ballotId) external view returns(string[] memory) {
        return ballots[uuidToIndex[_ballotId]].candidates;
    }

    function getProtocolVersion(string memory _ballotId) external view returns(uint8) {
        return ballots[uuidToIndex[_ballotId]].protocolVersion;
    }
}