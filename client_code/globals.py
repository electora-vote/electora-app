import anvil.js
import anvil.server

anvil.js.report_all_exceptions(True)

origin = anvil.server.get_app_origin()
sismo_client = anvil.js.import_from("@sismo-core/sismo-connect-client")
sismo_app_id = "0x022828235eed6dc1978b239bdd735bae"
scroll_rpc_url = "https://alpha-rpc.scroll.io/l2"
ballot_manager_address = "0x7ee88EB2209039fAb7e61Be48fAefEaCA492ACAD"
user = None
tabulator_options = {
    "index": "uuid",
    "use_model": True,
    "getter": getattr,
    "selectable": "highlight",
}

ballot_manager_abi = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "name": "ballots",
      "outputs": [
        {
          "internalType": "string",
          "name": "sismoGroupId",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_ballotId",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_sismoGroupId",
          "type": "string"
        },
        {
          "internalType": "string[]",
          "name": "_candidates",
          "type": "string[]"
        }
      ],
      "name": "createBallot",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_ballotId",
          "type": "string"
        }
      ],
      "name": "getCandidates",
      "outputs": [
        {
          "internalType": "string[]",
          "name": "",
          "type": "string[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_ballotId",
          "type": "string"
        }
      ],
      "name": "getSismoGroupID",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_ballotId",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_encryptedProofAndVote",
          "type": "string"
        }
      ],
      "name": "vote",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "votes",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]

def user_logged_in():
    return user is None