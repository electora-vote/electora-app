from app import globals
from anvil.js import window
from app.model import Ballot


def prove_eligibility(ballot_id):
    ballot = Ballot.get(key=ballot_id)
    connection = globals.sismo_client.SismoConnect({"appId": globals.sismo_app_id})
    callback = f"{globals.origin}/#vote/choose/{ballot_id}"
    request_config = {
        "callbackUrl": window.encodeURIComponent(callback),
    }
    _claims = [ballot.sismo_group_id]
    request_config["claims"] = [{"groupId": claim} for claim in _claims]
    url = connection.getRequestLink(request_config)
    window.location.href=url