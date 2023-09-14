import anvil.js
class Ballot:
    def __init__(self, uuid, ends_at):
        self.uuid = uuid
        self.ends_at = ends_at

    @property
    def is_open(self):
        return datetime.datetime.now() < self.ends_at
class Read(ReadTemplate):
    def __init__(self, ballot, **properties):
        self.ballot = ballot
        self.item = FormattedBallot(ballot)
        self.explorer_link.url = (
            f"https://blockscout.scroll.io/address/{manager.address}"
        )
        self.init_components(**properties)
        self.update_status()

    def hide_button_click(self, **event_args):
        anvil.get_open_form().hide_detail()

    def vote_button_click(self, **event_args):
        proof.prove_eligibility(self.ballot)

    def update_status(self):
        if not self.ballot.is_open:
            self.vote_button.enabled = False
            self.status_label.text = "Ballot has ended"
            self.status_label.foreground = "#FF0000"  # Red color
        else:
            self.vote_button.enabled = True
            self.status_label.text = "Ballot is open"
            self.status_label.foreground = "#008000"  # Green color
