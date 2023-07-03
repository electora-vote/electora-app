import anvil.js
import anvil.server
from app.services import storage

anvil.js.report_all_exceptions(True)


def tabulator_options():
    return {
        "index": "uuid",
        "use_model": True,
        "getter": getattr,
        "selectable": "highlight",
    }


LOCAL_STORE = storage.LocalStore()
ARWEAVE_STORE = storage.ArweaveStore()
SCROLL_STORE = storage.ScrollStore()
ORIGIN = anvil.server.get_app_origin()
SCROLL_RPC_URL = "https://alpha-rpc.scroll.io/l2"
