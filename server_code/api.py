import anvil.server

from . import _nucypher


@anvil.server.callable
def encrypt_vote(proof, vote, timestamp):
    return _nucypher.encrypt_vote(proof, vote, timestamp)


@anvil.server.callable
def decrypt_vote(ciphertext, timestamp):
    return _nucypher.decrypt_vote(ciphertext, timestamp)
