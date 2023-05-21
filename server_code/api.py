import anvil.server
from anvil.tables import app_tables, query
from uuid import uuid4


@anvil.server.callable
def search_ballot(*args, **kwargs):
    return app_tables.ballot.search(*args, **kwargs)
   

@anvil.server.callable
def add_ballot(attrs):
    return app_tables.ballot.add_row(uuid=str(uuid4()), **attrs)


@anvil.server.callable
def get_ballot(attrs):
    return app_tables.ballot.get(uuid=attrs["uuid"])