from ._anvil_designer import CastTemplate
from anvil_extras import routing
import anvil
from app.model import Ballot
from app import globals


@routing.route("cast/{ballot_id}/{selection}", url_keys=["sismoConnectResponseCompressed"])
class Cast(CastTemplate):
    def __init__(self, **properties):
        self.item["proof"] = self.url_dict["sismoConnectResponseCompressed"]
        self.item["selection"] = self.dynamic_vars["selection"]
        self.item["contract"] = f"https://scrollexplorer.unifra.io/address/{globals.ballot_manager_address}"
        self.ballot = Ballot.get(key=self.dynamic_vars["ballot_id"])
        self.init_components(**properties)

    def cast_button_click(self, **event_args):
        anvil.alert("Not implemented yet.")


