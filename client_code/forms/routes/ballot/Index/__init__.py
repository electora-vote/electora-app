import anvil
import anvil.js
from anvil_extras import routing
from app import session
class Ballot:
    def __init__(self, uuid, name, ends_at, sismo_group_id, dkg_ritual_id, candidates, protocol_version):
        self.uuid = uuid
        self.name = name
        self.ends_at = ends_at
        self.sismo_group_id = sismo_group_id
        self.dkg_ritual_id = dkg_ritual_id
        self.candidates = candidates
        self.protocol_version = protocol_version

    @property
    def status(self):
        return "Ended" if datetime.now() > self.ends_at else "Ongoing"
@routing.route("")
@routing.route("", url_keys=["ballot_id"])
@routing.route("", url_keys=["create_ballot"])
class Index(IndexTemplate):
    def __init__(self, **properties):
        self.ballots = []
        self.init_components(**properties)
        self.init_tabulator()

    def show_ballot(self, uuid):
        ballot = session.LOCAL_STORE.get(Ballot, uuid) or session.sync_ballot(
            session.SCROLL_STORE, session.LOCAL_STORE, uuid
        )
        if ballot:
            form = Read(ballot=ballot)
            anvil.get_open_form().show_detail(form)
        else:
            anvil.Notification(
                message="The ballot you are looking for does not exist",
                title="Ballot not found",
                icon="fa:exclamation-triangle",
                style="warning",
            class Template:
                def __init__(self, **properties):
                    self.init_components(**properties)
            
                def format(self, cell):
                    ballot = cell.get_value()
                    self.label_1.text = ballot.name
                    self.label_2.text = ballot.uuid
                    self.label_3.text = ballot.status
                    self.label_3.foreground = "red" if ballot.status == "Ended" else "green"
                    return self
    def refresh_tabulator(self):
        self.ballots = list(session.LOCAL_STORE.all(Ballot))
        self.tabulator.data = self.ballots
        self.refresh_data_bindings()

    def tabulator_row_click(self, row, **event_args):
        model = row.get_model()
        url_hash = f"?ballot_id={model.uuid}"
        cache_is_valid = (
            url_hash != routing.get_url_hash() or anvil.js.window.isDetailPanelVisible()
        )
        routing.set_url_hash(url_hash, load_from_cache=cache_is_valid)

    def create_button_click(self, **event_args):
        self.create_ballot()

    def form_show(self, **event_args):
        self.refresh_tabulator()
        if "ballot_id" in self.url_dict:
            self.show_ballot(self.url_dict["ballot_id"])
        elif "create_ballot" in self.url_dict:
            self.create_ballot()
