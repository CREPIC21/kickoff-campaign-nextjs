# Decentralized Crowdfunding Platform

Welcome to the frontend part of the Decentralized Crowdfunding Platform. This part of the project complements the backend [KickoffCampaignFoundry](https://github.com/CREPIC21/kickoff-campaign-foundry), which is responsible for handling the smart contracts and blockchain interactions. 

The frontend is built using [React](https://react.dev/), [NextJS](https://nextjs.org/) and [Ethers](https://docs.ethers.org/v5/) to provide a user-friendly interface for users to interact with the decentralized crowdfunding platform. 

This project is also part of learning Solidity and blockchain technologies following a Udemy course ["Ethereum and Solidity: The Complete Developer's Guide"](https://www.udemy.com/course/ethereum-and-solidity-the-complete-developers-guide/) created by Stephen Grider.

## Key Features

The frontend of the Decentralized Crowdfunding Platform offers the following key features:

- **Landing Page Dashboard**: Users can view created campaigns, including project details, connect to the wallet, create new campaign.

- **Campaign Details**: Access detailed information about each campaign, such as contribution history, request lists, and the current balance.

- **Contribute**: Easily contribute to campaigns by sending Ether directly from the wallet connected to the frontend.

- **Request Voting**: Participate in the democratic process by voting on expenditure requests made by campaign owners.

- **Request Creation**: Campaign owners can create new expenditure requests, specifying the purpose and amount for project-related expenses.

- **Campaign Creation**: Users can initiate new crowdfunding campaigns, setting goals, deadlines, and other project details.

## Prerequisites
Before getting started with the Decentralized Crowdfunding Platform frontend, make sure you have the following prerequisites:
- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) and [Node.js](https://nodejs.org/en) installed on your system.
- running instance of the backend project [KickoffCampaignFoundry](https://github.com/CREPIC21/kickoff-campaign-foundry) on Ethereum, as the frontend relies on it for smart contract interactions

### Quickstart
```shell
git clone https://github.com/CREPIC21/kickoff-campaign-nextjs
cd kickoff-campaign-nextjs
npm install
```
- create necessary environment variables, see `.env.example` file
- run the development server and access the application in your web browser at http://localhost:3000
```shell
npm run dev
```
