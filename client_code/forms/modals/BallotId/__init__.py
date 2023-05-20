from ._anvil_designer import BallotIdTemplate


class BallotId(BallotIdTemplate):
    def __init__(self, **properties):
        self.item = ""
        self.init_components(**properties)
