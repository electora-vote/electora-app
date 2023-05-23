from uuid import uuid4

import anvil.server
from anvil.tables import app_tables

from . import _nucypher


@anvil.server.callable
def search_ballot(*args, **kwargs):
    return app_tables.ballot.search(*args, **kwargs)


@anvil.server.callable
def add_ballot(attrs):
    return app_tables.ballot.add_row(uuid=str(uuid4()), **attrs)


@anvil.server.callable
def get_ballot(attrs):
    return app_tables.ballot.get(uuid=attrs["uuid"])


@anvil.server.callable
def encrypt_vote(proof, vote, timestamp):
    return _nucypher.encrypt_vote(proof, vote, timestamp)


@anvil.server.callable
def decrypt_vote(ciphertext, timestamp):
    return _nucypher.decrypt_vote(ciphertext, timestamp)
