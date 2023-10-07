import anvil.js
from app import session
from app.formatters import FormattedBallot
from app.services import proof, manager

from ._anvil_designer import ReadTemplate


class Read(ReadTemplate):
    def __init__(self, ballot, **properties):
        self.ballot = ballot
        self.item = FormattedBallot(ballot)
        self.explorer_link.url = (
            f"https://blockscout.scroll.io/address/{manager.address}"
        )
        self.init_components(**properties)

    def hide_button_click(self, **event_args):
        anvil.get_open_form().hide_detail()

    def vote_button_click(self, **event_args):
        proof.prove_eligibility(self.ballot, "vote")

    def sync_button_click(self, **event_args):
        self.ballot = session.sync_ballot(
            session.SCROLL_STORE, session.LOCAL_STORE, self.item.uuid
        )
        self.item = FormattedBallot(self.ballot)
        self.refresh_data_bindings()

    def add_candidate_button_click(self, **event_args):
        proof.prove_eligibility(self.ballot, "add_candidate")
