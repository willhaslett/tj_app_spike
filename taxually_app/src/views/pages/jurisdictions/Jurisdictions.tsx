import {Box, Button, ContextView} from "@stripe/ui-extension-sdk/ui";
import TaxuallyIcon from "../../../assets/branding/taxually-icon-light.svg";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {ExtensionContextValue} from "@stripe/ui-extension-sdk/context";
import {
    TaxJurisdiction,
    TaxJurisdictionStatus,
    TaxJurisdictionTaxCollectionData
} from "../../../interfaces/jurisdictions";
import {createApiClient} from "../../../api/api-client";
import {
    populateDefaultLoaderTaxJurisdictionTaxData,
    populateTaxJurisdictionTaxData
} from "../../../utils/jurisdiction-utils";
import JurisdictionHeader from "./components/JurisdictionHeader";
import JurisdictionList from "./components/JurisdictionList";
import JurisdictionFooter from "./components/JurisdictionFooter";
import {useNavigate} from "react-router-dom";
import {RedirectUrls} from "../../../interfaces/account";
import {Eligibility} from "../../../interfaces/eligibility";

type Props = {
    reSyncJurisdictions: () => void,
    userContext: ExtensionContextValue["userContext"],
    environment: ExtensionContextValue["environment"]
}

type JurisdictionsPage = {
    isLoading: boolean,
    isRequesting: boolean,
    isError: boolean,
    errorMessage: string,
    jurisdictions: TaxJurisdictionTaxData[],
    redirectUrls: RedirectUrls,
    eligibleForFilings: boolean
}

export interface TaxJurisdictionTaxData extends TaxJurisdiction {
    tax_collected: number|null;
    currency_code: string|null;
}

const Jurisdictions = (props: Props) => {
    const {reSyncJurisdictions, userContext, environment} = props;
    const navigate = useNavigate();
    const [jurisdictionsPage, setJurisdictionsPage] =
        useState<JurisdictionsPage>({
            isLoading: true,
            isRequesting: false,
            isError: false,
            errorMessage: '',
            jurisdictions: [],
            redirectUrls: {
                jurisdiction_selection_url: '',
                continue_onboarding_url: ''
            },
            eligibleForFilings: false
        });

    const apiClient = useMemo(() =>
        createApiClient(userContext, environment), [userContext]);

    const isCancelledRef = useRef(false);
    const isEligibleCancelledRef = useRef(false);

    useEffect(() => {
        return () => {
            // Set isCancelled to true when the component unmounts or the route changes
            isCancelledRef.current = true;
            isEligibleCancelledRef.current = true;
        };
    }, []);

    /**
     * Fetches account jurisdictions from the API
     */
    const getJurisdictions = async (userContext: ExtensionContextValue["userContext"]) => {
        let page: JurisdictionsPage = {...jurisdictionsPage};
        try {
            // show loader and clear out any error messages
            page = {...page, isLoading: true, isError: false, errorMessage: ''}
            setJurisdictionsPage(page)

            const eligibility: Eligibility =
                await apiClient.get(`/accounts/${userContext.account.id}/eligibility`);
            const taxJurisdictions: TaxJurisdiction[] =
                await apiClient.get(`/accounts/${userContext.account.id}/jurisdictions`);
            const redirectUrls: RedirectUrls = await apiClient.get(`/accounts/${userContext.account.id}/redirect-urls`);
            const taxJurisdictionTaxData: TaxJurisdictionTaxData[] =
                populateDefaultLoaderTaxJurisdictionTaxData(taxJurisdictions);

            page = {...page,
                isLoading: false,
                jurisdictions: taxJurisdictionTaxData,
                redirectUrls: redirectUrls,
                eligibleForFilings: eligibility.filing.eligible
            }

            setJurisdictionsPage(page)

            if (!eligibility.filing.eligible) {
                // call api to get account eligibility
                void getAccountEligibility(page)
            }

            // TODO Uncomment once we have month to date totals
            // call api to populate tax data
            // void getJurisdictionsTaxData(taxJurisdictions, redirectUrls)
        } catch (error: unknown) {
            page = {...page,
                isError: true,
                errorMessage: "There was an error fetching your jurisdictions. Please refresh and try again."
            }
        } finally {
            setJurisdictionsPage({...page, isLoading: false})
        }
    };

    /**
     * Fetches account eligibility from the API
     */
    const getAccountEligibility = async (page: JurisdictionsPage) => {
        try {
            let shouldRetry = true;
            let isFirstAttempt = true;

            while (shouldRetry && !isEligibleCancelledRef.current) {
                if (!isFirstAttempt) {
                    // Start the delay
                    const delay = 5000; // Start at 5000ms (5 seconds)
                    await new Promise(resolve => setTimeout(resolve, delay));
                }

                const eligibility: Eligibility =
                    await apiClient.get(`/accounts/${userContext.account.id}/eligibility`);

                // Check if filings is not eligible
                shouldRetry = !eligibility.filing.eligible;

                page = {
                    ...page,
                    eligibleForFilings: eligibility.filing.eligible
                };

                setJurisdictionsPage(page);

                isFirstAttempt = false; // Mark that the first attempt has been made
            }
        } catch (error: unknown) {
            page = {
                ...page,
                isLoading: false,
                isError: true,
                errorMessage: "There was an error fetching your eligibility data. Please refresh and try again."
            };
        } finally {
            setJurisdictionsPage(page);
        }
    };

    /**
     * Fetches account jurisdictions tax data from the API
     */
    const getJurisdictionsTaxData = async (jurisdictions: TaxJurisdiction[],
                                           redirectUrls: RedirectUrls) => {
        let page: JurisdictionsPage = { ...jurisdictionsPage };
        try {
            let shouldRetry = true;
            let isFirstAttempt = true;
            let retryCount = 0;

            while (shouldRetry && !isCancelledRef.current) {
                if (!isFirstAttempt) {
                    // Start the delay at 2 seconds and use exponential backoff with a cap at 1 minute
                    // first retry 2 seconds, second 4 seconds, third 8 seconds, fourth 16 seconds and so on capped at 1 min
                    const delay = Math.min(2000 * 2 ** retryCount, 60000); // Start at 2000ms (2 seconds)
                    await new Promise(resolve => setTimeout(resolve, delay));
                }

                const taxData: TaxJurisdictionTaxCollectionData[] =
                    await apiClient.get(`/accounts/${userContext.account.id}/jurisdictions/tax-collected`);
                const taxJurisdictionTaxData: TaxJurisdictionTaxData[] =
                    populateTaxJurisdictionTaxData(jurisdictions, taxData);

                // Check if any tax_collected values are null
                shouldRetry = taxJurisdictionTaxData.some(data =>
                    data.tax_collected === null && data.status !== TaxJurisdictionStatus.OPTED_OUT_FROM_FILING);

                page = {
                    ...jurisdictionsPage,
                    isLoading: false,
                    jurisdictions: taxJurisdictionTaxData,
                    redirectUrls: redirectUrls
                };

                setJurisdictionsPage(page);

                isFirstAttempt = false; // Mark that the first attempt has been made
                retryCount++; // Increment the retry count
            }
        } catch (error: unknown) {
            page = {
                ...jurisdictionsPage,
                isLoading: false,
                isError: true,
                errorMessage: "There was an error fetching your jurisdictions tax data. Please refresh and try again."
            };
        } finally {
            setJurisdictionsPage(page);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await getJurisdictions(userContext);
        };
        void fetchData();
    }, [userContext]);

    const jurisdictionCounts = useMemo(() => {
        const preOnboarding = jurisdictionsPage.jurisdictions.filter(
            j => j.status === TaxJurisdictionStatus.PRE_ONBOARDING).length;
        const onboarding = jurisdictionsPage.jurisdictions.filter(
            j => j.status === TaxJurisdictionStatus.ONBOARDING).length;
        const readyToFile = jurisdictionsPage.jurisdictions.filter(
            j => j.status === TaxJurisdictionStatus.READY_TO_FILE).length;
        const optedOut = jurisdictionsPage.jurisdictions.filter(
            j => j.status === TaxJurisdictionStatus.OPTED_OUT_FROM_FILING).length;
        const scheduled = jurisdictionsPage.jurisdictions.filter(
            j => j.status === TaxJurisdictionStatus.SCHEDULED_FOR_FILING).length;
        const needsAttention = jurisdictionsPage.jurisdictions.filter(
            j => j.status === TaxJurisdictionStatus.NEEDS_ATTENTION).length;

        // expired shouldn't be returned, because you can have duplicate jurisdictions. in case it is, remove from total
        const expired = jurisdictionsPage.jurisdictions.filter(
            j => j.status === TaxJurisdictionStatus.EXPIRED).length;
        const total = jurisdictionsPage.jurisdictions.length - expired;

        return {total, preOnboarding, onboarding, readyToFile, optedOut, scheduled, needsAttention, expired};
    }, [jurisdictionsPage.jurisdictions]);

    return (

        <ContextView
            title="Jurisdictions"
            brandColor="#161660"
            brandIcon={TaxuallyIcon}
            banner={
                <>
                    <Box css={{stack: 'x', gap: 'medium', paddingLeft: 'medium', paddingRight: 'large'}}>
                        <Box css={{width: '1/2'}}>
                            <Button type="secondary" css={{ width: 'fill' }} size="small" onPress={() => navigate("/settings")}>
                                Account Settings
                            </Button>
                        </Box>
                        <Box css={{width: '1/2'}}>
                            <Button type="secondary" css={{ width: 'fill' }} size="small" onPress={() => navigate("/support")}>
                                Support
                            </Button>
                        </Box>
                    </Box>
                </>
            }
            footerContent={
                <JurisdictionFooter
                    isLoading={jurisdictionsPage.isLoading}
                    eligibleForFilings={jurisdictionsPage.eligibleForFilings}
                    readyToFileCount={jurisdictionCounts.readyToFile}
                    preOnboardingCount={jurisdictionCounts.preOnboarding}
                    optedOutCount={jurisdictionCounts.optedOut}
                    totalCount={jurisdictionCounts.total}
                    onboardingLink={jurisdictionsPage.redirectUrls.jurisdiction_selection_url}
                    externalLink={jurisdictionsPage.redirectUrls.continue_onboarding_url}
            />}
        >

            {jurisdictionsPage.isError && (
                <Box css={{marginTop: 'medium', marginBottom: 'medium', textAlign: 'center', color: 'critical'}}>
                    {jurisdictionsPage.errorMessage}
                </Box>
            )}

            <JurisdictionHeader
                isLoading={jurisdictionsPage.isLoading}
                eligibleForFilings={jurisdictionsPage.eligibleForFilings}
                readyToFileCount={jurisdictionCounts.readyToFile}
                preOnboardingCount={jurisdictionCounts.preOnboarding}
                optedOutCount={jurisdictionCounts.optedOut}
                totalCount={jurisdictionCounts.total}
                externalLink={jurisdictionsPage.redirectUrls.continue_onboarding_url}
            />

            <JurisdictionList
                reSyncJurisdictions={reSyncJurisdictions}
                isLoading={jurisdictionsPage.isLoading}
                jurisdictions={jurisdictionsPage.jurisdictions}
                onboardingLink={jurisdictionsPage.redirectUrls.jurisdiction_selection_url}
            />

        </ContextView>
    );
};

export default Jurisdictions;
