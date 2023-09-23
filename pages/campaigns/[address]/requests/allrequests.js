/*
This React component displays a list of requests related to a campaign. It uses Next.js for server-side rendering and fetching data before rendering the page using the getServerSideProps function. 
The component imports various modules and components required for rendering and fetching data. The requests are fetched from a contract using the Campaign module and displayed in a user-friendly format.
There is also a button for creating a new request which will redirect user to the form.
*/

// Import necessary modules and components
import { React } from "react";
import Layout from "../../../../components/Layout";
import { Button, Icon, Table } from 'semantic-ui-react';
import Link from 'next/link';
import Campaign from "../../../../frontend_scripts/campaign";
import RequestRow from "../../../../components/RequestRow";

const ShowRequests = ({ address, requestsCount, requests, numberOfContributors }) => {

    // console.log(address)
    // console.log(requestsCount)
    // console.log(requests)

    // Function to display requests in a table on the UI
    function displayRequests() {

        // Looping through the campaigns array to create request rows
        return requests.map((request, index) => {
            return <RequestRow
                key={index}
                id={index}
                request={request}
                address={address}
                numberOfContributors={numberOfContributors}
            ></RequestRow>

        });
    }

    // Render the main component
    return (
        <Layout>
            <h3>Requests</h3>
            <Link href={`/campaigns/${address}/requests/new`}>
                <Button floated="right" animated color="purple" style={{ marginBottom: 10 }}>
                    <Button.Content visible>Create Request</Button.Content>
                    <Button.Content hidden>
                        <Icon name='add circle' />
                    </Button.Content>
                </Button>
            </Link>
            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>ID</Table.HeaderCell>
                        <Table.HeaderCell>Description</Table.HeaderCell>
                        <Table.HeaderCell>Amount in ETH</Table.HeaderCell>
                        <Table.HeaderCell>Recipient Address</Table.HeaderCell>
                        <Table.HeaderCell>Number of Approvals</Table.HeaderCell>
                        <Table.HeaderCell>Approve</Table.HeaderCell>
                        <Table.HeaderCell>Finalize</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {displayRequests()}
                </Table.Body>
            </Table>
            <div>Found {requestsCount} requests.</div>
        </Layout>
    )
}

// This function fetches data before rendering the page
// https://nextjs.org/docs/pages/building-your-application/data-fetching/get-static-props
export async function getServerSideProps(context) {
    const { address } = context.query; // Get the campaign address from the URL
    const campaign = Campaign(address); // Create an instance of the campaign contract
    const requestsCount = await campaign.getRequestsCount(); // Call the contract method to get campaign request count

    try {
        // Use a for loop to fetch each request individually
        const requests = [];
        for (let i = 0; i < requestsCount; i++) {
            const originalRequest = await campaign.getRequest(i); // Fetch the request data
            // Create a new request object with modified values
            const modifiedRequest = {
                requestDescription: originalRequest[0],
                requestValue: originalRequest[1].toString(),
                requestRecipient: originalRequest[2],
                complete: originalRequest[3],
                approvalCount: originalRequest[4].toString(),
            };

            // console.log(modifiedRequest);
            requests.push(modifiedRequest); // Push the valid request to the array
        }

        const numberOfContributors = await campaign.getApproversCount();
        // console.log(numberOfContributors)

        // Return the address, requestCount and requests array as props to be used in the component
        return {
            props: {
                address: address,
                requestsCount: requestsCount.toString(),
                requests: requests,
                numberOfContributors: numberOfContributors.toString()
            }
        };
    } catch (error) {
        console.error('Error fetching requests:', error);
    }
}

export default ShowRequests;