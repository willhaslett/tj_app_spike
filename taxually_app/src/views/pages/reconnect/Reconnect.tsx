import {Box, Button, ContextView} from "@stripe/ui-extension-sdk/ui";
import TaxuallyIcon from "../../../assets/branding/taxually-icon-light.svg";
import React from "react";
import {ExtensionContextValue} from "@stripe/ui-extension-sdk/context";

type Props = {
    userContext: ExtensionContextValue["userContext"],
    environment: ExtensionContextValue["environment"],
    reconnectAccount: () => void
}

const Reconnect = (props: Props) => {
    const {reconnectAccount} = props;

    return (
        <ContextView
            title="Reconnect"
            brandColor="#161660"
            brandIcon={TaxuallyIcon}
        >
            <Box css={{stack: 'y', alignY: 'center', height: 'fill'}}>
                <Button type="primary" css={{ width: 'fill' }} onPress={() => reconnectAccount()}>
                    Relink your account
                </Button>
            </Box>

        </ContextView>
    );
};

export default Reconnect;
