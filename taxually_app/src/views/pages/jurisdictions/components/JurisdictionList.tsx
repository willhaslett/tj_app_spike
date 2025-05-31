import React from 'react';
import {
    Badge,
    Box,
    Button,
    Divider,
    Icon,
    Img,
    Inline,
    Link,
    List,
    ListItem,
    Spinner,
    Tooltip
} from "@stripe/ui-extension-sdk/ui";
import {TaxJurisdictionTaxData} from "../Jurisdictions";
import {getReadableJurisdictionStatus, groupJurisdictionsByStatus} from "../../../../utils/jurisdiction-utils";
import {useNavigate} from "react-router-dom";
import {TaxJurisdictionStatus} from "../../../../interfaces/jurisdictions";
import {truncateStringWithEllipsis} from "../../../../utils/global-utils";
import {flagSvgImages} from "../../../../assets/flags";
import {disabledFlagSvgImages} from "../../../../assets/flags-disabled";

interface JurisdictionListProps {
    reSyncJurisdictions: () => void;
    isLoading: boolean;
    jurisdictions: TaxJurisdictionTaxData[];
    onboardingLink: string;
}

const JurisdictionList: React.FC<JurisdictionListProps> = ({
                                                               reSyncJurisdictions,
                                                               isLoading,
                                                               jurisdictions,
                                                               onboardingLink
                                                           }) => {

    const groupedJurisdictions: { notSubscribed: TaxJurisdictionTaxData[], others: TaxJurisdictionTaxData[] } =
        groupJurisdictionsByStatus(jurisdictions);

    const subscribedJurisdictions = groupedJurisdictions.others;
    const notSubscribedJurisdictions = groupedJurisdictions.notSubscribed;


    const navigate = useNavigate();

    const renderBadge = (status: TaxJurisdictionStatus) => {
        if (status === TaxJurisdictionStatus.PRE_ONBOARDING) {
            return (
                <Tooltip type="description"
                         delay={0}
                         trigger={
                             <Link onPress={undefined}>
                                 <Badge type="neutral">{getReadableJurisdictionStatus(status)}</Badge>
                             </Link>
                         }>
                    This jurisdiction has yet to be configured
                </Tooltip>
            );
        } else if (status === TaxJurisdictionStatus.ONBOARDING) {
            return (
                <Tooltip type="description"
                         delay={0}
                         trigger={
                             <Link onPress={undefined}>
                                 <Badge type="info">{getReadableJurisdictionStatus(status)}</Badge>
                             </Link>
                         }>
                    This jurisdiction is currently being configured
                </Tooltip>
            );
        } else if (status === TaxJurisdictionStatus.REGISTRATION_APPLICATION_IN_PROGRESS) {
            return (
                <Tooltip type="description"
                         delay={0}
                         trigger={
                             <Link onPress={undefined}>
                                 <Badge type="warning">{getReadableJurisdictionStatus(status)}</Badge>
                             </Link>
                         }>
                    There are steps you need to complete for your registration
                </Tooltip>
            );
        } else if (status === TaxJurisdictionStatus.REGISTRATION_APPLICATION_IN_REVIEW) {
            return (
                <Tooltip type="description"
                         delay={0}
                         trigger={
                             <Link onPress={undefined}>
                                 <Badge type="info">{getReadableJurisdictionStatus(status)}</Badge>
                             </Link>
                         }>
                    Your registration is being verified by Taxually
                </Tooltip>
            );
        } else if (status === TaxJurisdictionStatus.PENDING_AUTHORITY_APPROVAL) {
            return (
                <Tooltip type="description"
                         delay={0}
                         trigger={
                             <Link onPress={undefined}>
                                 <Badge type="info">{getReadableJurisdictionStatus(status)}</Badge>
                             </Link>
                         }>
                    Registration submitted to the government authority and is awaiting completion
                </Tooltip>
            );
        } else if (status === TaxJurisdictionStatus.READY_TO_FILE) {
            return (
                <Tooltip type="description"
                         delay={0}
                         trigger={
                             <Link onPress={undefined}>
                                 <Badge type="positive">{getReadableJurisdictionStatus(status)}</Badge>
                             </Link>
                         }>
                    This jurisdiction is good to go! Click {`"Go to Filings"`} to continue
                </Tooltip>
            );
        } else {
            return (
                <Badge type={(status === TaxJurisdictionStatus.NEEDS_ATTENTION || status === TaxJurisdictionStatus.EXPIRED)
                    ? "warning"
                    : "neutral"}>
                    {getReadableJurisdictionStatus(status)}
                </Badge>
            );
        }
    }

    const renderJurisdiction = (jurisdiction: TaxJurisdictionTaxData) => (
        <ListItem
            key={jurisdiction.jurisdiction_id}
            id={jurisdiction.jurisdiction_id}
            image={
                <Img
                    height="12"
                    src={flagSvgImages[jurisdiction.country_code]}
                    alt={jurisdiction.country_code}
                />
            }
            title={
                <Box>
                    <Link onPress={() => navigate(`/jurisdictions/${jurisdiction.jurisdiction_id}`)}>
                        <Box css={{color: 'brand'}}>
                            {truncateStringWithEllipsis(jurisdiction.jurisdiction_name, 15)}
                        </Box>
                    </Link>
                </Box>
            }
            value={
                <>
                    <Box css={{paddingTop: 'small', paddingBottom: 'small'}}>
                        <Box css={{textAlign: 'right'}}>
                            {renderBadge(jurisdiction.status)}
                        </Box>
                    </Box>

                    {/* TODO Uncomment once we have month to date totals implemented
                    <Box>
                        <Box css={{
                            font: 'caption',
                            textAlign: 'right'
                        }}>
                            {(jurisdiction.tax_collected === null || jurisdiction.currency_code === null) && (
                                <Tooltip
                                    delay={0}
                                    type="description"
                                    trigger={<Spinner />}
                                >
                                    One moment... {`We're`} getting tax data from Stripe
                                </Tooltip>

                            )}
                            {(jurisdiction.tax_collected !== null && jurisdiction.currency_code !== null) && (
                                <Box css={{font: 'bodyEmphasized'}}>
                                    {formatCurrencyWithCode(jurisdiction.tax_collected, jurisdiction.currency_code, true)}
                                </Box>
                            )}
                        </Box>
                        <Box css={{textAlign: 'right', marginTop: 'xsmall'}}>
                            {renderBadge(jurisdiction.status)}
                        </Box>
                    </Box>*/}
                </>
            }
        />
    );

    const renderOptedOutJurisdiction = (jurisdiction: TaxJurisdictionTaxData) => (
        <ListItem
            key={jurisdiction.jurisdiction_id}
            id={jurisdiction.jurisdiction_id}
            image={
                <Img
                    height="12"
                    src={disabledFlagSvgImages[jurisdiction.country_code]}
                    alt={jurisdiction.country_code}
                />
            }
            title={
                <Box>
                    <Box css={{color: 'disabled'}}>
                        {truncateStringWithEllipsis(jurisdiction.jurisdiction_name, 15)}
                    </Box>
                </Box>
            }
            value={
                <Tooltip
                    type="description"
                    delay={0}
                    trigger={
                        <Link onPress={undefined}>
                            <Box css={{
                                font: 'caption',
                                paddingTop: 'small',
                                paddingBottom: 'small',
                                textAlign: 'right'
                            }}>
                                <Badge type="neutral">Not started</Badge>
                            </Box>
                        </Link>
                    }
                >
                    You have chosen not to file with Taxually in this jurisdiction
                </Tooltip>

            }
        />
    );

    return (
        <Box>

            <Box css={{stack: 'x', alignY: 'bottom', marginTop: 'medium', marginBottom: 'small' }}>
                <Box css={{width: '1/2'}}>
                    <Box css={{font: 'body', color: 'secondary', fontWeight: 'semibold'}}>Jurisdiction</Box>
                </Box>

                <Box css={{width: '1/2', textAlign: 'right', marginTop: 'small'}}>
                    <Button type="secondary" size="small" onPress={() => reSyncJurisdictions()}>
                        <Icon name="refresh" size="xsmall"/>
                        <Inline css={{marginLeft: 'xsmall'}}>
                            Sync
                        </Inline>
                    </Button>
                </Box>

                {/* TODO Uncomment once we have month to date totals
                <Box css={{width: '1/2', textAlign: 'right'}}>
                    <Box css={{font: 'body', color: 'secondary', fontWeight: 'semibold'}}>Tax collected</Box>
                    <Box css={{marginTop: 'xxsmall', font: 'body', color: 'disabled'}}>(month-to-date)</Box>
                </Box>*/}
            </Box>

            <Divider />

            <Box>
                {isLoading && (
                    <Box css={{width: 'fill', textAlign: 'center', alignX: 'center', alignY: 'center'}}>
                        <Spinner size='large'/>
                    </Box>
                )}

                {(jurisdictions.length === 0 && !isLoading) ? (
                    <Box css={{marginTop: 'medium', textAlign: 'center', font: 'caption'}}>
                        Before setting up filing, you need to add your registrations in Stripe.{` `}
                        <Inline>
                            <Link href="https://dashboard.stripe.com/tax/registrations">
                                Add a registration now.
                            </Link>
                        </Inline>
                    </Box>
                ) : subscribedJurisdictions.length === 0 && !isLoading ? (
                    <Box css={{marginTop: 'medium', textAlign: 'center', font: 'caption'}}>
                        <Inline>
                            No jurisdictions to display.
                        </Inline>
                    </Box>
                    ) : (
                    <List aria-label="Jurisdictions-List">
                        {subscribedJurisdictions.map((jurisdiction) =>
                            renderJurisdiction(jurisdiction)
                        )}
                    </List>
                )}
            </Box>


            {notSubscribedJurisdictions.length > 0 && (
                <Box>
                    <Box css={{stack: 'x', alignY: 'bottom', marginTop: 'large' }}>
                        <Box css={{width: 'fill'}}>
                            <Box css={{font: 'body', color: 'secondary', fontWeight: 'semibold'}}>Not started</Box>
                        </Box>
                    </Box>

                    <Divider />

                    <List aria-label="Jurisdictions-List">
                        {notSubscribedJurisdictions.map((jurisdiction) =>
                            renderOptedOutJurisdiction(jurisdiction)
                        )}
                    </List>

                    {subscribedJurisdictions.length !== 0 && (
                        <Box css={{marginTop: 'small'}}>
                            <Link css={{width: 'fill'}} href={onboardingLink} target="_blank">
                                <Button
                                    type="secondary"
                                    css={{ width: 'fill', alignX: 'center' }}>
                                    Start onboarding
                                    <Icon name="external" size="xsmall"/>
                                </Button>
                            </Link>
                        </Box>
                    )}

                </Box>
            )}

        </Box>
    );
};

export default JurisdictionList;
