import React, {useEffect, useMemo, useState} from "react";
import {Box, ContextView} from "@stripe/ui-extension-sdk/ui";
import TaxuallyIcon from "../../../assets/branding/taxually-icon-light.svg";
import {BackButton} from "../../components/BackButton";
import {ExtensionContextValue} from "@stripe/ui-extension-sdk/context";
import FilingFooter from "./components/FilingFooter";
import FilingHeader from "./components/FilingHeader";
import FilingSummary from "./components/FilingSummary";
import FilingSearch from "./components/FilingSearch";
import FilingList from "./components/FilingList";
import {createTaxReturnFilingSelections, getSelectedAwaitingApprovalTaxReturns} from "../../../utils/filing-utils";
import moment from "moment";
import {useNavigate} from "react-router-dom";
import {createApiClient} from "../../../api/api-client";
import {
    TaxReturnFiling,
    TaxReturnFilingApprovalUpdateParam,
    TaxReturnFilings,
    TaxReturnStatus
} from "../../../interfaces/tax-return";
import {Account} from "../../../interfaces/account";
import {showToast} from "@stripe/ui-extension-sdk/utils";
import {MenuList} from "../../components/MenuList";
import {HelpData} from "../../../interfaces/help";

type Props = {
    userContext: ExtensionContextValue["userContext"],
    environment: ExtensionContextValue["environment"]
}

type FilingsPage = {
    isLoading: boolean,
    isRequesting: boolean,
    isError: boolean,
    errorMessage: string,
    selectedDate: string,
    searchTerm: string,
    estimatedTaxDue: number|null,
    estimatedTaxDueCurrencyCode: string,
    taxReturns: TaxReturnFilingSelection[],
    futureTaxReturns: TaxReturnFiling[],
    automaticApprovalEnabled :boolean,
    contactUsUrl: string
}

export interface TaxReturnFilingSelection extends TaxReturnFiling {
    isSelected: boolean
}

const Filings = (props: Props) => {
    const navigate = useNavigate();
    const {userContext, environment} = props;
    const [filingsPage, setFilingsPage] =
        useState<FilingsPage>({
            isLoading: true,
            isRequesting: false,
            isError: false,
            errorMessage: '',
            selectedDate: moment().subtract(1, 'months').format('YYYY-MM'),
            searchTerm: '',
            estimatedTaxDue: 0,
            estimatedTaxDueCurrencyCode: '',
            taxReturns: [],
            futureTaxReturns: [],
            automaticApprovalEnabled: false,
            contactUsUrl: ''
        });

    const apiClient = useMemo(() =>
        createApiClient(userContext, environment), [userContext]);

    /**
     * Fetches account filings for a given period from the API
     */
    const getFilings = async (dateYYYYMM: string, userContext: ExtensionContextValue["userContext"]) => {
        let page: FilingsPage = {...filingsPage};
        try {
            // show loader and clear out any error messages
            page = {...page,
                isLoading: true,
                isError: false,
                errorMessage: '',
                taxReturns: [],
                futureTaxReturns: []
            }
            setFilingsPage(page)

            const helpData: HelpData = await apiClient.get(`/help`);
            const account: Account =
                await apiClient.get(`/accounts/${userContext.account.id}`);
            const response: TaxReturnFilings =
                await apiClient.get(`/accounts/${
                    userContext.account.id}/jurisdictions/tax-return-filings?endMonthYear=${
                    encodeURIComponent(dateYYYYMM)}`);
            const taxReturnSelection: TaxReturnFilingSelection[] =
                createTaxReturnFilingSelections(response.filings||[]);

            page = {...page,
                searchTerm: '',
                selectedDate: dateYYYYMM,
                taxReturns: taxReturnSelection,
                futureTaxReturns: response.future_filings||[],
                estimatedTaxDue: response.estimated_tax_due,
                estimatedTaxDueCurrencyCode: response.estimated_tax_currency_code,
                automaticApprovalEnabled: account.auto_approve_tax_returns,
                contactUsUrl: helpData.contact_us_url
            }
        } catch (error: unknown) {
            page = {...page,
                isError: true,
                errorMessage: "There was an error fetching your filings. Please refresh and try again."
            }
        } finally {
            setFilingsPage({...page, isLoading: false})
        }
    };

    /**
     * Updates account jurisdiction configurations to the API
     */
    const approveTaxReturns = async () => {
        let page: FilingsPage = {...filingsPage};
        try {
            // show loader and clear out any error messages
            page = {...page, isRequesting: true, isError: false, errorMessage: ''}
            setFilingsPage(page)

            const selectedTaxReturns: TaxReturnFilingApprovalUpdateParam[] =
                getSelectedAwaitingApprovalTaxReturns(page.taxReturns)

            const request = {
                filings_to_approve: selectedTaxReturns
            }

            // approve tax returns
            await apiClient.put(
                `/accounts/${userContext.account.id}/jurisdictions/tax-return-filings/filing-approval`,
                request);

            // re-fetch latest and refresh
            const response: TaxReturnFilings =
                await apiClient.get(`/accounts/${
                    userContext.account.id}/jurisdictions/tax-return-filings?endMonthYear=${
                    encodeURIComponent(filingsPage.selectedDate)}`);
            const taxReturnSelection: TaxReturnFilingSelection[] =
                createTaxReturnFilingSelections(response.filings||[]);

            setFilingsPage(page)

            await new Promise(resolve => setTimeout(resolve, 500));

            page = {...page,
                taxReturns: taxReturnSelection,
                futureTaxReturns: response.future_filings||[],
                estimatedTaxDue: response.estimated_tax_due,
                estimatedTaxDueCurrencyCode: response.estimated_tax_currency_code
            }

            await showToast(
                `${selectedTaxReturns.length} return${selectedTaxReturns.length === 1 ? "" : "s"} approved`,
                {type: "success"});

        } catch (error: unknown) {
            page = {...page,
                isError: true,
                errorMessage: "There was an error approving the returns. Please refresh and try again."
            }
        } finally {
            setFilingsPage({...page, isRequesting: false})
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await getFilings(filingsPage.selectedDate, userContext);
        };
        void fetchData();
    }, [filingsPage.selectedDate, userContext]);

    const handleDateChange = (date: string) => {
        setFilingsPage({...filingsPage,
            selectedDate: date
        })
    };

    const handleSearch = (term: string) => {
        setFilingsPage({...filingsPage,
            searchTerm: term
        })
    };

    const handleTaxReturnSelect = (taxReturnId: string, isSelected: boolean) => {
        setFilingsPage(prev => ({
            ...prev,
            taxReturns: prev.taxReturns.map(tr =>
                tr.tax_return_id === taxReturnId ? { ...tr, isSelected } : tr
            )
        }));
    };

    const handleViewTaxReturn = (taxReturnId: string) => {
        navigate(`/tax-return/${taxReturnId}`);
    };

    const selectedAwaitingApprovalCount = useMemo(() => {
        return filingsPage.taxReturns.filter(tr =>
            tr.isSelected && tr.status === TaxReturnStatus.AWAITING_APPROVAL
        ).length;
    }, [filingsPage.taxReturns]);

    const filteredFilings = useMemo(() => {
        return filingsPage.taxReturns.filter(filing =>
            filing.jurisdiction_name.toLowerCase().includes(filingsPage.searchTerm.toLowerCase())
        );
    }, [filingsPage.taxReturns, filingsPage.searchTerm]);

    const filteredFutureFilings = useMemo(() => {
        return filingsPage.futureTaxReturns.filter(filing =>
            filing.jurisdiction_name.toLowerCase().includes(filingsPage.searchTerm.toLowerCase())
        );
    }, [filingsPage.futureTaxReturns, filingsPage.searchTerm]);


    const filingCounts = useMemo(() => {
        const fetchingData = filingsPage.taxReturns.filter(
            r => r.status === TaxReturnStatus.FETCHING_DATA).length;
        const awaitingApproval = filingsPage.taxReturns.filter(
            r => r.status === TaxReturnStatus.AWAITING_APPROVAL).length;
        const pendingFiling = filingsPage.taxReturns.filter(
            r => r.status === TaxReturnStatus.PENDING_FILING).length;
        const filed = filingsPage.taxReturns.filter(
            r => r.status === TaxReturnStatus.FILED).length;
        const error = filingsPage.taxReturns.filter(
            r => r.status === TaxReturnStatus.ERROR).length;

        return {fetchingData, awaitingApproval, pendingFiling, filed, error};
    }, [filingsPage.taxReturns]);

    return (

        <ContextView
            title="Filings"
            brandColor="#161660"
            brandIcon={TaxuallyIcon}
            banner={
            <>
                <Box css={{paddingLeft: 'medium', paddingRight: 'large'}}>
                    <Box css={{ stack: 'x', gap: 'medium' }}>
                        <Box css={{ width: '1/2' }}>
                            <BackButton navigationLabel="Back"/>
                        </Box>
                        <Box css={{ width: '1/2', textAlign: 'right' }}>
                            <MenuList currentRoute="/filings" />
                        </Box>
                    </Box>
                    <FilingHeader selectedDate={filingsPage.selectedDate} onDateChange={handleDateChange} />
                </Box>
            </>
            }
            footerContent={filingCounts.awaitingApproval > 0
                ? <FilingFooter selectedCount={selectedAwaitingApprovalCount}
                                selectedDate={filingsPage.selectedDate}
                                isRequesting={filingsPage.isRequesting}
                                isError={filingsPage.isError}
                                errorMessage={filingsPage.errorMessage}
                                onApprove={approveTaxReturns}/>
                : null}
        >

            {filingsPage.isError && (
                <Box css={{marginTop: 'medium', marginBottom: 'medium', textAlign: 'center', color: 'critical'}}>
                    {filingsPage.errorMessage}
                </Box>
            )}

            <FilingSummary
                selectedDate={filingsPage.selectedDate}
                awaitingCount={filingCounts.awaitingApproval}
                pendingCount={filingCounts.pendingFiling}
                filedCount={filingCounts.filed}
                errorCount={filingCounts.error}
                estimatedTaxDue={filingsPage.estimatedTaxDue}
                currency={filingsPage.estimatedTaxDueCurrencyCode}
            />

            <FilingSearch searchTerm={filingsPage.searchTerm} onSearch={handleSearch} />

            <FilingList
                isLoading={filingsPage.isLoading}
                filings={filteredFilings}
                futureFilings={filteredFutureFilings}
                selectedDate={filingsPage.selectedDate}
                onTaxReturnSelect={handleTaxReturnSelect}
                onViewTaxReturn={handleViewTaxReturn}
                automaticApprovalEnabled={filingsPage.automaticApprovalEnabled}
                contactUsUrl={filingsPage.contactUsUrl}
            />

        </ContextView>
    );
};

export default Filings;
