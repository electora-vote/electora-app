address = "0xFCCA4B31817392Fd94f1177B8B34294c8F774017"
url = f"https://blockscout.scroll.io/address/{address}"
abi = [
    {"type": "constructor", "inputs": []},
    {
        "type": "function",
        "stateMutability": "view",
        "outputs": [
            {"type": "string", "name": "name", "internalType": "string"},
            {"type": "uint256", "name": "endTime", "internalType": "uint256"},
            {"type": "string", "name": "sismoGroupId", "internalType": "string"},
            {"type": "uint8", "name": "dkgRitualId", "internalType": "uint8"},
            {"type": "uint8", "name": "protocolVersion", "internalType": "uint8"},
        ],
        "name": "ballots",
        "inputs": [{"type": "string", "name": "", "internalType": "string"}],
    },
    {
        "type": "function",
        "stateMutability": "nonpayable",
        "outputs": [],
        "name": "createBallot",
        "inputs": [
            {"type": "string", "name": "_ballotId", "internalType": "string"},
            {"type": "string", "name": "_name", "internalType": "string"},
            {"type": "uint256", "name": "_endTime", "internalType": "uint256"},
            {"type": "string", "name": "_sismoGroupId", "internalType": "string"},
            {"type": "uint8", "name": "_dkgRitualId", "internalType": "uint8"},
            {"type": "string[]", "name": "_candidates", "internalType": "string[]"},
            {"type": "uint8", "name": "_protocolVersion", "internalType": "uint8"},
        ],
    },
    {
        "type": "function",
        "stateMutability": "view",
        "outputs": [{"type": "string[]", "name": "", "internalType": "string[]"}],
        "name": "getCandidates",
        "inputs": [{"type": "string", "name": "_ballotId", "internalType": "string"}],
    },
    {
        "type": "function",
        "stateMutability": "view",
        "outputs": [{"type": "uint256", "name": "", "internalType": "uint256"}],
        "name": "getEndTime",
        "inputs": [{"type": "string", "name": "_ballotId", "internalType": "string"}],
    },
    {
        "type": "function",
        "stateMutability": "view",
        "outputs": [{"type": "string", "name": "", "internalType": "string"}],
        "name": "getName",
        "inputs": [{"type": "string", "name": "_ballotId", "internalType": "string"}],
    },
    {
        "type": "function",
        "stateMutability": "view",
        "outputs": [{"type": "uint8", "name": "", "internalType": "uint8"}],
        "name": "getProtocolVersion",
        "inputs": [{"type": "string", "name": "_ballotId", "internalType": "string"}],
    },
    {
        "type": "function",
        "stateMutability": "view",
        "outputs": [{"type": "string", "name": "", "internalType": "string"}],
        "name": "getSismoGroupID",
        "inputs": [{"type": "string", "name": "_ballotId", "internalType": "string"}],
    },
]
