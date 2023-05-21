from ._anvil_designer import CastTemplate
from anvil_extras import routing
import anvil
from app.model import Ballot
from app import globals, nucypher
from anvil.js.window import ethereum 


@routing.route("vote/cast", url_keys=["ballot_id", "selection", "proof"])
class Cast(CastTemplate):
    def __init__(self, **properties):
        self.item["contract"] = f"https://scrollexplorer.unifra.io/address/{globals.ballot_manager_address}"
        self.ballot = Ballot.get(key=self.url_dict["ballot_id"])
        self.selection = self.url_dict["selection"]
        self.proof = self.url_dict["proof"]
        self.encrypted_submission = nucypher.encrypt_vote(self.proof, self.selection, self.ballot.ends_at.timestamp())
        self.init_components(**properties)

    def submit_encrypted_vote(self):
        provider = globals.ethers.providers.Web3Provider(ethereum)
        signer = provider.getSigner()
        ballot_manager_contract = globals.ethers.Contract(globals.ballot_manager_address, globals.ballot_manager_abi, signer)
        ballot_manager_contract.vote(self.ballot.uuid, self.encrypted_submission)

    def cast_button_click(self, **event_args):
        self.submit_encrypted_vote()

    def cancel_button_click(self, **event_args):
        routing.set_url_hash("")


