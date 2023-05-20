from ._anvil_designer import CreateTemplate
import anvil
from anvil_extras import routing
from app.model import Ballot


@routing.route("vote/{ballot_id}")
class Create(CreateTemplate):
    def __init__(self, **properties):
        uuid = self.dynamic_vars["ballot_id"]
        self.ballot = Ballot.get(uuid)
        self.init_components(**properties)

    def form_show(self, **event_arg):
        if not self.ballot.uuid:
            anvil.alert("No valid ballot found with that id.")
            routing.route("")
