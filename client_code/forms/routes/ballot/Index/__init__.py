from anvil_extras import routing
from app import session
from app.model import Ballot
import anvil.js
import anvil

from ..Read import Read
from ..Create import Create
from ._anvil_designer import IndexTemplate
from .Template import Template

columns = [
    {"field": "uuid", "formatter": Template},
    {"field": "name", "visible": False},
]


@routing.route("")
@routing.route("", url_keys=["ballot_id"])
@routing.route("", url_keys=["create_ballot"])
class Index(IndexTemplate):
    def __init__(self, **properties):
        self.ballots = []
        self.init_components(**properties)
        self.init_tabulator()

    def show_ballot(self, uuid):
        ballot = session.LOCAL_STORE.get(Ballot, uuid)
        form = Read(ballot=ballot)
        anvil.get_open_form().show_detail(form)

    def create_ballot(self):
        form = Create()
        anvil.get_open_form().show_detail(form)

    def init_tabulator(self):
        self.tabulator.options = session.tabulator_options()
        self.tabulator.columns = columns

    def refresh_tabulator(self):
        self.ballots = list(session.LOCAL_STORE.all(Ballot))
        self.tabulator.data = self.ballots
        self.refresh_data_bindings()

    def tabulator_row_click(self, row, **event_args):
        model = row.get_model()
        routing.set_url_hash(f"?ballot_id={model.uuid}")

    def create_button_click(self, **event_args):
        self.create_ballot()

    def form_show(self, **event_args):
        self.refresh_tabulator()
        if "ballot_id" in self.url_dict:
            self.show_ballot(self.url_dict["ballot_id"])
        if "create_ballot" in self.url_dict:
            self.create_ballot()
