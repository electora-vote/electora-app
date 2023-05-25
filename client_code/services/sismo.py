from app import globals
from anvil.js import window
from app.model import Ballot


def prove_eligibility(ballot_id):
    ballot = Ballot.get(key=ballot_id)
    connection = globals.sismo_client.SismoConnect({"appId": globals.sismo_app_id})
    callback = window.encodeURIComponent(f"{globals.origin}/#vote/choose/{ballot_id}")
    request_config = {
        "callbackUrl": callback,
        "claims": [{"groupId": ballot.sismo_group_id}],
    }
    url = connection.getRequestLink(request_config)
    window.location.href = url
