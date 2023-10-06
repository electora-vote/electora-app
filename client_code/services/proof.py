import anvil.js
from app import session

sismo_client = anvil.js.import_from("@sismo-core/sismo-connect-client")
sismo_app_id = "0x022828235eed6dc1978b239bdd735bae"


def prove_eligibility(ballot):
    config = {
        "appId": sismo_app_id,
        "vault": {
            "impersonate": [
                "github:theref:4128101",
            ]
        },
    }
    connection = sismo_client.SismoConnect({"config": config})
    callback = anvil.js.window.encodeURIComponent(
        f"{session.ORIGIN}/#vote/choose/{ballot.uuid}"
    )
    request_config = {
        "callbackUrl": callback,
        "claims": [{"groupId": ballot.sismo_group_id}],
    }
    url = connection.getRequestLink(request_config)
    anvil.js.window.location.href = url
