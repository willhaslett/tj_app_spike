import {Badge, Box, Button, ContextView, Icon, Img, Inline, Link, Spinner} from "@stripe/ui-extension-sdk/ui";
import TaxuallyIcon from "../../../assets/branding/taxually-icon-light.svg";
import {BackButton} from "../../components/BackButton";
import {ExtensionContextValue} from "@stripe/ui-extension-sdk/context";
import React, {useEffect, useMemo, useState} from "react";
import {createApiClient} from "../../../api/api-client";
import {getReadableJurisdictionStatus} from "../../../utils/jurisdiction-utils";
import {useParams} from "react-router-dom";
import {TaxJurisdiction, TaxJurisdictionStatus} from "../../../interfaces/jurisdictions";
import {flagSvgImages} from "../../../assets/flags";
import {RedirectUrls} from "../../../interfaces/account";
import {HelpData} from "../../../interfaces/help";
import {Eligibility} from "../../../interfaces/eligibility";

type Props = {
    userContext: ExtensionContextValue["userContext"],
    environment: ExtensionContextValue["environment"]
}

type JurisdictionPage = {
    isLoading: boolean,
    isRequesting: boolean,
    isError: boolean,
    errorMessage: string,
    jurisdiction: TaxJurisdiction|null
    redirectUrls: RedirectUrls,
    contactUsUrl: string,
    eligibleForFilings: boolean
}

const Jurisdiction = (props: Props) => {
    const {jurisdictionId} = useParams();
    const {userContext, environment} = props;
    const [jurisdictionPage, setJurisdictionPage] =
        useState<JurisdictionPage>({
            isLoading: true,
            isRequesting: false,
            isError: false,
            errorMessage: '',
            jurisdiction: null,
            redirectUrls: {
                jurisdiction_selection_url: '',
                continue_onboarding_url: ''
            },
            contactUsUrl: '',
            eligibleForFilings: false
        });

    const apiClient = useMemo(() =>
        createApiClient(userContext, environment), [userContext]);

    /**
     * Fetches account jurisdiction from the API
     */
    const getJurisdiction = async (jurisdictionId: string|undefined,
                                   userContext: ExtensionContextValue["userContext"]) => {
        let page: JurisdictionPage = {...jurisdictionPage};
        try {
            // show loader and clear out any error messages
            page = {...page, isLoading: true, isError: false, errorMessage: ''}
            setJurisdictionPage(page)

            if (!jurisdictionId) {
                page = {...page,
                    isError: true,
                    errorMessage: "There was an error fetching your jurisdiction. Please go back to Jurisdictions."
                }
            } else {
                const helpData: HelpData = await apiClient.get(`/help`);
                const eligibility: Eligibility =
                    await apiClient.get(`/accounts/${userContext.account.id}/eligibility`);
                const taxJurisdiction: TaxJurisdiction =
                    await apiClient.get(`/accounts/${userContext.account.id}/jurisdictions/${jurisdictionId}`);
                const redirectUrls: RedirectUrls = await apiClient.get(`/accounts/${userContext.account.id}/redirect-urls`);

                page = {...page,
                    jurisdiction: taxJurisdiction,
                    redirectUrls: redirectUrls,
                    contactUsUrl: helpData.contact_us_url,
                    eligibleForFilings: eligibility.filing.eligible
                }
            }
        } catch (error: unknown) {
            page = {...page,
                isError: true,
                errorMessage: "There was an error fetching your jurisdiction. " +
                    "Please refresh and try again or go back to Jurisdictions"
            }
        } finally {
            setJurisdictionPage({...page, isLoading: false})
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await getJurisdiction(jurisdictionId, userContext);
        };
        void fetchData();
    }, [jurisdictionId, userContext]);

    const getBadgeType = (status: TaxJurisdictionStatus) => {
        switch (status) {
            case TaxJurisdictionStatus.NEEDS_ATTENTION:
            case TaxJurisdictionStatus.EXPIRED:
                return "warning";
            case TaxJurisdictionStatus.ONBOARDING:
                return "info";
            case TaxJurisdictionStatus.READY_TO_FILE:
                return "positive";
            case TaxJurisdictionStatus.REGISTRATION_APPLICATION_IN_PROGRESS:
                return "warning";
            case TaxJurisdictionStatus.REGISTRATION_APPLICATION_IN_REVIEW:
            case TaxJurisdictionStatus.PENDING_AUTHORITY_APPROVAL:
                return "info";
            default:
                return "neutral";
        }
    }

    const renderBadge = (status: TaxJurisdictionStatus) => (
        <Badge type={getBadgeType(status)}>
            {getReadableJurisdictionStatus(status)}
        </Badge>
    );

    const getJurisdictionRedirectUrl = (status: TaxJurisdictionStatus, redirectUrls: RedirectUrls): string => {
        if (status === TaxJurisdictionStatus.PRE_ONBOARDING) {
            return redirectUrls.jurisdiction_selection_url;
        } else if (status === TaxJurisdictionStatus.ONBOARDING) {
            return redirectUrls.continue_onboarding_url;
        } else if (status === TaxJurisdictionStatus.REGISTRATION_APPLICATION_IN_PROGRESS) {
            return redirectUrls.continue_onboarding_url;
        } else if (status === TaxJurisdictionStatus.REGISTRATION_APPLICATION_IN_REVIEW) {
            return redirectUrls.continue_onboarding_url;
        } else if (status === TaxJurisdictionStatus.PENDING_AUTHORITY_APPROVAL) {
            return redirectUrls.continue_onboarding_url;
        } else if (status === TaxJurisdictionStatus.READY_TO_FILE) {
            return redirectUrls.continue_onboarding_url;
        } else if (status === TaxJurisdictionStatus.OPTED_OUT_FROM_FILING) {
            return redirectUrls.jurisdiction_selection_url;
        } else if (status === TaxJurisdictionStatus.SCHEDULED_FOR_FILING) {
            return redirectUrls.continue_onboarding_url;
        } else if (status === TaxJurisdictionStatus.NEEDS_ATTENTION) {
            return redirectUrls.continue_onboarding_url;
        } else if (status === TaxJurisdictionStatus.EXPIRED) {
            return redirectUrls.continue_onboarding_url;
        }

        return redirectUrls.continue_onboarding_url;
    }

    const getJurisdictionActionName = (status: TaxJurisdictionStatus): string => {
        if (status === TaxJurisdictionStatus.PRE_ONBOARDING) {
            return "Start onboarding";
        } else if (status === TaxJurisdictionStatus.ONBOARDING) {
            return "Continue onboarding";
        } else if (status === TaxJurisdictionStatus.REGISTRATION_APPLICATION_IN_PROGRESS) {
            return "Manage jurisdiction";
        } else if (status === TaxJurisdictionStatus.REGISTRATION_APPLICATION_IN_REVIEW) {
            return "Manage jurisdiction";
        } else if (status === TaxJurisdictionStatus.PENDING_AUTHORITY_APPROVAL) {
            return "Manage jurisdiction";
        } else if (status === TaxJurisdictionStatus.READY_TO_FILE) {
            return "Manage jurisdiction";
        } else if (status === TaxJurisdictionStatus.OPTED_OUT_FROM_FILING) {
            return "Start onboarding";
        } else if (status === TaxJurisdictionStatus.SCHEDULED_FOR_FILING) {
            return "Manage jurisdiction";
        } else if (status === TaxJurisdictionStatus.NEEDS_ATTENTION) {
            return "View issue on Taxually";
        } else if (status === TaxJurisdictionStatus.EXPIRED) {
            return "Manage jurisdiction";
        }

        return "Manage Jurisdiction";
    }

    return (
        <ContextView
            title={`Jurisdictions ${jurisdictionPage.jurisdiction ? `- ${jurisdictionPage.jurisdiction.jurisdiction_name}` : ""}`}
            brandColor="#161660"
            brandIcon={TaxuallyIcon}
            banner={
                <>
                    <Box css={{paddingLeft: 'medium', paddingRight: 'large'}}>
                        <Box css={{ stack: 'x', gap: 'medium' }}>
                            <Box css={{ width: 'fill' }}>
                                <BackButton navigationLabel="Back"/>
                            </Box>
                        </Box>
                    </Box>
                </>
            }
        >

            {jurisdictionPage.isLoading && (
                <Box css={{width: 'fill', textAlign: 'center', alignX: 'center', alignY: 'center'}}>
                    <Spinner size='large'/>
                </Box>
            )}

            {!jurisdictionPage.isLoading && (
                <>

                    {jurisdictionPage.isError && (
                        <Box css={{marginTop: 'medium', marginBottom: 'medium', textAlign: 'center', color: 'critical'}}>
                            {jurisdictionPage.errorMessage}
                        </Box>
                    )}

                    {jurisdictionPage.jurisdiction && (
                        <>
                            <Box css={{ padding: 'medium', textAlign: 'center' }}>

                                <Box css={{ marginBottom: 'medium' }}>
                                    <Img
                                        src={flagSvgImages[jurisdictionPage.jurisdiction.country_code]}
                                        alt={jurisdictionPage.jurisdiction.country_code}
                                        width="40"
                                        height="30"
                                    />
                                </Box>

                                <Box css={{ font: 'heading', marginBottom: 'large' }}>
                                    {jurisdictionPage.jurisdiction.jurisdiction_name}
                                </Box>

                                <Box css={{marginBottom: 'medium'}}>
                                    {renderBadge(jurisdictionPage.jurisdiction.status)}
                                </Box>

                                {jurisdictionPage.jurisdiction.status === TaxJurisdictionStatus.PRE_ONBOARDING && (
                                    <Box css={{ font: 'bodyEmphasized', marginBottom: 'medium' }}>
                                        This jurisdiction is not configured for filing
                                    </Box>
                                )}

                                {jurisdictionPage.jurisdiction.status === TaxJurisdictionStatus.ONBOARDING && (
                                    <Box css={{ font: 'bodyEmphasized', marginBottom: 'medium' }}>
                                        Your organization is still onboarding with Taxually
                                    </Box>
                                )}

                                {jurisdictionPage.jurisdiction.status === TaxJurisdictionStatus.NEEDS_ATTENTION && (
                                    <Box css={{ font: 'bodyEmphasized', marginBottom: 'medium', color: 'critical' }}>
                                        This jurisdiction requires attention
                                    </Box>
                                )}

                                {jurisdictionPage.jurisdiction.status === TaxJurisdictionStatus.READY_TO_FILE && (
                                    <Box css={{ font: 'bodyEmphasized', marginBottom: 'medium' }}>
                                        {`You're`} all set to file
                                    </Box>
                                )}

                                {jurisdictionPage.jurisdiction.status === TaxJurisdictionStatus.OPTED_OUT_FROM_FILING && (
                                    <Box css={{ font: 'bodyEmphasized', marginBottom: 'medium' }}>
                                        This registration is currently inactive.
                                    </Box>
                                )}

                                {jurisdictionPage.jurisdiction.status === TaxJurisdictionStatus.REGISTRATION_APPLICATION_IN_PROGRESS && (
                                    <Box css={{ font: 'bodyEmphasized', marginBottom: 'medium' }}>
                                        This registration is in progress.
                                    </Box>
                                )}

                                {jurisdictionPage.jurisdiction.status === TaxJurisdictionStatus.REGISTRATION_APPLICATION_IN_REVIEW && (
                                    <Box css={{ font: 'bodyEmphasized', marginBottom: 'medium' }}>
                                        This registration is currently under review.
                                    </Box>
                                )}

                                {jurisdictionPage.jurisdiction.status === TaxJurisdictionStatus.PENDING_AUTHORITY_APPROVAL && (
                                    <Box css={{ font: 'bodyEmphasized', marginBottom: 'medium' }}>
                                        This registration is currently pending authority approval.
                                    </Box>
                                )}

                                {!jurisdictionPage.eligibleForFilings && (
                                    <Box>
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
                                    </Box>
                                )}

                                {jurisdictionPage.eligibleForFilings && (
                                    <Box>
                                        <Link href={getJurisdictionRedirectUrl(
                                            jurisdictionPage.jurisdiction.status,
                                            jurisdictionPage.redirectUrls)} target="_blank">
                                            <Button type="primary" css={{ width: 'fill'}}>
                                                <Inline>
                                                    {getJurisdictionActionName(jurisdictionPage.jurisdiction.status)}
                                                </Inline>
                                                <Icon name="external" size="xsmall"/>
                                            </Button>
                                        </Link>

                                        <Box css={{ font: 'bodyEmphasized', marginBottom: 'small', marginTop: 'medium' }}>
                                            or
                                        </Box>

                                        <Link href={jurisdictionPage.contactUsUrl} type="secondary" target="_blank">
                                            <Box>
                                                <Icon name="email" size="xsmall"/>
                                                <Inline css={{marginLeft: 'xsmall', marginRight: 'xsmall'}}>
                                                    Contact your Taxually representative
                                                </Inline>
                                                <Inline css={{marginTop: 'xsmall', alignY: 'bottom'}}>
                                                    <Icon name="external" size="xsmall"/>
                                                </Inline>

                                            </Box>
                                        </Link>
                                    </Box>
                                )}
                            </Box>
                        </>
                    )}
                </>
            )}

        </ContextView>
    );
};

export default Jurisdiction;
