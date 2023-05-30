import ape
import pytest


@pytest.fixture(scope="module")
def ballot_manager(project, accounts):
    return project.BallotManager.deploy(sender=accounts[0])


def test_create_ballot(ballot_manager, accounts):
    ballot_manager.createBallot(
        "ballot_id",
        1234,
        "test_sismo_id",
        1,
        "test_storage_location",
        ["test_candidate", "canidate2"],
        1,
        sender=accounts[0],
    )
    assert ballot_manager.getSismoGroupID("ballot_id") == "test_sismo_id"
    assert ballot_manager.getCandidates("ballot_id") == ["test_candidate", "canidate2"]
