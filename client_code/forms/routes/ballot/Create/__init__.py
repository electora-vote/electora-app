import anvil
from anvil_extras import routing
from app import globals
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
        self.candidates = []
        self.init_components(**properties)
        self.tabulator.data = self.candidates
        self.tabulator.options = globals.tabulator_options
        self.tabulator.options["use_model"] = False
        self.tabulator.columns = columns

    def cancel_button_click(self, **event_args):
        routing.set_url_hash("")

    def create_button_click(self, **event_args):
        self.item.candidates = [c["name"] for c in self.candidates]
        self.item.add()
        self.item.create()
        routing.set_url_hash("ballots")

    def add_candidate_button_click(self, **event_args):
        form = Candidate()
        response = anvil.alert(form)
        if response:
            self.candidates.append(form.item)
            self.tabulator.data = self.candidates
