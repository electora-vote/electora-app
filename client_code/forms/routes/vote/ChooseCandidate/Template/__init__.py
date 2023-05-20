from ._anvil_designer import TemplateTemplate
from anvil import *

class Template(TemplateTemplate):
    def __init__(self, **properties):
        # Set Form properties and Data Bindings.
        self.init_components(**properties)

        # Any code you write here will run before the form opens.
