// import { ethers } from 'ethers';
// import { JsonRpcProvider } from 'ethers';
// const dotenv = require('dotenv');

// // Specify the path to your .env file
// const envFilePath = '../.env';
// // Load environment variables from the custom path
// dotenv.config({ path: envFilePath });

// let web3;

// const initializeWeb3 = async () => {
//     if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
//         // We are in the browser and MetaMask is running.
//         await window.ethereum.request({ method: "eth_requestAccounts" });
//         web3 = new ethers.Web3Provider(window.ethereum);
//     } else {
//         // We are on the server *OR* the user is not running MetaMask
//         const provider = new JsonRpcProvider(
//             process.env.SEPOLIA_RPC_URL_INFURA
//         );
//         web3 = provider;
//     }
// };

// initializeWeb3(); // Call the async initialization function

// export default web3;

