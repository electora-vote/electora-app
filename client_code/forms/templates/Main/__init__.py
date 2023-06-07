import anvil.js
from anvil_extras import routing

from ._anvil_designer import MainTemplate


@routing.default_template
class Main(MainTemplate):
    def __init__(self, **properties):
        self.detail = None
        self.init_components(**properties)

    def show_detail(self, content):
        if self.detail:
            self.detail.remove_from_parent()
        self.add_component(content, slot="detail")
        self.detail = content
        if not anvil.js.window.isDetailPanelVisible():
            anvil.js.window.showDetailPanel()
