import {useNavigate} from "react-router-dom";
import React from "react";
import {Icon, Inline, Link, Menu, MenuItem} from "@stripe/ui-extension-sdk/ui";

type Props = {
    currentRoute: string
}
export const MenuList = (props: Props) => {
    const {currentRoute} = props;
    const navigate = useNavigate();

    return (
        <Menu trigger={
            <Link>
                <Icon name="menu" size="small"/>
            </Link>
        }>
            <MenuItem onAction={() => navigate('/jurisdictions')}
                      disabled={currentRoute.startsWith('/jurisdictions')}>
                <Icon name="globe" size="xsmall"/>
                <Inline css={{marginLeft: 'xsmall'}}>Jurisdictions</Inline>
            </MenuItem>
            <MenuItem onAction={() => navigate('/filings')}
                      disabled={currentRoute.startsWith('/filings')}>
                <Icon name="invoice" size="xsmall"/>
                <Inline css={{marginLeft: 'xsmall'}}>Filings</Inline>
            </MenuItem>
            <MenuItem onAction={() => navigate('/settings')}
                      disabled={currentRoute.startsWith('/settings')}>
                <Icon name="person" size="xsmall"/>
                <Inline css={{marginLeft: 'xsmall'}}>Settings</Inline>
            </MenuItem>
            <MenuItem onAction={() => navigate('/support')}
                      disabled={currentRoute.startsWith('/support')}>
                <Icon name="card" size="xsmall"/>
                <Inline css={{marginLeft: 'xsmall'}}>Support</Inline>
            </MenuItem>
        </Menu>
    );
};
