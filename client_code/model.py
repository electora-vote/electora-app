import datetime as dt
from uuid import uuid4
from app.services import encryption


class Ballot:
    key = "uuid"

    def __init__(
        self,
        uuid=uuid4().hex,
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

    def keys(self):
        return self.__dict__.keys()

    def __getitem__(self, key):
        return getattr(self, key)


class Vote:
    def __init__(self, ballot, proof, selection=None):
        self.ballot = ballot
        self.proof = proof
        self.selection = selection
