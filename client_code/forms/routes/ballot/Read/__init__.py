import anvil.js
from app.formatters import FormattedBallot
from app.services import proof, manager
from datetime import datetime

from ._anvil_designer import ReadTemplate


class Read(ReadTemplate):
    def __init__(self, ballot, **properties):
        self.ballot = ballot
        self.item = FormattedBallot(ballot)
        self.status = self.get_ballot_status()
        self.explorer_link.url = (
            f"https://blockscout.scroll.io/address/{manager.address}"
        )
        self.init_components(**properties)
        self.status_label.text = self.status
        self.status_label.foreground = "red" if self.status == "Ended" else "green"

    def get_ballot_status(self):
        return "Ended" if datetime.utcnow() > self.ballot.ends_at else "Ongoing"

    def hide_button_click(self, **event_args):
        anvil.get_open_form().hide_detail()

    def vote_button_click(self, **event_args):
        proof.prove_eligibility(self.ballot)
