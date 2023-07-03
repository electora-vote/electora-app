import datetime as dt
from uuid import uuid4


class Ballot:
    key = "uuid"

    def __init__(
        self,
        uuid=uuid4().hex,
        name="",
        ends_at=dt.datetime.now(),
        sismo_group_id="",
        dkg_ritual_id=0,
        protocol_version=1,
        candidates=None,
    ):
        self.uuid = uuid
        self.name = name
        self.ends_at = ends_at
        self.sismo_group_id = sismo_group_id
        self.dkg_ritual_id = dkg_ritual_id
        self.candidates = candidates or []
        self.protocol_version = protocol_version

    def ends_at_timestamp(self):
        return int(self.ends_at.timestamp())


class Vote:
    def __init__(self, ballot, proof, selection=None):
        self.ballot = ballot
        self.proof = proof
        self.selection = selection
