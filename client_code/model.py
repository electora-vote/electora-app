from anvil_extras import persistence

_datetime_format = "%Y-%m-%d %H:%M:%S"


@persistence.persisted_class
class Ballot:
    key = "uuid"

    @property
    def ends_at_display(self):
        return self.ends_at.strftime(_datetime_format)

    @property
    def candidates_display(self):
        return "\n".join(self.candidates)