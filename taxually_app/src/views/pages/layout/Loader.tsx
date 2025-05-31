import React from "react";
import {Box, ContextView, Spinner} from "@stripe/ui-extension-sdk/ui";
import TaxuallyIcon from "../../../assets/branding/taxually-icon-light.svg";

const Loader = () => {
    return (
        <ContextView
            title="Please wait..."
            brandColor="#161660"
            brandIcon={TaxuallyIcon}
        >
            <Box css={{width: 'fill', textAlign: 'center', alignX: 'center', alignY: 'center'}}>
                <Spinner size='large'/>
            </Box>
        </ContextView>
    );
};

export default Loader;
