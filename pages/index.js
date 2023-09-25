/*
This React component is for displaying a list of campaigns fetched from an Ethereum smart contract. It uses the Semantic UI React library 
for styling and includes a function getStaticProps that fetches the campaign data before rendering the page. 
The campaigns are displayed as cards on the web page.
It also contains the button for creating a new campaign, which when clicked redirects the user to /campaigns/new page where is the form to create a new campaign
*/

// Import necessary modules and components
import { React, useState } from "react";
import { Card } from 'semantic-ui-react';
import { Button, Icon } from 'semantic-ui-react';
import Layout from "../components/Layout";
import { ethers } from 'ethers';
import { abi, contractAddress } from "../frontend_scripts/factory";
import Link from 'next/link';
import { useRouter } from "next/router";
import New from "./campaigns/new";

export default function CampaingIndex({ campaigns }) {

    const [showForm, setShowForm] = useState(false); // State variable to track if the form is displayed


    // Callback function to update the showForm state when the form is submitted
    const handleFormSubmit = (formSubmitted) => {
        setShowForm(!formSubmitted);
    };

    // Function to toggle the display of the form
    const toggleForm = () => {
        if (showForm) {
            setShowForm(false);
        } else {
            setShowForm(true);
        }

    };

    // Function to display campaigns as cards on the UI
    function displayCampaigns() {

        // Looping through the campaigns array to create Card items
        const items = campaigns.map(address => {
            return {
                header: address, // Set the header of the Card to the campaign address
                description: (
                    <Link href={`/campaigns/${address}`}
                    ><Button size="mini" basic color="purple" style={{ marginTop: 10 }}>View Campaign</Button></Link>), // Create a link to view the campaign
                fluid: true, // Make the Card fluid to take up the width of its container
                color: "purple"
            }
        });

        return <Card.Group style={{ marginBottom: 10 }} items={items}></Card.Group> // Render the Card.Group with the created Card items

    }

    // Render the main component
    return (
        <Layout>
            <div>
                <h3>Open campaings</h3>
                {/* <Button floated="right" color={showForm ? "red" : "green"} onClick={toggleForm}>
                <Button.Content>{showForm ? 'Cancel Request' : 'Create New Request'}</Button.Content>
            </Button>
            <br></br>
            <br></br>
            {showForm && <NewRequests address={address} onFormSubmit={handleFormSubmit} />} */}
                {displayCampaigns()} {/* Render the Card.Group containing campaign cards */}
                {showForm && <New onFormSubmit={handleFormSubmit} />}
                <Button floated="left" color={showForm ? "red" : "green"} onClick={toggleForm}>
                    <Button.Content>{showForm ? 'Close The Form' : 'Create New Campaign'}</Button.Content>
                </Button>
            </div>
        </Layout>
    );
}

// This function fetches data before rendering the page using Next.js' getStaticProps
// https://nextjs.org/docs/pages/building-your-application/data-fetching/get-static-props
export async function getStaticProps() {
    // Initialize an Ethereum provider using ethers, connecting to Infura
    const provider = new ethers.providers.JsonRpcProvider("https://sepolia.infura.io/v3/f30d556feb8b4c0aa60df373daa4cefe");

    // Create an instance of your contract using its ABI and contract address
    const contract = new ethers.Contract(contractAddress, abi, provider);

    try {
        // Call the contract method to get deployed campaigns
        const campaigns = await contract.getDeployedCampaigns();
        return { props: { campaigns } };
    } catch (error) {
        console.error(error);
        return { props: { campaigns: [] } }; // Return empty array or handle the error as needed
    }
}