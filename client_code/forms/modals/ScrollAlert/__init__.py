from ._anvil_designer import ScrollAlertTemplate


class ScrollAlert(ScrollAlertTemplate):
    def __init__(self, **properties):
        self.init_components(**properties)
