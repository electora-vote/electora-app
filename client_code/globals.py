import anvil.js

anvil.js.report_all_exceptions(True)

sismo_client = anvil.js.import_from("@sismo-core/sismo-connect-client")
user = None
tabulator_options = {
    "index": "uuid",
    "use_model": True,
    "getter": getattr,
    "selectable": "highlight",
}


def login_required():
    return user is None