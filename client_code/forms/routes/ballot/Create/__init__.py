import anvil
from anvil_extras import routing
from app import session
from app.model import Ballot

from ._anvil_designer import CreateTemplate


@routing.route("ballot/create")
class Create(CreateTemplate):
    def __init__(self, **properties):
        self.item = Ballot()
        self.init_components(**properties)

    def cancel_button_click(self, **event_args):
        anvil.get_open_form().hide_detail()
        routing.set_url_hash("")

    def create_button_click(self, **event_args):
        result = session.SCROLL_STORE.register_ballot(self.item)
        if result is True:
            session.LOCAL_STORE.save(self.item)
            routing.set_url_hash(f"?ballot_id={self.item.uuid}")
        else:
            anvil.alert(result)
