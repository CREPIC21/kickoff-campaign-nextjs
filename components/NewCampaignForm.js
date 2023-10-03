/*
This React component is for creating a new campaign contract. It uses the Semantic UI React library for styling and interacts with an Ethereum smart contract. 
Users can input the minimum contribution required to create a campaign, and when they submit the form, a transaction is sent to the Ethereum network to create a new campaign contract. 
The new campaign contract is also programmatically verified and published on blockchain network.
The code also includes error handling and a loading spinner to provide feedback to the user during the contract creation process.
*/

// Import necessary modules and components
import { React, useState } from "react";
import { Button, Form, Input, Message } from 'semantic-ui-react';
import { ethers } from 'ethers';
import { abi, contractAddress } from "../frontend_scripts/factory";
import Campaign from "../frontend_scripts/campaign";
import { useRouter } from "next/router";
import { soliditySourceCode } from "../frontend_scripts/campaignSourceCode";

async function getFactoryDeployedCampaigns() {
    // Initialize an Ethereum provider using ethers, connecting to Infura
    const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL_INFURA);

    // Create an instance of your contract using its ABI and contract address
    const contract = new ethers.Contract(contractAddress, abi, provider);

    try {
        // Call the contract method to get deployed campaigns
        const campaigns = await contract.getDeployedCampaigns();
        const lastDelpoyedCampaignAddress = campaigns.slice(-1);
        return lastDelpoyedCampaignAddress[0];
    } catch (error) {
        console.error(error);
        return "No Address"
    }
}

// Function to verify a contract on Etherscan
async function verifyContractOnEtherscan(campaignConstructorArguments, campaignAddress, provider) {
    const data = {
        apikey: process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY,
        module: 'contract',
        action: 'verifysourcecode',
        contractaddress: campaignAddress,
        sourceCode: soliditySourceCode,
        codeformat: 'solidity-single-file',
        contractname: 'Campaign',
        compilerversion: 'v0.8.19+commit.7dd6d404',
        optimizationUsed: 1,
        runs: 200,
        constructorArguements: campaignConstructorArguments
    }

    // Make a POST request using fetch
    fetch('https://api-sepolia.etherscan.io/api', {
        method: 'POST',
        body: new URLSearchParams(data),
    })
        .then((response) => response.json())
        .then((result) => {
            console.log(result);
            if (result.status === '1') {
                console.log("1")
            } else {
                console.log("0")
            }
            console.log('status : ' + result.status);
            console.log('result : ' + result.result);
        })
        .catch((error) => {
            console.error('error!', error);
        });
}

const New = ({ onFormSubmit }) => {

    // State variables to manage user input and error messages
    const [minimumContribution, setMinimumContribution] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [buttonSpinner, setButtonSpinner] = useState(false);

    const router = useRouter();

    // Function to handle the form submission
    async function handleSubmit(event) {
        event.preventDefault();

        setButtonSpinner(true); // Activate a loading spinner on the button
        setErrorMessage(""); // Clear any previous error messages

        // Initialize an Ethereum provider and signer
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()

        // Create an instance of your contract using its ABI and contract address
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            // Call the contract method to create a new campaign contract
            const transactionResponse = await contract.createCampaignContract(minimumContribution);

            // Listen for the transaction to be mined and resolved
            await listenForTransactionMine(transactionResponse, provider);

            // Fetch the contract address from the blockchain
            const campaignAddress = await getFactoryDeployedCampaigns();
            const campaign = Campaign(campaignAddress, signer); // Create an instance of the campaign contract
            const campaignManager = await campaign.getManager(); // Call the contract method to get campaign manager
            console.log("ADDRESS: ", campaignAddress);
            // Define the types and values you want to encode
            const types = ["uint256", "address"];
            const values = [Number(minimumContribution), campaignManager];
            // Encode the values using ethers.abiCoder.encode
            let encodedCampaignConstructorArguments = ethers.utils.defaultAbiCoder.encode(types, values);
            let encodedCampaignConstructorArgumentsWithout0x = encodedCampaignConstructorArguments.slice(2);

            // Verify the contract on Etherscan after deployment
            await verifyContractOnEtherscan(encodedCampaignConstructorArgumentsWithout0x, campaignAddress, provider);

            // Notify the parent component (ShowRequests) that the form is successfully submitted
            onFormSubmit(true);

            router.push("/"); // Redirect to the home page after successful contract creation
        } catch (error) {
            console.log(error)
            setErrorMessage(error.message) // Set an error message if there's an issue
        }
        setButtonSpinner(false); // Deactivate the loading spinner on the button
    }

    // Function to listen for the transaction to be mined
    function listenForTransactionMine(transactionResponse, provider) {
        console.log(`Mining ${transactionResponse.hash}`)
        return new Promise((resolve, reject) => {
            provider.once(transactionResponse.hash, (transactionReceipt) => {
                console.log(
                    `Completed with ${transactionReceipt.confirmations} confirmations. `
                )
                resolve()
            })
        })
    }

    // Render the component
    return (
        <div>
            <h3>Create New Campaign</h3>
            <Form style={{ marginBottom: 15 }} onSubmit={handleSubmit} error={!!errorMessage}>
                <Form.Field>
                    <label>Minimum Contribution</label>
                    <Input
                        label='WEI'
                        labelPosition='right'
                        value={minimumContribution}
                        onChange={event => setMinimumContribution(event.target.value)} />
                </Form.Field>
                <Message error header="Opps!" content={errorMessage}></Message>
                <Button type='submit' color="green" loading={buttonSpinner}>Create</Button>
            </Form>

        </div>
    )
}

export default New;