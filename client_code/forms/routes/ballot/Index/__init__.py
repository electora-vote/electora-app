import anvil
import anvil.js
from anvil_extras import routing
from app import session
from app.model import Ballot

from ..Create import Create
from ..Read import Read
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
        ballot = session.LOCAL_STORE.get(Ballot, uuid) or session.sync_ballot(
            session.SCROLL_STORE, session.LOCAL_STORE, uuid
        )
        if ballot:
            form = Read(ballot=ballot)
            anvil.get_open_form().show_detail(form)
        else:
            anvil.Notification(
                message="The ballot you are looking for does not exist",
                title="Ballot not found",
                style="warning",
            ).show()

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
        url_hash = f"?ballot_id={model.uuid}"
        cache_is_valid = (
            url_hash != routing.get_url_hash() or anvil.js.window.isDetailPanelVisible()
        )
        routing.set_url_hash(url_hash, load_from_cache=cache_is_valid)

    def create_button_click(self, **event_args):
        self.create_ballot()

    def form_show(self, **event_args):
        self.refresh_tabulator()
        if "ballot_id" in self.url_dict:
            self.show_ballot(self.url_dict["ballot_id"])
        elif "create_ballot" in self.url_dict:
            self.create_ballot()
