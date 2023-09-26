/*
This React component is for a simple header menu. It uses the Semantic UI React library for styling. The menu consists of the "Kickoff" title on the left 
and a right-aligned section with "Campaigns" and a plus sign (+) icon as menu items. The style attribute is used to add a margin at the top of the menu.
*/

import React from "react";
import { Menu, Popup } from 'semantic-ui-react';
import Link from 'next/link'

const Header = () => {
    return (
        // Create a menu component using Semantic UI React
        <Menu style={{ marginTop: '10px' }}>
            <Link href="/"><Menu.Item header>Kickoff Blockchain</Menu.Item></Link>
            <Menu.Menu position="right">
                <Link href="/"><Menu.Item>Campaigns</Menu.Item></Link>
            </Menu.Menu>
        </Menu>
    )
}

export default Header;