from ape import accounts, project

def main():
    account = accounts.load("ScrollTest")
    return account.deploy(project.BallotManager)