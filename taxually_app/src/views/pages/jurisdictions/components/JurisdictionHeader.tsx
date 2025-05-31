import React from 'react';
import {Box, Button, Icon, Link, Spinner} from "@stripe/ui-extension-sdk/ui";

interface JurisdictionHeaderProps {
    isLoading: boolean;
    eligibleForFilings: boolean;
    readyToFileCount: number;
    preOnboardingCount: number;
    optedOutCount: number;
    totalCount: number;
    externalLink: string;
}

const JurisdictionHeader: React.FC<JurisdictionHeaderProps> = ({
                                                                   isLoading,
                                                                   eligibleForFilings,
                                                                   readyToFileCount,
                                                                   preOnboardingCount,
                                                                   optedOutCount,
                                                                   totalCount,
                                                                   externalLink }) => (
    <Box css={{
        padding: 'medium',
        backgroundColor: 'container',
        borderRadius: 'small',
        keyline: 'neutral',
        textAlign: 'center'
    }}>
        {isLoading && (
            <Box css={{width: 'fill', textAlign: 'center', alignX: 'center', alignY: 'center'}}>
                <Spinner size='large'/>
            </Box>
        )}
        {!isLoading && (
            <Box>
                {!eligibleForFilings && (
                    <Box css={{marginBottom: 'medium'}}>
                        <Box css={{ fontWeight: 'semibold', marginBottom: 'medium', font: 'subheading' }}>
                            UPGRADE TO GET ACCESS TO FILING SERVICES WITH TAXUALLY
                        </Box>
                        <Box css={{ marginTop: 'medium', font: 'caption' }}>
                            Before you can begin filing with Taxually, you will need to upgrade to a Stripe
                            Tax monthly subscription.
                        </Box>
                    </Box>
                )}

                {readyToFileCount === 0 && (
                    <Box>

                        {eligibleForFilings && (
                            <Box css={{marginBottom: 'medium'}}>
                                <Box css={{ fontWeight: 'semibold', marginBottom: 'medium', font: 'subheading' }}>
                                    SETUP YOUR JURISDICTIONS WITH TAXUALLY
                                </Box>
                                <Box css={{ marginTop: 'medium', font: 'caption' }}>
                                    Before you can begin filing with Taxually, you will need to provide detailed information
                                    about your business in each registered jurisdiction.
                                </Box>
                            </Box>
                        )}
                    </Box>
                )}

                <Box css={{ color: 'secondary', font: 'caption' }}>
                    {readyToFileCount} of {totalCount} jurisdictions ready for filing
                </Box>

                {readyToFileCount !== 0 && (
                    <Box>
                        {((preOnboardingCount + readyToFileCount + optedOutCount) !== totalCount) && (
                            <Box css={{stack: 'x', gap: 'medium', marginTop: 'medium'}}>
                                <Box css={{width: 'fill'}}>
                                    <Link css={{width: 'fill'}} href={externalLink} target="_blank">
                                        <Button
                                            type="secondary"
                                            css={{ width: 'fill', alignX: 'center' }}>
                                            Continue onboarding
                                            <Icon name="external" size="xsmall"/>
                                        </Button>
                                    </Link>
                                </Box>
                            </Box>
                        )}
                    </Box>
                )}
            </Box>
        )}

    </Box>
);

export default JurisdictionHeader;
