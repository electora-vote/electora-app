from anvil_extras import routing
from app import session
from app.model import Ballot, Vote
from app.services import encryption

from ._anvil_designer import CastTemplate


@routing.route("vote/cast", url_keys=["ballot_id", "selection", "proof"])
class Cast(CastTemplate):
    def __init__(self, **properties):
        self.contract = session.ONCHAIN_STORE.url
        self.vote = Vote(
            ballot=session.LOCAL_STORE.get(Ballot, self.url_dict["ballot_id"]),
            selection=self.url_dict["selection"],
            proof=self.url_dict["proof"],
        )
        self.ciphertext = encryption.encrypt_vote(
            self.vote.proof, self.vote.selection, self.vote.ballot.ends_at.timestamp()
        )
        self.init_components(**properties)

    def cast_button_click(self, **event_args):
        session.ONCHAIN_STORE.cast_vote(self.vote.ballot, self.ciphertext)

    def cancel_button_click(self, **event_args):
        routing.set_url_hash("")
