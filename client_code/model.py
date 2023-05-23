from anvil_extras import persistence
from app import globals

_datetime_format = "%Y-%m-%d %H:%M:%S"


@persistence.persisted_class
class Ballot:
    key = "uuid"

    @property
    def ends_at_display(self):
        return self.ends_at.strftime(_datetime_format)

    @property
    def candidates_display(self):
        return "\n".join(self.candidates)

    def create(self):
        if globals.ethereum:
            provider = globals.ethers.providers.Web3Provider(globals.ethereum)
            signer = provider.getSigner()
            ballot_manager_contract = globals.ethers.Contract(
                globals.ballot_manager_address, globals.ballot_manager_abi, signer
            )
            ballot_manager_contract.createBallot(
                self.uuid,
                self.name,
                self.ends_at.timestamp(),
                self.sismo_group_id,
                self.storage_location,
                self.candidates,
                self.protocol_version,
            )
