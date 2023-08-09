address = "0x8e6Cf7F12fe2A4d5da9764ec1F0D7395EF744C42"
url = f"https://blockscout.scroll.io/address/{address}"
abi = [
    {
        "inputs": [
            {"internalType": "string", "name": "_ballotId", "type": "string"},
            {"internalType": "string", "name": "_name", "type": "string"},
            {"internalType": "uint256", "name": "_endTime", "type": "uint256"},
            {"internalType": "string", "name": "_sismoGroupId", "type": "string"},
            {"internalType": "uint8", "name": "_dkgRitualId", "type": "uint8"},
            {"internalType": "string[]", "name": "_candidates", "type": "string[]"},
            {"internalType": "uint8", "name": "_protocolVersion", "type": "uint8"},
        ],
        "name": "createBallot",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function",
    },
    {"inputs": [], "stateMutability": "nonpayable", "type": "constructor"},
    {
        "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "name": "ballots",
        "outputs": [
            {"internalType": "string", "name": "_ballotId", "type": "string"},
            {"internalType": "string", "name": "name", "type": "string"},
            {"internalType": "uint256", "name": "endTime", "type": "uint256"},
            {"internalType": "string", "name": "sismoGroupId", "type": "string"},
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
                    {"internalType": "uint8", "name": "dkgRitualId", "type": "uint8"},
                    {
                        "internalType": "string[]",
                        "name": "candidates",
                        "type": "string[]",
                    },
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
                    {"internalType": "uint8", "name": "dkgRitualId", "type": "uint8"},
                    {
                        "internalType": "string[]",
                        "name": "candidates",
                        "type": "string[]",
                    },
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
        "name": "getCandidates",
        "outputs": [{"internalType": "string[]", "name": "", "type": "string[]"}],
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
