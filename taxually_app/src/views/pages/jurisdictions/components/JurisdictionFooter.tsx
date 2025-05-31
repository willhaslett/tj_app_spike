import React from 'react';
import {Box, Button, Icon, Link} from "@stripe/ui-extension-sdk/ui";
import {useNavigate} from "react-router-dom";

interface JurisdictionFooterProps {
    isLoading: boolean;
    eligibleForFilings: boolean;
    readyToFileCount: number;
    preOnboardingCount: number;
    optedOutCount: number;
    totalCount: number;
    onboardingLink: string;
    externalLink: string;
}

const JurisdictionFooter: React.FC<JurisdictionFooterProps> = ({
                                                                   isLoading,
                                                                   eligibleForFilings,
                                                                   readyToFileCount,
                                                                   preOnboardingCount,
                                                                   optedOutCount,
                                                                   totalCount,
                                                                   onboardingLink,
                                                                   externalLink}) => {
    const navigate = useNavigate();

    return (
        <Box>

            {!isLoading && (
                <Box>
                    {!eligibleForFilings && (
                        <Box css={{stack: 'x', gap: 'medium', marginBottom: 'medium'}}>
                            <Box css={{width: 'fill'}}>
                                <Link css={{width: 'fill'}} href="https://dashboard.stripe.com/tax/taxually/subscribe">
                                    <Button
                                        type="primary"
                                        css={{ width: 'fill', alignX: 'center' }}>
                                        Upgrade to start filing
                                        <Icon name="external" size="xsmall"/>
                                    </Button>
                                </Link>
                            </Box>
                        </Box>
                    )}

                    {eligibleForFilings && (
                        <Box>
                            {readyToFileCount === 0 && (
                                <Box>
                                    {(preOnboardingCount + optedOutCount) !== totalCount && (
                                        // all the jurisdictions are pre-onboarding or opted out
                                        <Box>
                                            <Box css={{stack: 'x', gap: 'medium', marginBottom: 'medium'}}>
                                                <Box css={{width: 'fill'}}>
                                                    <Link css={{width: 'fill'}} href={externalLink} target="_blank">
                                                        <Button
                                                            type="primary"
                                                            css={{ width: 'fill', alignX: 'center' }}>
                                                            Continue onboarding
                                                            <Icon name="external" size="xsmall"/>
                                                        </Button>
                                                    </Link>
                                                    {totalCount !== 0 && ((preOnboardingCount + optedOutCount) !== totalCount) && (
                                                        <Box>
                                                            <Box css={{marginTop: 'small', textAlign: 'left', font: 'caption'}}>
                                                                Jurisdictions must be configured on Taxually's website before you can begin filing.
                                                            </Box>
                                                        </Box>
                                                    )}
                                                </Box>
                                            </Box>
                                        </Box>
                                    )}

                                    {(preOnboardingCount + optedOutCount) === totalCount && (
                                        <Box css={{stack: 'x', gap: 'medium', marginBottom: 'medium'}}>
                                            <Box css={{width: 'fill'}}>
                                                <Link css={{width: 'fill'}} href={onboardingLink} target="_blank">
                                                    <Button
                                                        type="primary"
                                                        css={{ width: 'fill', alignX: 'center' }}>
                                                        Start onboarding
                                                        <Icon name="external" size="xsmall"/>
                                                    </Button>
                                                </Link>
                                            </Box>

                                        </Box>
                                    )}
                                </Box>
                            )}

                            {readyToFileCount !== 0 && (
                                <Box css={{stack: 'x', gap: 'medium'}}>
                                    <Box css={{width: 'fill'}}>
                                        <Button type="primary" css={{ width: 'fill' }} onPress={() => navigate('/filings')}>
                                            Go to Filings
                                            <Icon name="chevronRight" size="xsmall"/>
                                        </Button>
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    )}
                </Box>
            )}

        </Box>
    );
}

export default JurisdictionFooter;
