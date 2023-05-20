from ._anvil_designer import LandingTemplate
from anvil_extras import routing
from app import globals


@routing.template("", priority=10, condition=globals.user_logged_in)
class Landing(LandingTemplate):
    def __init__(self, **properties):
        self.init_components(**properties)
