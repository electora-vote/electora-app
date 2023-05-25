import datetime as dt
from uuid import uuid4

from anvil_extras.storage import indexed_db
from app import globals

_datetime_format = "%Y-%m-%d %H:%M:%S"


class Ballot:
    store = indexed_db.create_store("eu.electora.ballots")

    @classmethod
    def all(cls):
        items = cls.store.values()
        return [cls(**item) for item in items]

    @classmethod
    def get(cls, uuid):
        item = cls.store.get(uuid, None)
        return cls(**item) if item else None

    @classmethod
    def search(cls, search_term):
        item = cls.get(search_term)
        if item:
            return item
        else:
            return [item for item in cls.store.values() if item["name"] == search_term]

    def __init__(
        self,
        uuid=str(uuid4()),
        name="",
        ends_at=dt.datetime.now(),
        sismo_group_id="",
        dkg_ritual_id=0,
        storage_location="",
        protocol_version=1,
        candidates=None,
    ):
        self.uuid = uuid
        self.name = name
        self.ends_at = ends_at
        self.sismo_group_id = sismo_group_id
        self.dkg_ritual_id = dkg_ritual_id
        self.storage_location = storage_location
        self.protocol_version = protocol_version
        self.candidates = candidates or []

    @property
    def ends_at_display(self):
        return self.ends_at.strftime(_datetime_format)

    @property
    def candidates_display(self):
        return "\n".join(self.candidates)

    def save(self):
        self.store[self.uuid] = self.__dict__

    def add_candidate(self, candidate):
        self.candidates.append(candidate)

    def register(self):
        if not globals.ethereum_available:
            raise ValueError("No wallet available")

        provider = globals.ethers.providers.Web3Provider(globals.ethereum)
        signer = provider.getSigner()
        ballot_manager_contract = globals.ethers.Contract(
            globals.ballot_manager_address, globals.ballot_manager_abi, signer
        )
        ballot_manager_contract.createBallot(
            self.uuid,
            self.name,
            self.ends_at.timestamp(),
            self.sismo_group_id,
            self.dkg_ritual_id,
            self.storage_location,
            self.candidates,
            self.protocol_version,
        )
        self.save()
