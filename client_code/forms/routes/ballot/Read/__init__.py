import anvil.js
from app.formatters import FormattedBallot
from app.services import proof, manager

from ._anvil_designer import ReadTemplate, status_label


class Read(ReadTemplate):
    def __init__(self, ballot, **properties):
        self.ballot = ballot
        self.item = FormattedBallot(ballot)
        self.explorer_link.url = (
            f"https://blockscout.scroll.io/address/{manager.address}"
        )
        self.init_components(**properties)
        self.vote_button.enabled = not self.ballot.has_ended()
        if self.ballot.has_ended():
            self.status_label.text = "Ended"
            self.status_label.foreground = "#FF0000"  # Red color
        else:
            self.status_label.text = "Ongoing"
            self.status_label.foreground = "#008000"  # Green color

    def hide_button_click(self, **event_args):
        anvil.get_open_form().hide_detail()

    def vote_button_click(self, **event_args):
        proof.prove_eligibility(self.ballot)
