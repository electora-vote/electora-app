import anvil.js
from app import session

sismo_client = anvil.js.import_from("@sismo-core/sismo-connect-client")
sismo_app_id = "0x022828235eed6dc1978b239bdd735bae"


def prove_eligibility(ballot, action):
    config = {
        "appId": sismo_app_id,
    }
    connection = sismo_client.SismoConnect({"config": config})

    routes = {
        "vote": f"{session.ORIGIN}/#vote/choose/{ballot.uuid}",
        "add_candidate": f"{session.ORIGIN}/#candidate/add/{ballot.uuid}",
    }
    callback = anvil.js.window.encodeURIComponent(routes[action])

    groups = {"vote": ballot.sismo_group_id, "add_candidate": ballot.candidate_group_id}
    request_config = {
        "callbackUrl": callback,
        "claims": [{"groupId": groups[action]}],
    }
    url = connection.getRequestLink(request_config)
    anvil.js.window.location.href = url
