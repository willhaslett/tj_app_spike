import {Box, ContextView} from "@stripe/ui-extension-sdk/ui";
import TaxuallyIcon from "../../../assets/branding/taxually-icon-light.svg";
import React from "react";

const GenericError = () => {

    return (
        <ContextView
            title="Error"
            brandColor="#161660"
            brandIcon={TaxuallyIcon}
        >

            <Box css={{width: 'fill', textAlign: 'center', alignX: 'center', alignY: 'center', font: 'heading'}}>
                {`Something's`} gone wrong.
            </Box>

            <Box css={{marginTop: 'medium', font: 'body'}}>
                The server encountered and error and could not complete your request.
            </Box>

            <Box css={{marginTop: 'medium', font: 'body'}}>
                Try to refresh this page or feel free to contact us if the problem persists.
            </Box>

        </ContextView>
    );
};

export default GenericError;
