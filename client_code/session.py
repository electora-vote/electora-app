import anvil.js
import anvil.server
from app.services import storage

anvil.js.report_all_exceptions(True)
scroll_rpc_url = "https://alpha-rpc.scroll.io/l2"

ORIGIN = anvil.server.get_app_origin()


def tabulator_options():
    return {
        "index": "uuid",
        "use_model": True,
        "getter": getattr,
        "selectable": "highlight",
    }


LOCAL_STORE = storage.LocalStore()
ONCHAIN_STORE = storage.OnChainStore()