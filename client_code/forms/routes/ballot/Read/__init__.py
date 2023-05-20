from ._anvil_designer import ReadTemplate
from anvil_extras import routing
from app.model import Ballot



@routing.route("ballot/uuid/{uuid}")
class Read(ReadTemplate):
    def __init__(self, **properties):
        uuid = self.dynamic_vars["uuid"]
        self.item = Ballot.get(key=uuid)
        self.init_components(**properties)

    def done_button_click(self, **event_args):
        routing.set_url_hash("")
