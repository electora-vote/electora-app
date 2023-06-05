import anvil.js
import anvil.server
from anvil_extras import messaging
from app.services import storage

anvil.js.report_all_exceptions(True)
scroll_rpc_url = "https://alpha-rpc.scroll.io/l2"

origin = anvil.server.get_app_origin()
tabulator_options = {
    "index": "uuid",
    "use_model": True,
    "getter": getattr,
    "selectable": "highlight",
}
LOCAL_STORE = storage.LocalStore()
ONCHAIN_STORE = storage.OnChainStore()
PUBLISHER = messaging.Publisher(with_logging=False)
