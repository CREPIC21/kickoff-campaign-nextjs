/*
This React component is for connecting to MetaMask, a popular Ethereum wallet extension. It provides a button that allows users to connect their MetaMask accounts to the application. 
The component uses the ethereum object provided by MetaMask to interact with the user's wallet. It also listens for changes in the connected Ethereum account and updates the UI accordingly. 
The button's color and label change based on the connection status, and it can be disabled when already connected.
*/

import React, { useEffect, useState } from "react";
import { Button, Icon } from 'semantic-ui-react';

const Connect = () => {

    // State variables to manage connection status and button color
    const [connected, setConnected] = useState("Connect");
    const [color, setColor] = useState("purple")

    useEffect(() => {
        // Check initial connection status when the component mounts
        checkConnection();

        // Subscribe to MetaMask account changes
        ethereum.on('accountsChanged', handleAccountChange);

        // Clean up the event listener when the component unmounts
        return () => {
            ethereum.removeListener('accountsChanged', handleAccountChange);
        };
    }, []);

    async function checkConnection() {
        if (typeof window.ethereum !== "undefined") {
            try {
                // Request Ethereum accounts from MetaMask
                const accounts = await ethereum.request({ method: "eth_accounts" });
                if (accounts.length > 0) {
                    setConnected("Connected");
                    setColor("green");
                } else {
                    setConnected("Connect");
                    setColor("purple");
                }
            } catch (error) {
                console.log(error);
                setConnected("Connection Failed");
            }
        } else {
            setConnected("Please install MetaMask");
        }
    }

    async function handleAccountChange(accounts) {
        // Handle the event when the user's Ethereum account changes
        if (accounts.length > 0) {
            setConnected("Connected");
            setColor("green");
        } else {
            setConnected("Connect");
            setColor("purple");
        }
    }

    async function connect() {
        if (typeof window.ethereum !== "undefined") {
            try {
                // Request user permission to access their Ethereum accounts
                await ethereum.request({ method: "eth_requestAccounts" });
                // Account change will be detected by the event handler
            } catch (error) {
                console.log(error);
                setConnected("Connection Failed");
            }
        } else {
            setConnected("Please install MetaMask");
        }
    }

    return (
        // Render a button for connecting to MetaMask
        <Button
            floated="right"
            color={color}
            content={connected}
            disabled={connected === "Connected"}
            onClick={connect}>
        </Button>
    )
}

export default Connect;