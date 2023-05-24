from ._anvil_designer import ReadTemplate
from anvil_extras import routing
from app.model import Ballot
import anvil


@routing.route("ballot/uuid/{uuid}")
class Read(ReadTemplate):
    def __init__(self, **properties):
        uuid = self.dynamic_vars["uuid"]
        self.item = Ballot.get(uuid)
        self.init_components(**properties)

    def done_button_click(self, **event_args):
        routing.set_url_hash("ballots")

    def count_button_click(self, **event_args):
        anvil.alert(
            "Nope. Sorry. We didn't get this done in time for the ETHDam judging!"
        )
