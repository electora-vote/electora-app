from ._anvil_designer import ChooseCandidateTemplate
import anvil
from anvil.js import window
from anvil_extras import routing
from app.model import Ballot
from app import globals
from anvil.js.window import ethereum 

columns = [{"field": "name"}]


@routing.route("vote/choose/{ballot_id}", url_keys=["sismoConnectResponseCompressed"])
class ChooseCandidate(ChooseCandidateTemplate):
    def __init__(self, **properties):
        self.proof = self.url_dict["sismoConnectResponseCompressed"]
        uuid = self.dynamic_vars["ballot_id"]
        self.ballot = Ballot.get(uuid)
        self.selection = ""
        self.init_components(**properties)
        self.tabulator.data = [{"name": c} for c in self.ballot.candidates]
        self.tabulator.options = {"index": "name", "selectable": "highlight"}
        self.tabulator.columns = columns

    def tabulator_row_click(self, row, **event_args):
        self.selection = row.get_index()
        self.refresh_data_bindings()

    def vote_button_click(self, **event_args):
        kwargs = {"ballot_id": self.ballot.uuid, "selection": self.selection, "proof": self.proof}
        routing.set_url_hash(url_pattern="vote/cast", url_dict=kwargs)

    def encrypt_vote(self, proof, vote):
        encrypted_vote = anvil.server.call("encrypt_vote", proof, vote, self.ballot.ends_at.timestamp())
        return encrypted_vote

    def decrypt_vote(self, ciphertext):
        decrypted_vote = anvil.server.call("decrypt_vote", ciphertext, self.ballot.ends_at.timestamp())
        return decrypted_vote

    def submit_encrypted_vote(self, ciphertext):
        provider = globals.ethers.providers.Web3Provider(ethereum)
        signer = provider.getSigner()
        ballot_manager_contract = globals.ethers.Contract(globals.ballot_manager_address, globals.ballot_manager_abi, signer)
        ballot_manager_contract.vote(self.ballot.uuid, ciphertext)

    def cancel_button_click(self, **event_args):
        routing.set_url_hash("")


