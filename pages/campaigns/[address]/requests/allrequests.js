/*
This React component displays a list of requests related to a campaign. It uses Next.js for server-side rendering and fetching data before rendering the page using the getServerSideProps function. 
The component imports various modules and components required for rendering and fetching data. The requests are fetched from a contract using the Campaign module and displayed in a user-friendly format.
There is also a button for creating a new request which will redirect user to the form.
*/

// Import necessary modules and components
import { React } from "react";
import Layout from "../../../../components/Layout";
import { Button, Icon } from 'semantic-ui-react';
import Link from 'next/link';
import Campaign from "../../../../frontend_scripts/campaign";

const ShowRequests = ({ address, requestsCount, requests }) => {

    // console.log(address)
    // console.log(requestsCount)
    // console.log(requests)

    // Render the main component
    return (
        <Layout>
            <h3>Requests</h3>
            <Link href={`/campaigns/${address}/requests/new`}>
                <Button floated="right" animated color="purple">
                    <Button.Content visible>Create Request</Button.Content>
                    <Button.Content hidden>
                        <Icon name='add circle' />
                    </Button.Content>
                </Button>
            </Link>
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

        // Return the address, requestCount and requests array as props to be used in the component
        return {
            props: {
                address: address,
                requestsCount: requestsCount.toString(),
                requests: requests
            }
        };
    } catch (error) {
        console.error('Error fetching requests:', error);
    }




}

export default ShowRequests;