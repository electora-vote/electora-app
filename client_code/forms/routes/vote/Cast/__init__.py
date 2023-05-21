from ._anvil_designer import CastTemplate
from anvil_extras import routing
import anvil
from app.model import Ballot
from app import globals


@routing.route("vote/cast", url_keys=["ballot_id", "selection", "proof"])
class Cast(CastTemplate):
    def __init__(self, **properties):
        self.item["contract"] = f"https://scrollexplorer.unifra.io/address/{globals.ballot_manager_address}"
        self.ballot = Ballot.get(key=self.url_dict["ballot_id"])
        self.selection = self.url_dict["selection"]
        self.proof = self.url_dict["proof"]
        self.init_components(**properties)

    def cast_button_click(self, **event_args):
        anvil.alert("Not implemented yet.")


