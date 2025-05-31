import {Box, ContextView, Icon, Img, Spinner} from "@stripe/ui-extension-sdk/ui";
import React from "react";
import TaxuallyIcon from "../../../assets/branding/taxually-icon-light.svg";
import AccountCreationImg from "../../../assets/branding/taxually-stripe-transparent.png";

const AccountCreation = () => {

    return (
        <ContextView
            title="Just a moment..."
            brandColor="#161660"
            brandIcon={TaxuallyIcon}
        >

            <Box
                css={{
                    stack: 'y',
                    gap: 'medium',
                    alignX: 'center',
                    height: 'fill'
                }}
            >
                <Box>
                    <Img
                        src={AccountCreationImg}
                        width="287"
                        alt="account-creation-img"
                    />
                </Box>

                <Box css={{stack: 'y', alignY: 'center', paddingLeft: 'medium', paddingRight: 'medium' }}>
                    <Box css={{width: 'fill', textAlign: 'center', alignX: 'center', alignY: 'center'}}>
                        <Spinner size='large'/>
                    </Box>
                    <Box css={{width: 'fill', textAlign: 'center', font: 'heading', marginTop: 'medium'}}>
                        Fetching registrations from Stripe
                    </Box>
                </Box>

                <Box css={{stack: 'x', alignY: 'bottom', width: 'fill',
                    paddingLeft: 'small', paddingRight: 'small'
                }}>

                    <Box css={{
                        padding: 'medium',
                        backgroundColor: 'container',
                        borderRadius: 'small',
                        keyline: 'neutral',
                        width: 'fill',
                        stack: 'x',
                    }}>
                        <Box css={{width: '2/12'}}>
                            <Box css={{marginTop: 'xxsmall'}}>
                                <Icon name="info" size="xsmall"/>
                            </Box>
                        </Box>
                        <Box css={{width: '10/12'}}>
                            <Box css={{font: 'body', color: 'secondary'}}>
                                {`We're`} retrieving your tax registrations, which are set up in Stripe Tax.
                                These represent the jurisdictions where you are registered to
                                collect taxes and will be available to onboard for filings.
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>


        </ContextView>
    );
};

export default AccountCreation;
