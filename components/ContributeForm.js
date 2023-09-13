/*
This React component is for a donation form that allows users to contribute to a campaign by specifying a donation amount. 
It interacts with an Ethereum smart contract using ethers and provides user-friendly error handling and feedback.
*/

// Import necessary modules and components
import { React, useState } from "react";
import { Button, Form, Input, Message } from 'semantic-ui-react';
import Campaign from "../frontend_scripts/campaignSigner";
import { ethers } from "ethers";
import { useRouter } from "next/router";

const ContributeForm = ({ address }) => {

    // State variables to manage user input and error messages
    const [donation, setDonation] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [buttonSpinner, setButtonSpinner] = useState(false);

    const router = useRouter(); // Get the router object for navigation

    // Function to handle the form submission
    async function handleSubmit(event) {
        event.preventDefault();

        setButtonSpinner(true); // Activate a loading spinner on the button
        setErrorMessage(""); // Clear any previous error messages

        // Initialize an Ethereum provider and signer
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()

        // Create an instance of your contract using its contract address and signer
        const campaign = Campaign(address, signer);

        try {
            // Call the contract method to contribute to the campaign
            const transactionResponse = await campaign.contribute({
                value: ethers.utils.parseEther(donation)
            });

            // Listen for the transaction to be mined and resolved
            await listenForTransactionMine(transactionResponse, campaign.provider)
            // Redirect to the campaign details page after a successful contribution
            await router.replace(`/campaigns/${address}`);
        } catch (error) {
            console.log(error)
            setErrorMessage(error.message) // Set an error message if there's an issue
        }
        setButtonSpinner(false); // Deactivate the loading spinner on the button
        setDonation(""); // Clear the donation input field after submission
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

    // Render the main component
    return (
        <Form onSubmit={handleSubmit} error={!!errorMessage} > {/* exclamation is just a little trick to turn a string into its equivalent, in this case empty string equals false */}
            <Form.Field>
                <label>Amount To Donate</label>
                <Input
                    label='ETH'
                    labelPosition='right'
                    value={donation}
                    onChange={event => setDonation(event.target.value)} />
            </Form.Field>
            <Message error header="Opps!" content={errorMessage}></Message>
            <Button type='submit' color="purple" loading={buttonSpinner}>Donate</Button>
        </Form>
    )
}

export default ContributeForm;