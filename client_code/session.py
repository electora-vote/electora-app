import anvil.js
import anvil.server
from app.services import storage
import datetime as dt

anvil.js.report_all_exceptions(True)


def tabulator_options():
    return {
        "index": "uuid",
        "use_model": True,
        "getter": getattr,
        "selectable": "highlight",
    }


LOCAL_STORE = storage.LocalStore()
ONCHAIN_STORE = storage.OnChainStore()
ORIGIN = anvil.server.get_app_origin()
SCROLL_RPC_URL = "https://alpha-rpc.scroll.io/l2"


def test_electora_ts():
    electora_ts = anvil.js.import_from("electora-ts")
    now = dt.datetime.now()

    conditions = electora_ts.getConditions(now)
    assert conditions["method"] == "timelock"
    assert conditions["returnValueTest"]["comparator"] == ">="
    assert conditions["returnValueTest"]["value"] == now

    encrypted_vote = electora_ts.encryptVote("my_proof", "my_vote", now)
    assert encrypted_vote == "my_proofmy_vote"

    decrypted_vote = electora_ts.decryptVote("my_vote", now)
    assert decrypted_vote == "my_vote"
    print("electora-ts tests passed ok")


test_electora_ts()
