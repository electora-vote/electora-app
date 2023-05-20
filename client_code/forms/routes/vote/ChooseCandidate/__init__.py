from ._anvil_designer import ChooseCandidateTemplate
import anvil
from anvil.js import window
from anvil_extras import routing
from app.model import Ballot
from app import globals

columns = [{"field": "name"}]


@routing.route("vote/choose/{ballot_id}")
class ChooseCandidate(ChooseCandidateTemplate):
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
        connection = globals.sismo_client.SismoConnect({"appId": globals.sismo_app_id})
        callback = f"{globals.origin}/#cast/{self.ballot.uuid}/{self.selection}"
        request_config = {
            "callbackUrl": window.encodeURIComponent(callback),
        }
        _claims = [self.ballot.sismo_group_id]
        request_config["claims"] = [{"groupId": claim} for claim in _claims]
        url = connection.getRequestLink(request_config)
        window.location.href=url

    def cancel_button_click(self, **event_args):
        routing.set_url_hash("")


