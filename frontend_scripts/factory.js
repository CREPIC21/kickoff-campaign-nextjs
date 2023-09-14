export const contractAddress = "0x830dA82591E34eCD6D62b1b68B6226cc1FA2b31A";
export const abi = [{
    "inputs": [{
        "internalType": "uint256",
        "name": "minimum",
        "type": "uint256"
    }],
    "name": "createCampaignContract",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [],
    "name": "getContractAddress",
    "outputs": [{
        "internalType": "address",
        "name": "",
        "type": "address"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "getDeployedCampaigns",
    "outputs": [{
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }],
    "name": "listOfDeployedCampaignContracts",
    "outputs": [{
        "internalType": "address",
        "name": "",
        "type": "address"
    }],
    "stateMutability": "view",
    "type": "function"
}]