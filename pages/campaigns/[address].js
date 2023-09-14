/*
This React component is for a page that displays details of a specific campaign fetched from an Ethereum smart contract. 
It also provides a form for making contributions to the campaign.
*/

// Import necessary modules and components
import React from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import Campaign from "../../frontend_scripts/campaign";
import { Card, Grid, Button } from 'semantic-ui-react';
import { ethers } from "ethers";
import ContributeForm from "../../components/ContributeForm";
import Link from 'next/link';

const CampaignShow = ({ address, minimumContribution, contractBalance, numberOfRequests, approversCount, manager }) => {

    // Function to display the campaign summary as Card items
    function displayCampaignSummary() {

        // Create an array of Card items with campaign details
        const items = [
            {
                header: manager,
                meta: 'Address Of Manager',
                description: 'The Manager created this campaign and can create requests to withdraw money.',
                style: { overflowWrap: 'break-word' },
                color: "purple"
            },
            {
                header: minimumContribution,
                meta: 'Minimum Contribution in WEI',
                description: 'The amount of WEI to donate to become contributor.',
                color: "purple"
            },
            {
                header: numberOfRequests,
                meta: 'Number of Requests',
                description: 'A request tries to withdraw money from the contract. Request must be approved by contributors.',
                color: "purple"
            },
            {
                header: approversCount,
                meta: 'Number of Contributors',
                description: 'Number of people who have already donated to this campaign.',
                color: "purple"
            },
            {
                header: ethers.utils.formatEther(contractBalance),
                meta: 'Campaign Balance in ETH',
                description: 'The balance is how much money this campaign has to spend.',
                color: "purple"
            }
        ]

        return <Card.Group items={items}></Card.Group> // Render the Card.Group with the created Card items

    }

    return (
        <Layout>
            <h3>Campaign Details</h3>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={11}>
                        {displayCampaignSummary()}
                    </Grid.Column>
                    <Grid.Column width={3}>
                        <ContributeForm address={address}></ContributeForm>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Link href={`/campaigns/${address}/requests/allrequests`}>
                            <Button color="purple" size="large">View Requests</Button>
                        </Link>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Layout>
    )
};

// This function fetches data before rendering the page
// https://nextjs.org/docs/pages/building-your-application/data-fetching/get-static-props
export async function getServerSideProps(context) {
    const { address } = context.query; // Get the campaign address from the URL
    const campaign = Campaign(address); // Create an instance of the campaign contract
    const summary = await campaign.getSummary(); // Call the contract method to get campaign summary

    // console.log(summary)

    // Return the campaign details as props to be used in the component
    return {
        props: {
            address: address,
            minimumContribution: summary[0].toString(),
            contractBalance: summary[1].toString(),
            numberOfRequests: summary[2].toString(),
            approversCount: summary[3].toString(),
            manager: summary[4]
        }
    };
}

export default CampaignShow;