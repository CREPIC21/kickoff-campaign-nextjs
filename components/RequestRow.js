import { React, useState } from "react";
import { Table, Button, Message } from 'semantic-ui-react';
import { ethers } from "ethers";
import Campaign from "../frontend_scripts/campaign";
import { useRouter } from "next/router";

const RequestRow = (props) => {

    const [errorMessage, setErrorMessage] = useState("");
    const [buttonSpinner, setButtonSpinner] = useState(false);

    const { requestDescription, requestValue, requestRecipient, complete, approvalCount } = props.request;
    const numberOfContributors = props.numberOfContributors;
    const requestId = props.id;
    const contractAddress = props.address;
    const readyToFinalize = approvalCount > (numberOfContributors / 2);

    const router = useRouter(); // Get the router object for navigation

    // Function to approve request
    async function onApprove() {

        // setButtonSpinner(true); // Activate a loading spinner on the button
        // setErrorMessage(""); // Clear any previous error messages

        // Initialize an Ethereum provider and signer
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()

        // Create an instance of your contract using its contract address and signer
        const campaign = Campaign(contractAddress, signer);

        try {
            // Call the contract method to create request for spending money
            const transactionResponse = await campaign.approveRequest(requestId);

            // Listen for the transaction to be mined and resolved
            await listenForTransactionMine(transactionResponse, campaign.provider)
            // Redirect to the campaign all requests details page after a successful contribution
            await router.replace(`/campaigns/${contractAddress}/requests/allrequests`);
        } catch (error) {
            console.log(error)
            // setErrorMessage(error.message) // Set an error message if there's an issue
        }
        // setButtonSpinner(false); // Deactivate the loading spinner on the button
    }

    // Function to finalize request
    async function onFinalize() {

        // setButtonSpinner(true); // Activate a loading spinner on the button
        // setErrorMessage(""); // Clear any previous error messages

        // Initialize an Ethereum provider and signer
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()

        // Create an instance of your contract using its contract address and signer
        const campaign = Campaign(contractAddress, signer);

        try {
            // Call the contract method to create request for spending money
            const transactionResponse = await campaign.finalizeRequest(requestId);

            // Listen for the transaction to be mined and resolved
            await listenForTransactionMine(transactionResponse, campaign.provider)
            // Redirect to the campaign all requests details page after a successful contribution
            await router.replace(`/campaigns/${contractAddress}/requests/allrequests`);
        } catch (error) {
            console.log(error)
            // setErrorMessage(error.message) // Set an error message if there's an issue
        }
        // setButtonSpinner(false); // Deactivate the loading spinner on the button
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
    return (
        <Table.Row disabled={complete} positive={readyToFinalize && !complete}>
            <Table.Cell>{props.id}</Table.Cell>
            <Table.Cell>{requestDescription}</Table.Cell>
            <Table.Cell>{ethers.utils.formatEther(requestValue)}</Table.Cell>
            <Table.Cell>{requestRecipient}</Table.Cell>
            <Table.Cell>{approvalCount}/{numberOfContributors}</Table.Cell>
            <Table.Cell>
                {/* {complete ? null : (
                    <Button basic color="green" onClick={onApprove}>Approve</Button>
                )
                } */}
                <Button basic={!complete} color="green" onClick={onApprove}>{complete ? "Approved" : "Approve"}</Button>
            </Table.Cell>
            {/* <Message error header="Opps!" content={errorMessage}></Message> */}
            <Table.Cell>
                {/* {complete ? null : (
                    <Button basic color="red" onClick={onFinalize}>Finalize</Button>
                )
                } */}
                <Button basic={!complete} color="teal" onClick={onFinalize}>{complete ? "Finalized" : "Finalize"}</Button>
            </Table.Cell>
        </Table.Row>
    )
}

export default RequestRow;