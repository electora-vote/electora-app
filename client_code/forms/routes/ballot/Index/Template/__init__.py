from ._anvil_designer import TemplateTemplate


class Template(TemplateTemplate):
    def __init__(self, item, **properties):
        self.item = item
        self.init_components(**properties)
