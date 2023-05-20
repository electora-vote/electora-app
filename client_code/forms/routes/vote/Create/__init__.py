from ._anvil_designer import CreateTemplate
import anvil
from anvil_extras import routing
from app.model import Ballot
from app import globals

columns = [{"field": "name"}]


@routing.route("vote/{ballot_id}")
class Create(CreateTemplate):
    def __init__(self, **properties):
        uuid = self.dynamic_vars["ballot_id"]
        self.ballot = Ballot.get(uuid)
        self.selection = ""
        if not self.ballot.uuid:
            anvil.alert("No valid ballot found with that id.")
            routing.route("")

        self.init_components(**properties)
        self.tabulator.data = [{"name": c} for c in self.ballot.candidates]
        self.tabulator.options = {"index": "name", "selectable": "highlight"}
        self.tabulator.columns = columns

    def tabulator_row_click(self, row, **event_args):
        self.selection = row.get_index()
        self.refresh_data_bindings()

    def vote_button_click(self, **event_args):
        anvil.alert(f"Not implemented yet. ({self.selection})")

    def cancel_button_click(self, **event_args):
        routing.set_url_hash("")


