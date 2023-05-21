from app import globals
import anvil.server

def encrypt_vote(proof, vote, timestamp):
    encrypted_vote = anvil.server.call("encrypt_vote", proof, vote, timestamp)
    return encrypted_vote

def decrypt_vote(ciphertext, timestamp):
    decrypted_vote = anvil.server.call("decrypt_vote", ciphertext, timestamp)
    return decrypted_vote