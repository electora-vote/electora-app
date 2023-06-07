import anvil.js
from app import session

sismo_client = anvil.js.import_from("@sismo-core/sismo-connect-client")
sismo_app_id = "0x022828235eed6dc1978b239bdd735bae"


def prove_eligibility(ballot):
    connection = sismo_client.SismoConnect({"appId": sismo_app_id})
    callback = anvil.js.window.encodeURIComponent(
        f"{session.origin}/#vote/choose/{ballot.uuid}"
    )
    request_config = {
        "callbackUrl": callback,
        "claims": [{"groupId": ballot.sismo_group_id}],
    }
    url = connection.getRequestLink(request_config)
    anvil.js.window.location.href = url
