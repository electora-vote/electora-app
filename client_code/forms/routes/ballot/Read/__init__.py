import anvil.js
from app.formatters import FormattedBallot
from app.services import proof

from ._anvil_designer import ReadTemplate


class Read(ReadTemplate):
    def __init__(self, ballot, **properties):
        self.ballot = ballot
        self.item = FormattedBallot(ballot)
        self.init_components(**properties)

    def hide_button_click(self, **event_args):
        anvil.get_open_form().remove_detail()

    def vote_button_click(self, **event_args):
        proof.prove_eligibility(self.ballot)
