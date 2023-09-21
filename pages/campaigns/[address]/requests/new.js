/*
This React component allows manager to create a new request related to a campaign. It uses Next.js for server-side rendering and fetching data before rendering the page using the getServerSideProps function. 
The component imports various modules and components required for rendering and interacting with Ethereum smart contracts. Manager can input details about their request, and when they submit the form, 
a transaction is sent to create the request on the blockchain.
*/

// Import necessary modules and components
import { React, useState } from "react";
import Layout from "../../../../components/Layout";
import { Button, Form, Input, Message } from 'semantic-ui-react';
import { ethers } from 'ethers';
import Campaign from "../../../../frontend_scripts/campaign";
import { useRouter } from "next/router";
import Link from "next/link";

const NewRequests = ({ address }) => {

    // State variables to manage user input and error messages
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [recipientAddress, setRecipientAddress] = useState("");
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
            // Call the contract method to create request for spending money
            const transactionResponse = await campaign.createRequest(description, ethers.utils.parseEther(amount), recipientAddress);

            // Listen for the transaction to be mined and resolved
            await listenForTransactionMine(transactionResponse, campaign.provider)
            // Redirect to the campaign all requests details page after a successful contribution
            await router.replace(`/campaigns/${address}/requests/allrequests`);
        } catch (error) {
            console.log(error)
            setErrorMessage(error.message) // Set an error message if there's an issue
        }
        setButtonSpinner(false); // Deactivate the loading spinner on the button
        setDescription(""); // Clear the description input field after submission
        setAmount("");// Clear the amount input field after submission
        setRecipientAddress(""); // Clear the address input field after submission
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
        <Layout>
            <Link href={`/campaigns/${address}/requests/allrequests`}>Back</Link>
            <h3>New Request</h3>
            <Form onSubmit={handleSubmit} error={!!errorMessage} > {/* exclamation is just a little trick to turn a string into its equivalent, in this case empty string equals false */}
                <Form.Field>
                    <label>Create a Request Description</label>
                    <Input
                        label='Description'
                        labelPosition='right'
                        value={description}
                        onChange={event => setDescription(event.target.value)} />
                </Form.Field>
                <Form.Field>
                    <label>Amount in ETH</label>
                    <Input
                        label='ETH'
                        labelPosition='right'
                        value={amount}
                        onChange={event => setAmount(event.target.value)} />
                </Form.Field>
                <Form.Field>
                    <label>Recipient Address</label>
                    <Input
                        label='Address'
                        labelPosition='right'
                        value={recipientAddress}
                        onChange={event => setRecipientAddress(event.target.value)} />
                </Form.Field>
                <Message error header="Opps!" content={errorMessage}></Message>
                <Button type='submit' color="purple" loading={buttonSpinner}>Create</Button>
            </Form>
        </Layout>
    )
}

// This function fetches data before rendering the page
// https://nextjs.org/docs/pages/building-your-application/data-fetching/get-static-props
export async function getServerSideProps(context) {
    const { address } = context.query; // Get the campaign address from the URL

    // Return the address as props to be used in the component
    return {
        props: {
            address: address
        }
    };
}

export default NewRequests;