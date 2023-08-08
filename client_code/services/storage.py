import anvil.js
from anvil_extras.storage import indexed_db
from anvil.js.window import Bundlr
import app.services.manager as manager


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
        return (obj_cls(**item) for item in items)

    @classmethod
    def get(cls, obj_cls, uuid):
        item = cls.store.get(f"{obj_cls.__name__},{uuid}", None)
        return obj_cls(**item) if item else None

    def save(self, obj):
        key = getattr(obj, "key")
        self.store[(obj.__class__.__name__, getattr(obj, key))] = obj.__dict__


class ArweaveStore:
    def __init__(self):
        if not _ethereum_available:
            raise ValueError("No connected wallet found")
        else:
            self.provider = _ethers.providers.Web3Provider(ethereum)
            self.signer = self.provider.getSigner()
        WebBundlr = Bundlr.default
        self.bundlr = WebBundlr("https://devnet.bundlr.network", "matic", self.provider)
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
        else:
            self.provider = _ethers.providers.Web3Provider(ethereum)
            self.signer = self.provider.getSigner()

    @property
    def contract(self):
        if not _ethereum_available:
            raise ValueError("No connected wallet found")

        if not self._contract:
            self._contract = _ethers.Contract(manager.address, manager.abi, self.signer)

        return self._contract

    def register_ballot(self, ballot):
        try:
            tx = self.contract.createBallot(
                ballot.uuid,
                ballot.name,
                ballot.ends_at_timestamp,
                ballot.sismo_group_id,
                ballot.dkg_ritual_id,
                ballot.candidates,
                ballot.protocol_version,
            )
            receipt = tx.wait()
            return receipt.status == 1
        except Exception as e:
            return str(e)
    
    def all(self, obj_cls):
        try:
            items = self.contract.allBallots()
            return (obj_cls(**item) for item in items)
        except Exception as e:
            print(f"Failed to fetch ballots from Scroll smart contract: {e}")
            return []