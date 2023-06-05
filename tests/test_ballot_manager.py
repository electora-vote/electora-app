import ape
import pytest

@pytest.fixture(scope="module")
def ballot_manager(project, accounts):
    return project.BallotManager.deploy(sender=accounts[0]);

def test_create_ballot(ballot_manager, accounts):
    ballot_manager.createBallot('ballot_id', 'test_sismo_id', ['test_candidate', 'canidate2'], sender=accounts[0])
    assert ballot_manager.getSismoGroupID('ballot_id') == 'test_sismo_id'
    assert ballot_manager.getCandidates('ballot_id') == ['test_candidate', 'canidate2']
