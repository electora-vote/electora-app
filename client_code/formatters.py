from app.model import Ballot

_datetime_format = "%Y-%m-%d %H:%M:%S"


class FormattedBallot(Ballot):
    def __init__(self, ballot, datetime_format=None):
        super().__init__(**ballot.__dict__)
        self.datetime_format = datetime_format or _datetime_format

    @property
    def formatted_ends_at(self):
        return self.ends_at.strftime(_datetime_format)

    @property
    def formatted_candidates(self):
        return "\n".join([c.title for c in self.candidates])
