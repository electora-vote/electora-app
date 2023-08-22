import anvil.server


def encrypt_vote(proof, vote, timestamp):
    return anvil.server.call("encrypt_vote", proof, vote, timestamp)


def decrypt_vote(ciphertext, timestamp):
    return anvil.server.call("decrypt_vote", ciphertext, timestamp)
