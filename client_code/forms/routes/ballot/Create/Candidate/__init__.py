from ._anvil_designer import CandidateTemplate


class Candidate(CandidateTemplate):
    def __init__(self, **properties):
        self.item = {"name": ""}
        self.init_components(**properties)
