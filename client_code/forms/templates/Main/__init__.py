import anvil
import anvil.js
from anvil_extras import routing
from app.forms.modals.ScrollAlert import ScrollAlert

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

    def hide_detail(self):
        if self.detail:
            self.detail.remove_from_parent()
        self.detail = None
        anvil.js.window.hideDetailPanel()

    def on_form_load(self, url_hash, url_pattern, url_dict, form):
        if not url_hash and not url_dict:
            anvil.alert(content=ScrollAlert())
