/*
This React component is for creating a new campaign contract. It uses the Semantic UI React library for styling and interacts with an Ethereum smart contract. 
Users can input the minimum contribution required to create a campaign, and when they submit the form, a transaction is sent to the Ethereum network to create a new campaign contract. 
The code also includes error handling and a loading spinner to provide feedback to the user during the contract creation process.
*/

// Import necessary modules and components
import { React, useState } from "react";
import Layout from "../../components/Layout";
import { Button, Form, Input, Message } from 'semantic-ui-react';
import { ethers } from 'ethers';
import { abi, contractAddress } from "../../frontend_scripts/factory";
import { useRouter } from "next/router";
import Link from 'next/link';

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
            await listenForTransactionMine(transactionResponse, provider)

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
            <h3>Create Campaign</h3>
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