from ._anvil_designer import IndexTemplate
from anvil_extras import routing
from app.model import Ballot
from app.formatters import FormattedBallot
from app import session
from .Template import Template

columns = [
    {"field": "uuid", "formatter": Template},
    {"field": "name", "visible": False},
    {"field": "formatted_ends_at", "visible": False},
]


@routing.route("ballots")
class Index(IndexTemplate):
    def __init__(self, **properties):
        self.refresh_tabulator()
        self.init_components(**properties)
        self.tabulator.options = session.tabulator_options
        self.tabulator.columns = columns

    def message_handler(self, message):
        self.refresh_tabulator()

    def refresh_tabulator(self):
        ballots = session.LOCAL_STORE.all(Ballot)
        self.tabulator.data = [FormattedBallot(b) for b in ballots]

    def tabulator_row_click(self, row, **event_args):
        model = row.get_model()
        routing.set_url_hash(f"ballot/uuid/{model.uuid}", item=model)

    def create_button_click(self, **event_args):
        routing.set_url_hash("ballot/create")

    def form_show(self, **event_args):
        self.refresh_tabulator()
