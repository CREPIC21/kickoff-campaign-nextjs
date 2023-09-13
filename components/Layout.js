/*
This React component serves as a layout structure for the application. It includes a container to hold the content of header, props ...
*/

import React from "react";
import Header from "./Header";
import { Container } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import Connect from './Connect';

const Layout = (props) => {
    return (
        // Create a Container to structure the layout using Semantic UI React
        <Container>
            <Connect></Connect> {/* Render the Connect component */}
            <Header></Header> {/* Render the Header component */}
            {props.children} {/* Render the children components passed as props */}
        </Container>
    )
}

export default Layout;