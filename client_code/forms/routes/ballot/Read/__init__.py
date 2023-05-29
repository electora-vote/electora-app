from ._anvil_designer import ReadTemplate
from anvil_extras import routing
from app.model import Ballot
from app.formatters import FormattedBallot
from app import session
import anvil


@routing.route("ballot/uuid/{uuid}")
class Read(ReadTemplate):
    def __init__(self, **properties):
        uuid = self.dynamic_vars["uuid"]
        ballot = session.LOCAL_STORE.get(Ballot, uuid)
        self.item = FormattedBallot(ballot)
        self.init_components(**properties)

    def done_button_click(self, **event_args):
        routing.set_url_hash("ballots")

    def count_button_click(self, **event_args):
        anvil.alert(
            "Nope. Sorry. We didn't get this done in time for the ETHDam judging!"
        )
