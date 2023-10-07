import anvil.js
from anvil_extras.storage import indexed_db
from anvil.js.window import Bundlr
import app.services.manager as manager
from app.model import Candidate, Ballot
from datetime import datetime as dt

_ethers = anvil.js.import_from("ethers").ethers

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
        return (obj_cls._deserialise(item) for item in items if item)

    @classmethod
    def get(cls, obj_cls, uuid):
        item = cls.store.get(f"{obj_cls.__name__},{uuid}", None)
        return obj_cls._deserialise(item) if item else None

    def save(self, obj):
        key = getattr(obj, "key")
        self.store[(obj.__class__.__name__, getattr(obj, key))] = obj._serialise()


class ArweaveStore:
    def __init__(self):
        if not _ethereum_available:
            raise ValueError("No connected wallet found")
        self.provider = _ethers.providers.Web3Provider(ethereum)
        self.signer = self.provider.getSigner()
        WebBundlr = Bundlr.default
        self.bundlr = WebBundlr("https://devnet.irys.xyz", "matic", self.provider)
        self.bundlr.ready()

    def cast_vote(self, ballot, ciphertext):
        tags = [{"name": "ballot_uuid", "value": ballot.uuid}]
        num_bytes = len(ciphertext.encode("utf8"))
        atomic_price = self.bundlr.getPrice(num_bytes)
        converted_price = self.bundlr.utils.fromAtomic(num_bytes)
        print(f"Uploading {num_bytes} bytes costs {converted_price}")
        self.bundlr.fund(atomic_price)
        response = self.bundlr.upload(ciphertext, {"tags": tags})
        print(response)


class ScrollStore:
    def __init__(self):
        self._contract = None

        if not _ethereum_available:
            raise ValueError("No connected wallet found")
        self.provider = _ethers.providers.Web3Provider(ethereum)
        self.signer = self.provider.getSigner()

    def _to_model(self, ballot_info):
        candidates = self.contract.getCandidates(ballot_info[0])
        ballot_info[2] = dt.fromtimestamp(ballot_info[2].toBigInt())
        ballot = Ballot(*ballot_info)
        ballot.candidates = [Candidate(*c) for c in candidates]
        return ballot

    def all(self):
        ballots = self.contract.getAllBallots()
        for ballot in ballots:
            yield self._to_model(ballot)

    @property
    def contract(self):
        if not _ethereum_available:
            raise ValueError("No connected wallet found")

        if not self._contract:
            self._contract = _ethers.Contract(manager.address, manager.abi, self.signer)

        return self._contract

    def get_ballot(self, uuid):
        ballot = self.contract.getBallot(uuid)
        return self._to_model(ballot)

    def register_ballot(self, ballot):
        try:
            tx = self.contract.createBallot(
                ballot.uuid,
                ballot.name,
                ballot.ends_at_timestamp,
                ballot.sismo_group_id,
                ballot.candidate_group_id,
                ballot.dkg_ritual_id,
                ballot.protocol_version,
            )
            receipt = tx.wait()
            return receipt.status == 1
        except Exception as e:
            return str(e)

    def add_candidate(self, ballot, candidate):
        try:
            tx = self.contract.addCandidate(
                ballot.uuid,
                candidate.uuid,
                candidate.name,
                candidate.description,
                candidate.image_url,
            )
            receipt = tx.wait()
            ballot.add_candidate(candidate)
            return receipt.status == 1
        except Exception as e:
            return str(e)
