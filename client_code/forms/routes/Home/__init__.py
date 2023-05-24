from ._anvil_designer import HomeTemplate
import anvil
from anvil_extras import routing
from app.forms.modals.BallotId import BallotId
from app import globals
from app.services import sismo
from app.model import Ballot


@routing.route("")
class Home(HomeTemplate):
    def __init__(self, **properties):
        self.init_components(**properties)

    def vote_button_click(self, **event_args):
        form = BallotId()
        response = anvil.alert(form)
        if response:
            ballot = Ballot.get(key=form.item)
            if ballot.uuid:
                sismo.prove_eligibility(form.item)
            else:
                anvil.alert("No valid ballot found with that id.")
                routing.route("")

    def ballot_button_click(self, **event_args):
        routing.set_url_hash("ballots")
