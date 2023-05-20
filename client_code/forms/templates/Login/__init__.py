import anvil.users
from anvil_extras import routing
from app import globals

from ._anvil_designer import LoginTemplate


@routing.template("", priority=10, condition=globals.login_required)
class Login(LoginTemplate):
    def on_navigation(self, **url_args):
        raise routing.NavigationExit()

    def form_show(self, **event_args):
        user = anvil.users.login_with_form()
        if user is not None:
            globals.user = user
            routing.set_url_hash("")