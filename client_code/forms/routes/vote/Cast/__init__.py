import anvil
from anvil_extras import routing
from app import session
from app.model import Ballot, Vote
from app.services import encryption
from datetime import datetime

from ._anvil_designer import CastTemplate


@routing.route("vote/cast", url_keys=["ballot_id", "selection", "proof"])
class Cast(CastTemplate):
    def __init__(self, **properties):
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
        if datetime.utcnow() > self.vote.ballot.ends_at:
            self.cast_button.enabled = False
            anvil.Notification(
                message="The voting period has ended. You cannot cast a vote.",
                title="Voting period ended",
                icon="fa:exclamation-triangle",
                style="warning",
            ).show()
        else:
            session.ARWEAVE_STORE.cast_vote(self.vote.ballot, self.ciphertext)

    def cancel_button_click(self, **event_args):
        routing.set_url_hash("")
