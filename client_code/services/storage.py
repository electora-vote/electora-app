import anvil.js
from anvil_extras.storage import indexed_db
from . import encryption

_ethers = anvil.js.import_from("ethers")

try:
    from anvil.js.window import ethereum  # noqa unused_import

    _ethereum_available = True
except AttributeError:
    _ethereum_available = False


class LocalStore:
    """A wrapper for the browser's indexed DB

    Each entry has a tuple of class name and uuid as its key.
    """

    store = indexed_db.create_store("eu.electora.objects")

    @classmethod
    def all(cls, obj_cls):
        items = (v for k, v in cls.store.items() if k.split(",")[0] == obj_cls.__name__)
        return (obj_cls(**item) for item in items)

    @classmethod
    def get(cls, obj_cls, uuid):
        item = cls.store.get(f"{obj_cls.__name__},{uuid}", None)
        return obj_cls(**item) if item else None

    def save(self, obj):
        key = getattr(obj, "key")
        self.store[(obj.__class__.__name__, getattr(obj, key))] = obj.__dict__


class OnChainStore:
    address = "0x86347dab0B77F766e5C8e833d97D96AB7aA15f90"
    url = f"https://scrollexplorer.unifra.io/address/{address}"
    abi = [
        {
            "inputs": [
                {"internalType": "string", "name": "_ballotId", "type": "string"},
                {"internalType": "uint256", "name": "_endTime", "type": "uint256"},
                {"internalType": "string", "name": "_sismoGroupId", "type": "string"},
                {"internalType": "uint8", "name": "_dkgRitualId", "type": "uint8"},
                {
                    "internalType": "string",
                    "name": "_storageLocation",
                    "type": "string",
                },
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
            "inputs": [
                {"internalType": "string", "name": "_ballotId", "type": "string"},
                {
                    "internalType": "string",
                    "name": "_encryptedProofAndVote",
                    "type": "string",
                },
            ],
            "name": "vote",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function",
        },
        {
            "inputs": [{"internalType": "string", "name": "", "type": "string"}],
            "name": "ballots",
            "outputs": [
                {"internalType": "uint256", "name": "endTime", "type": "uint256"},
                {"internalType": "string", "name": "sismoGroupId", "type": "string"},
                {"internalType": "uint8", "name": "dkgRitualId", "type": "uint8"},
                {"internalType": "string", "name": "storageLocation", "type": "string"},
                {"internalType": "uint8", "name": "protocolVersion", "type": "uint8"},
            ],
            "stateMutability": "view",
            "type": "function",
        },
        {
            "inputs": [
                {"internalType": "string", "name": "_ballotId", "type": "string"}
            ],
            "name": "getCandidates",
            "outputs": [{"internalType": "string[]", "name": "", "type": "string[]"}],
            "stateMutability": "view",
            "type": "function",
        },
        {
            "inputs": [
                {"internalType": "string", "name": "_ballotId", "type": "string"}
            ],
            "name": "getEndTime",
            "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
            "stateMutability": "view",
            "type": "function",
        },
        {
            "inputs": [
                {"internalType": "string", "name": "_ballotId", "type": "string"}
            ],
            "name": "getProtocolVersion",
            "outputs": [{"internalType": "uint8", "name": "", "type": "uint8"}],
            "stateMutability": "view",
            "type": "function",
        },
        {
            "inputs": [
                {"internalType": "string", "name": "_ballotId", "type": "string"}
            ],
            "name": "getSismoGroupID",
            "outputs": [{"internalType": "string", "name": "", "type": "string"}],
            "stateMutability": "view",
            "type": "function",
        },
        {
            "inputs": [
                {"internalType": "string", "name": "_ballotId", "type": "string"}
            ],
            "name": "getStorageLocation",
            "outputs": [{"internalType": "string", "name": "", "type": "string"}],
            "stateMutability": "view",
            "type": "function",
        },
        {
            "inputs": [
                {"internalType": "string", "name": "", "type": "string"},
                {"internalType": "uint256", "name": "", "type": "uint256"},
            ],
            "name": "votes",
            "outputs": [{"internalType": "string", "name": "", "type": "string"}],
            "stateMutability": "view",
            "type": "function",
        },
    ]

    def __init__(self):
        self._contract = None

    @property
    def contract(self):
        if not _ethereum_available:
            raise ValueError("No connected wallet found")

        if not self._contract:
            provider = _ethers.providers.Web3Provider(ethereum)
            signer = provider.getSigner()
            self._contract = _ethers.Contract(self.address, self.abi, signer)

        return self._contract

    def register_ballot(self, ballot):
        self.contract.createBallot(
            ballot.uuid,
            ballot.ends_at,
            ballot.sismo_group_id,
            ballot.dkg_ritual_id,
            ballot.storage_location,
            ballot.candidates,
            ballot.protocol_version,
        )

    def cast_vote(self, ballot, ciphertext):
        self.contract.vote(ballot.uuid, ciphertext)
