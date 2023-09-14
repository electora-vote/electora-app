import anvil.js
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
        if dt.utcnow() > self.ballot.ends_at:
            self.vote_button.enabled = False
            self.status_label.text = "Ended"
        else:
            self.vote_button.enabled = True
            self.status_label.text = "Ongoing"
        self.update_status_color()

    def hide_button_click(self, **event_args):
        anvil.get_open_form().hide_detail()

    def vote_button_click(self, **event_args):
        proof.prove_eligibility(self.ballot)
    
    def update_status_color(self):
        if self.status_label.text == "Ended":
            self.status_label.foreground = "red"
        else:
            self.status_label.foreground = "green"
