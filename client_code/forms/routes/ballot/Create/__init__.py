import anvil
from anvil_extras import routing
from app import session
from app.model import Ballot

from ._anvil_designer import CreateTemplate
from .Candidate import Candidate

columns = [
    {"field": "name"},
]


@routing.route("ballot/create")
class Create(CreateTemplate):
    def __init__(self, **properties):
        self.item = Ballot()
        self.init_components(**properties)
        self.tabulator.options = session.tabulator_options
        self.tabulator.options["use_model"] = False
        self.tabulator.columns = columns

    def refresh_tabulator(self):
        self.tabulator.data = [{"name": c} for c in self.item.candidates]
        self.refresh_data_bindings()

    def cancel_button_click(self, **event_args):
        routing.set_url_hash("")

    def create_button_click(self, **event_args):
        session.LOCAL_STORE.save(self.item)
        routing.set_url_hash(f"?ballot_id={self.item.uuid}")

    def add_candidate_button_click(self, **event_args):
        form = Candidate()
        response = anvil.alert(form)
        if response:
            self.item.candidates.append(form.item["name"])
            self.refresh_tabulator()
