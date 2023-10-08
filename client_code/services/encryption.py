import anvil.server


def encrypt_vote(proof, vote, timestamp):
    return anvil.server.call("encyrpt", proof, vote, timestamp)


def decrypt_vote(ciphertext, timestamp):
    return ciphertext
