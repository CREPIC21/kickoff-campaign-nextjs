import { ethers } from 'ethers';
const dotenv = require('dotenv');

// Specify the path to your .env file
const envFilePath = '../.env';
// Load environment variables from the custom path
dotenv.config({ path: envFilePath });

const abi = [
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "minimum",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "creator",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "Campaign__ApproverAlreadyVotedForThisRequest",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "Campaign__ApproverIsNotContributor",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "Campaign__ManagerCanNotApproveRequest",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "Campaign__ManagerDidNotCallThisFunction",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "Campaign__NotEnoughEthSent",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "Campaign__RequestCanNotBeFinalizedAsNotEnoughApprovers",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "Campaign__RequestWasAlreadyFinalized",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "requestIndex",
                "type": "uint256"
            }
        ],
        "name": "approveRequest",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_address",
                "type": "address"
            }
        ],
        "name": "checkIfContributorDonatedMoney",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "contribute",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_requestDescription",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "_requestValue",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "_requestRecipient",
                "type": "address"
            }
        ],
        "name": "createRequest",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "requestIndex",
                "type": "uint256"
            }
        ],
        "name": "finalizeRequest",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_index",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "_address",
                "type": "address"
            }
        ],
        "name": "getApprovalStatusOfApprover",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getApproversCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getContractAddress",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getManager",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getMinimumContribution",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_index",
                "type": "uint256"
            }
        ],
        "name": "getRequest",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getRequestsCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getSummary",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]

export default (address) => {
    // Initialize an Ethereum provider using ethers, connecting to Infura
    const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL_INFURA);
    // Create an instance of your contract using its ABI and contract address
    const contract = new ethers.Contract(address, abi, provider);
    return contract;
};