from ._anvil_designer import TemplateTemplate


class Template(TemplateTemplate):
    def __init__(self, **properties):
        self.init_components(**properties)
