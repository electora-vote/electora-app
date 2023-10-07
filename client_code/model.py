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
        candidate_group_id="",
        dkg_ritual_id=0,
        candidates=None,
        protocol_version=1,
    ):
        self.uuid = uuid
        self.name = name
        self.ends_at = ends_at
        self.sismo_group_id = sismo_group_id
        self.candidate_group_id = candidate_group_id
        self.dkg_ritual_id = dkg_ritual_id
        self.candidates = candidates or []
        self.protocol_version = protocol_version

    @classmethod
    def _deserialise(cls, attributes):
        candidates = [Candidate(**c) for c in attributes.pop("candidates")]
        ballot = cls(**attributes)
        ballot.candidates = candidates
        return ballot

    @property
    def ends_at_timestamp(self):
        return int(self.ends_at.timestamp())

    def __eq__(self, other):
        return isinstance(other, Ballot) and self.uuid == other.uuid

    def __hash__(self):
        return hash(self.uuid)

    def _serialise(self):
        serialised = self.__dict__
        serialised["candidates"] = [c._serialise() for c in serialised["candidates"]]
        return serialised

    def add_candidate(self, candidate):
        self.candidates.append(candidate)


class Candidate:
    def __init__(self, title="", description="", proof="", invoice=""):
        self.title = title
        self.description = description
        self.proof = proof
        self.invoice = invoice

    def _serialise(self):
        return self.__dict__


class Vote:
    def __init__(self, ballot, proof, selection=None):
        self.ballot = ballot
        self.proof = proof
        self.selection = selection
