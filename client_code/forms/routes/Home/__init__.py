import anvil
from anvil_extras import routing
from app import session
from app.forms.modals.BallotId import BallotId
from app.model import Ballot
from app.services import proof

from ._anvil_designer import HomeTemplate


@routing.route("")
class Home(HomeTemplate):
    def __init__(self, **properties):
        self.init_components(**properties)

    def vote_button_click(self, **event_args):
        form = BallotId()
        response = anvil.alert(form)
        if response:
            ballot = session.LOCAL_STORE.get(Ballot, form.item)
            if ballot.uuid:
                proof.prove_eligibility(ballot)
            else:
                anvil.alert("No valid ballot found with that id.")
                routing.route("")

    def ballot_button_click(self, **event_args):
        routing.set_url_hash("ballots")
