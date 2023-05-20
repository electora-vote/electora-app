from anvil.tables import app_tables, query
import anvil.users
from uuid import uuid4


def excluding_cols(table, columns):
    all_columns = [c["name"] for c in table.list_columns()]
    return [c for c in all_columns if c not in columns]


@anvil.server.callable(require_user=True)
def search_ballot(*args, **kwargs):
    user = anvil.users.get_user()
    table = app_tables.ballot
    return table.client_readable(
        query.only_cols(*excluding_cols(table, ["user"])),
        user=user,
        *args,
        **kwargs,
    ).search()


@anvil.server.callable(require_user=True)
def add_ballot(attrs):
    user = anvil.users.get_user()
    row = app_tables.ballot.add_row(user=user, uuid=str(uuid4()), **attrs)
    return row