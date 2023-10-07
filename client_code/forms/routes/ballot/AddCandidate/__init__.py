from anvil_extras import routing
from app.model import Ballot, Candidate
from app import session
from ._anvil_designer import AddCandidateTemplate


@routing.route("candidate/add/{ballot_id}", url_keys=["sismoConnectResponseCompressed"])
class AddCandidate(AddCandidateTemplate):
    def __init__(self, **properties):
        uuid = self.dynamic_vars["ballot_id"]
        self.ballot = session.LOCAL_STORE.get(Ballot, uuid)
        self.item = Candidate()
        self.init_components(**properties)

    def add_button_click(self, **event_args):
        session.SCROLL_STORE.add_candidate(self.ballot, self.item)
        session.sync_ballot(session.SCROLL_STORE, session.LOCAL_STORE, self.ballot.uuid)
        routing.set_url_hash(f"?ballot_id={self.ballot.uuid}")

    def cancel_button_click(self, **event_args):
        routing.set_url_hash("")
