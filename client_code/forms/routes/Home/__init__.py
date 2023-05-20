from ._anvil_designer import HomeTemplate
import anvil
import anvil.users
from anvil_extras import routing
from app.forms.modals.BallotId import BallotId
from app import globals


@routing.route("")
class Home(HomeTemplate):
    def __init__(self, **properties):
        self.init_components(**properties)
        
    def vote_button_click(self, **event_args):
        form = BallotId()
        response = anvil.alert(form)
        if response:
            routing.set_url_hash(f"vote/choose/{form.item}")

    def ballot_button_click(self, **event_args):
        user = anvil.users.login_with_form()
        if user is not None:
            globals.user = user
            routing.set_url_hash("ballots")
