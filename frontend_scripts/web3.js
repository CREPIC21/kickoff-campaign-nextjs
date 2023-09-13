import Web3 from "web3";
const dotenv = require('dotenv');

// Specify the path to your .env file
const envFilePath = '../.env';
// Load environment variables from the custom path
dotenv.config({ path: envFilePath });

// window.ethereum.request({ method: "eth_requestAccounts" });

// const web3 = new Web3(window.ethereum);

let web3;

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    // We are in the browser and metamask is running.
    window.ethereum.request({ method: "eth_requestAccounts" });
    web3 = new Web3(window.ethereum);
} else {
    // We are on the server *OR* the user is not running metamask
    const provider = new Web3.providers.HttpProvider(
        process.env.SEPOLIA_RPC_URL_INFURA
    );
    web3 = new Web3(provider);
}

export default web3;