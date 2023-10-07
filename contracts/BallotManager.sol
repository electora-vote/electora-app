// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BallotManager {
    struct Candidate {
        string title;
        string description;
        string proof;
        string invoice;
    }
    struct BallotInfo {
        string _ballotId;
        string name;
        uint endTime;
        string sismoGroupId;
        string candidateGroupId;
        uint8 dkgRitualId;
        uint8 protocolVersion;
    }

    BallotInfo[] public ballots;
    mapping(string => uint256) public uuidToIndex;
    mapping(string => Candidate[]) public ballotIdToCandidates;

    constructor() {
    }
    
    function createBallot(
        string memory _ballotId,
        string memory _name,
        uint _endTime, 
        string memory _sismoGroupId,
        string memory _candidateGroupId,
        uint8 _dkgRitualId,
        uint8 _protocolVersion
    ) public {
        ballots.push(BallotInfo(_ballotId, _name, _endTime, _sismoGroupId, _candidateGroupId, _dkgRitualId, _protocolVersion));
        uuidToIndex[_ballotId] = ballots.length - 1;
    }

    function getAllBallots() public view returns (BallotInfo[] memory) {
        return ballots;
    }

    function getBallot(string memory _ballotId) public view returns (BallotInfo memory) {
        return ballots[uuidToIndex[_ballotId]];
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

    function getCandidateGroupID(string memory _ballotId) external view returns(string memory) {
        return ballots[uuidToIndex[_ballotId]].candidateGroupId;
    }
    
    function getCandidates(string memory _ballotId) external view returns(Candidate[] memory) {
        return ballotIdToCandidates[_ballotId];
    }

    function addCandidate(string memory _ballotId, string memory _title, string memory _description, string memory _proof, string memory _invoice) external {
        ballotIdToCandidates[_ballotId].push(Candidate(_title, _description, _proof, _invoice));
    }

    function getProtocolVersion(string memory _ballotId) external view returns(uint8) {
        return ballots[uuidToIndex[_ballotId]].protocolVersion;
    }
}