import datetime as dt
from uuid import uuid4
from datetime import datetime


class Ballot:
    key = "uuid"

    def __init__(
        self,
        uuid=uuid4().hex,
        name="",
        ends_at=dt.datetime.now(),
        sismo_group_id="",
        dkg_ritual_id=0,
        candidates=None,
        protocol_version=1,
    ):
        self.uuid = uuid
        self.name = name
        self.ends_at = ends_at
        self.sismo_group_id = sismo_group_id
        self.dkg_ritual_id = dkg_ritual_id
        self.candidates = candidates or []
        self.protocol_version = protocol_version

    @property
    def ends_at_timestamp(self):
        return int(self.ends_at.timestamp())

    def __eq__(self, other):
        return isinstance(other, Ballot) and self.uuid == other.uuid

    def __hash__(self):
        return hash(self.uuid)

    def get_status(self):
        return "Ended" if datetime.utcnow() > self.ends_at else "Ongoing"


class Vote:
    def __init__(self, ballot, proof, selection=None):
        self.ballot = ballot
        self.proof = proof
        self.selection = selection
