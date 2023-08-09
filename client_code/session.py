import anvil
import anvil.js
import anvil.server
from app.services import storage
from app.model import Ballot

anvil.js.report_all_exceptions(True)


def tabulator_options():
    return {
        "index": "uuid",
        "use_model": True,
        "getter": getattr,
        "selectable": "highlight",
    }


def sync_storage(scroll_store, local_store):
    scroll_ballots = scroll_store.all()
    local_ballots = local_store.all(Ballot)
    for ballot in scroll_ballots:
        if ballot.uuid not in [b.uuid for b in local_ballots]:
            local_store.save(ballot)


def sync_ballot(scroll_store, local_store, ballot_id):
    local_ballots = local_store.all(Ballot)
    if ballot_id not in [b.uuid for b in local_ballots]:
        try:
            ballot = scroll_store.get_ballot(ballot_id)
            local_store.save(ballot)
            return ballot
        except Exception as e:
            anvil.alert(e)


LOCAL_STORE = storage.LocalStore()
ARWEAVE_STORE = storage.ArweaveStore()
SCROLL_STORE = storage.ScrollStore()
ORIGIN = anvil.server.get_app_origin()
SCROLL_RPC_URL = "https://alpha-rpc.scroll.io/l2"
