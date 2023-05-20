from ._anvil_designer import CreateTemplate
from anvil_extras import routing
from app.model import Ballot
from app.globals import publisher


@routing.route("ballot/create")
class Create(CreateTemplate):
    def __init__(self, **properties):
        self.item = Ballot()
        self.init_components(**properties)

    def cancel_button_click(self, **event_args):
        routing.set_url_hash("")

    def create_button_click(self, **event_args):
        self.item.add()
        publisher.publish("ballots", "ballot.created")
        routing.set_url_hash("")


