def encrypt_vote(proof, vote, timestamp):
    return f"{proof}{vote}"


def decrypt_vote(ciphertext, timestamp):
    return ciphertext
