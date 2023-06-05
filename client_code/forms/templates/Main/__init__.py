import anvil.js
from anvil_extras import routing
from app import session

from ._anvil_designer import MainTemplate


@routing.default_template
class Main(MainTemplate):
    def __init__(self, **properties):
        session.PUBLISHER.subscribe(
            channel="detail", subscriber=self, handler=self.message_handler
        )
        self.detail = None
        self.init_components(**properties)

    def message_handler(self, message):
        if message.title == "show":
            self.show_detail(message.content)
        if message.title == "hide":
            self.hide_detail()

    def show_detail(self, content):
        if self.detail:
            self.detail.remove_from_parent()
        self.add_component(content, slot="detail")
        self.detail = content
        if not anvil.js.window.isDetailPanelVisible():
            anvil.js.window.showDetailPanel()

    def hide_detail(self):
        anvil.js.window.hideDetailPanel()
