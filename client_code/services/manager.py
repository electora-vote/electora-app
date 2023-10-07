address = "0x53aa5b2DDCe249dF629cd2ffade97dfB166fb05c"
url = f"https://sepolia-blockscout.scroll.io/address/{address}"
abi = [
    {
        "inputs": [
            {"internalType": "string", "name": "_ballotId", "type": "string"},
            {"internalType": "string", "name": "_title", "type": "string"},
            {"internalType": "string", "name": "_description", "type": "string"},
            {"internalType": "string", "name": "_proof", "type": "string"},
            {"internalType": "string", "name": "_invoice", "type": "string"},
        ],
        "name": "addCandidate",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function",
    },
    {
        "inputs": [
            {"internalType": "string", "name": "_ballotId", "type": "string"},
            {"internalType": "string", "name": "_name", "type": "string"},
            {"internalType": "uint256", "name": "_endTime", "type": "uint256"},
            {"internalType": "string", "name": "_sismoGroupId", "type": "string"},
            {"internalType": "string", "name": "_candidateGroupId", "type": "string"},
            {"internalType": "uint8", "name": "_dkgRitualId", "type": "uint8"},
            {"internalType": "uint8", "name": "_protocolVersion", "type": "uint8"},
        ],
        "name": "createBallot",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function",
    },
    {"inputs": [], "stateMutability": "nonpayable", "type": "constructor"},
    {
        "inputs": [
            {"internalType": "string", "name": "", "type": "string"},
            {"internalType": "uint256", "name": "", "type": "uint256"},
        ],
        "name": "ballotIdToCandidates",
        "outputs": [
            {"internalType": "string", "name": "title", "type": "string"},
            {"internalType": "string", "name": "description", "type": "string"},
            {"internalType": "string", "name": "proof", "type": "string"},
            {"internalType": "string", "name": "invoice", "type": "string"},
        ],
        "stateMutability": "view",
        "type": "function",
    },
    {
        "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "name": "ballots",
        "outputs": [
            {"internalType": "string", "name": "_ballotId", "type": "string"},
            {"internalType": "string", "name": "name", "type": "string"},
            {"internalType": "uint256", "name": "endTime", "type": "uint256"},
            {"internalType": "string", "name": "sismoGroupId", "type": "string"},
            {"internalType": "string", "name": "candidateGroupId", "type": "string"},
            {"internalType": "uint8", "name": "dkgRitualId", "type": "uint8"},
            {"internalType": "uint8", "name": "protocolVersion", "type": "uint8"},
        ],
        "stateMutability": "view",
        "type": "function",
    },
    {
        "inputs": [],
        "name": "getAllBallots",
        "outputs": [
            {
                "components": [
                    {"internalType": "string", "name": "_ballotId", "type": "string"},
                    {"internalType": "string", "name": "name", "type": "string"},
                    {"internalType": "uint256", "name": "endTime", "type": "uint256"},
                    {
                        "internalType": "string",
                        "name": "sismoGroupId",
                        "type": "string",
                    },
                    {
                        "internalType": "string",
                        "name": "candidateGroupId",
                        "type": "string",
                    },
                    {"internalType": "uint8", "name": "dkgRitualId", "type": "uint8"},
                    {
                        "internalType": "uint8",
                        "name": "protocolVersion",
                        "type": "uint8",
                    },
                ],
                "internalType": "struct BallotManager.BallotInfo[]",
                "name": "",
                "type": "tuple[]",
            }
        ],
        "stateMutability": "view",
        "type": "function",
    },
    {
        "inputs": [{"internalType": "string", "name": "_ballotId", "type": "string"}],
        "name": "getBallot",
        "outputs": [
            {
                "components": [
                    {"internalType": "string", "name": "_ballotId", "type": "string"},
                    {"internalType": "string", "name": "name", "type": "string"},
                    {"internalType": "uint256", "name": "endTime", "type": "uint256"},
                    {
                        "internalType": "string",
                        "name": "sismoGroupId",
                        "type": "string",
                    },
                    {
                        "internalType": "string",
                        "name": "candidateGroupId",
                        "type": "string",
                    },
                    {"internalType": "uint8", "name": "dkgRitualId", "type": "uint8"},
                    {
                        "internalType": "uint8",
                        "name": "protocolVersion",
                        "type": "uint8",
                    },
                ],
                "internalType": "struct BallotManager.BallotInfo",
                "name": "",
                "type": "tuple",
            }
        ],
        "stateMutability": "view",
        "type": "function",
    },
    {
        "inputs": [{"internalType": "string", "name": "_ballotId", "type": "string"}],
        "name": "getCandidateGroupID",
        "outputs": [{"internalType": "string", "name": "", "type": "string"}],
        "stateMutability": "view",
        "type": "function",
    },
    {
        "inputs": [{"internalType": "string", "name": "_ballotId", "type": "string"}],
        "name": "getCandidates",
        "outputs": [
            {
                "components": [
                    {"internalType": "string", "name": "title", "type": "string"},
                    {"internalType": "string", "name": "description", "type": "string"},
                    {"internalType": "string", "name": "proof", "type": "string"},
                    {"internalType": "string", "name": "invoice", "type": "string"},
                ],
                "internalType": "struct BallotManager.Candidate[]",
                "name": "",
                "type": "tuple[]",
            }
        ],
        "stateMutability": "view",
        "type": "function",
    },
    {
        "inputs": [{"internalType": "string", "name": "_ballotId", "type": "string"}],
        "name": "getEndTime",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function",
    },
    {
        "inputs": [{"internalType": "string", "name": "_ballotId", "type": "string"}],
        "name": "getName",
        "outputs": [{"internalType": "string", "name": "", "type": "string"}],
        "stateMutability": "view",
        "type": "function",
    },
    {
        "inputs": [{"internalType": "string", "name": "_ballotId", "type": "string"}],
        "name": "getProtocolVersion",
        "outputs": [{"internalType": "uint8", "name": "", "type": "uint8"}],
        "stateMutability": "view",
        "type": "function",
    },
    {
        "inputs": [{"internalType": "string", "name": "_ballotId", "type": "string"}],
        "name": "getSismoGroupID",
        "outputs": [{"internalType": "string", "name": "", "type": "string"}],
        "stateMutability": "view",
        "type": "function",
    },
    {
        "inputs": [{"internalType": "string", "name": "", "type": "string"}],
        "name": "uuidToIndex",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function",
    },
]
