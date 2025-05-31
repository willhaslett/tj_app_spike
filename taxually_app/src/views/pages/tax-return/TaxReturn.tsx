import {
    Badge,
    Banner,
    Box,
    ContextView,
    Divider,
    Icon,
    Inline,
    Link,
    Spinner,
    Tooltip
} from "@stripe/ui-extension-sdk/ui";
import TaxuallyIcon from "../../../assets/branding/taxually-icon-light.svg";
import React, {useEffect, useMemo, useState} from "react";
import {BackButton} from "../../components/BackButton";
import {ExtensionContextValue} from "@stripe/ui-extension-sdk/context";
import {useParams} from "react-router-dom";
import {NotesSection} from "./components/NotesSection";
import {InfoSection} from "./components/InfoSection";
import {createApiClient} from "../../../api/api-client";
import {TaxReturnFiling, TaxReturnStatus} from "../../../interfaces/tax-return";
import moment from "moment";
import {getReadableTaxReturnStatus} from "../../../utils/filing-utils";
import {JurisdictionInfoSection} from "./components/JurisdictionInfoSection";
import {TwoColumnInfoAmountSection} from "./components/TwoColumnInfoAmountSection";
import {flagSvgImages} from "../../../assets/flags";
import {apiDateFormat} from "../../../configs/config";
import {HelpData} from "../../../interfaces/help";

type Props = {
    userContext: ExtensionContextValue["userContext"],
    environment: ExtensionContextValue["environment"]
}

type TaxReturnPage = {
    isLoading: boolean,
    isRequesting: boolean,
    isError: boolean,
    errorMessage: string,
    isDownloadError: boolean,
    taxReturn: TaxReturnFiling|null,
    contactusUrl: string
}

const TaxReturn = (props: Props) => {
    const {taxReturnId} = useParams();
    const {userContext, environment} = props;
    const [taxReturnPage, setTaxReturnPage] =
        useState<TaxReturnPage>({
            isLoading: true,
            isRequesting: false,
            isError: false,
            errorMessage: '',
            isDownloadError: false,
            taxReturn: null,
            contactusUrl: ''
        });

    const apiClient = useMemo(() =>
        createApiClient(userContext, environment), [userContext]);

    /**
     * Fetches tax return from the API
     */
    const getTaxReturn = async (taxReturnId: string|undefined,
                                userContext: ExtensionContextValue["userContext"]) => {
        let page: TaxReturnPage = {...taxReturnPage};
        try {
            // show loader and clear out any error messages
            page = {...page, isLoading: true, isError: false, errorMessage: ''}
            setTaxReturnPage(page)

            if (!taxReturnId) {
                page = {...page,
                    isError: true,
                    errorMessage: "There was an error fetching your tax return. " +
                        "Please refresh the page or go back to Filings."
                }
            } else {
                const helpData: HelpData = await apiClient.get(`/help`);
                const taxReturn: TaxReturnFiling =
                    await apiClient.get(`/accounts/${
                        userContext.account.id}/jurisdictions/tax-return-filings/${taxReturnId}`);

                page = {...page,
                    taxReturn: taxReturn,
                    contactusUrl: helpData.contact_us_url
                }
            }
        } catch (error: unknown) {
            page = {...page,
                isError: true,
                errorMessage: "There was an error fetching your jurisdiction. " +
                    "Please refresh and try again or go back to Jurisdictions"
            }
        } finally {
            setTaxReturnPage({...page, isLoading: false})
        }
    };

    /**
     * Downloads tax return documents from the API
     */
    const downloadTaxReturnDocuments = async () => {
        let page: TaxReturnPage = {...taxReturnPage};
        try {
            // show loader and clear out any error messages
            page = {...page, isRequesting: true, isDownloadError: false}
            setTaxReturnPage(page)

            if (!taxReturnId) {
                page = {...page, isDownloadError: true}
            } else {
                await apiClient.getDownload(
                    `/accounts/${
                        userContext.account.id}/jurisdictions/tax-return-filings/${taxReturnId}/documents`);
            }
        } catch (error: unknown) {
            page = {...page, isDownloadError: true}
        } finally {
            setTaxReturnPage({...page, isRequesting: false})
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await getTaxReturn(taxReturnId, userContext);
        };
        void fetchData();
    }, [taxReturnId, userContext]);

    const handleDownloadZipFile = () => {
        void downloadTaxReturnDocuments();
    }

    const renderBadge = (status: TaxReturnStatus, paymentDate: string|null, dueDate: string) => (
        <>
            <Badge type={status === TaxReturnStatus.FILED
                ? "positive"
                : status === TaxReturnStatus.PENDING_FILING
                    ? "info"
                    : status === TaxReturnStatus.ERROR
                        ? "negative"
                        : "neutral"}>
                {getReadableTaxReturnStatus(status)}
            </Badge>

            {status === TaxReturnStatus.FILED && (
                <Tooltip type="description"
                         delay={0}
                         trigger={
                             <Link onPress={undefined}>
                                 <Inline css={{marginLeft: 'small'}}>
                                     {!paymentDate && (
                                         <>
                                             <Badge type="warning">
                                                 Not paid
                                             </Badge>
                                         </>
                                     )}

                                     {paymentDate && (
                                         <>
                                             <Badge type="positive">
                                                 Paid
                                             </Badge>
                                         </>
                                     )}
                                 </Inline>
                             </Link>
                         }>
                    {paymentDate  && (
                        <>
                            This return was paid on {moment(paymentDate, apiDateFormat).format('MMM D, YYYY')} using the payment method provided during onboarding.
                        </>
                    )}
                    {!paymentDate  && (
                        <>
                            Please remit payment by {moment(dueDate, apiDateFormat).format('MMM D, YYYY')}.
                        </>
                    )}

                </Tooltip>
            )}
        </>
    );

    return (
        <ContextView
            title={`Tax Return ${taxReturnPage.taxReturn ? `- ${taxReturnPage.taxReturn.jurisdiction_name}` : ""}`}
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

            {taxReturnPage.isLoading && (
                <Box css={{width: 'fill', textAlign: 'center', alignX: 'center', alignY: 'center'}}>
                    <Spinner size='large'/>
                </Box>
            )}

            {!taxReturnPage.isLoading && (
                <>

                    {taxReturnPage.isError && (
                        <Box css={{marginTop: 'medium', marginBottom: 'medium', textAlign: 'center', color: 'critical'}}>
                            {taxReturnPage.errorMessage}
                        </Box>
                    )}

                    {taxReturnPage.taxReturn && (
                        <>
                            <InfoSection label="TAX PERIOD"
                                         value={`${moment(taxReturnPage.taxReturn.tax_period_start_date, apiDateFormat).format('MMM D, YYYY')} - ${moment(taxReturnPage.taxReturn.tax_period_end_date, apiDateFormat).format('MMM D, YYYY')}`} />

                            <JurisdictionInfoSection
                                jurisdictionName={taxReturnPage.taxReturn.jurisdiction_name}
                                flagSrc={flagSvgImages[taxReturnPage.taxReturn.country_code]}
                            />

                            <InfoSection label="FILING FREQUENCY"
                                         value={taxReturnPage.taxReturn.frequency_display_name} />

                            <InfoSection label="DUE DATE"
                                         value={moment(taxReturnPage.taxReturn.due_date, apiDateFormat).format('MMM D, YYYY')} />

                            <InfoSection label="STATUS"
                                         value={
                                <Box>
                                    <Box>
                                        {renderBadge(
                                            taxReturnPage.taxReturn.status,
                                            taxReturnPage.taxReturn.payment_date,
                                            taxReturnPage.taxReturn.due_date)}
                                    </Box>
                                    {taxReturnPage.taxReturn.status === TaxReturnStatus.ERROR && (
                                        <>
                                            <Link href={taxReturnPage.contactusUrl}
                                                  type="secondary"
                                                  target="_blank">
                                                <Box css={{
                                                    stack: 'x',
                                                    gap: 'xsmall',
                                                    alignX: 'start',
                                                    alignY: 'center',
                                                    font: 'caption'
                                                }}>
                                                    <Inline>
                                                        Contact Taxually
                                                    </Inline>
                                                    <Icon name="external" size="xsmall"/>
                                                </Box>
                                            </Link>

                                            {taxReturnPage.taxReturn.knowledge_base_url && (
                                                <Box>
                                                    <Link href={taxReturnPage.taxReturn.knowledge_base_url}
                                                          type="secondary"
                                                          target="_blank">
                                                        <Box css={{
                                                            stack: 'x',
                                                            gap: 'xsmall',
                                                            alignX: 'start',
                                                            alignY: 'center',
                                                            font: 'caption'
                                                        }}>
                                                            <Inline>
                                                                Payment instructions
                                                            </Inline>
                                                            <Icon name="external" size="xsmall"/>
                                                        </Box>
                                                    </Link>
                                                </Box>
                                            )}
                                        </>
                                    )}

                                    {taxReturnPage.taxReturn.status !== TaxReturnStatus.ERROR && (
                                        <>
                                            {taxReturnPage.taxReturn.payment_portal_url && (
                                                <Box>
                                                    <Link href={taxReturnPage.taxReturn.payment_portal_url}
                                                          type="secondary"
                                                          target="_blank">
                                                        <Box css={{
                                                            stack: 'x',
                                                            gap: 'xsmall',
                                                            alignX: 'start',
                                                            alignY: 'center',
                                                            font: 'caption'
                                                        }}>
                                                            <Inline>
                                                                Payment portal
                                                            </Inline>
                                                            <Icon name="external" size="xsmall"/>
                                                        </Box>
                                                    </Link>
                                                </Box>
                                            )}

                                            {taxReturnPage.taxReturn.knowledge_base_url && (
                                                <Box>
                                                    <Link href={taxReturnPage.taxReturn.knowledge_base_url}
                                                          type="secondary"
                                                          target="_blank">
                                                        <Box css={{
                                                            stack: 'x',
                                                            gap: 'xsmall',
                                                            alignX: 'start',
                                                            alignY: 'center',
                                                            font: 'caption'
                                                        }}>
                                                            <Inline>
                                                                Payment instructions
                                                            </Inline>
                                                            <Icon name="external" size="xsmall"/>
                                                        </Box>
                                                    </Link>
                                                </Box>
                                            )}


                                        </>

                                    )}

                                </Box>
                            } />

                            {(taxReturnPage.taxReturn.status !== TaxReturnStatus.FILED &&
                                taxReturnPage.taxReturn.status !== TaxReturnStatus.FETCHING_DATA) && (
                                <>
                                    <Divider />

                                    <Box css={{marginTop: 'medium'}}></Box>

                                    <TwoColumnInfoAmountSection
                                        label="TAX COLLECTED"
                                        amount={taxReturnPage.taxReturn.tax_collected.amount_in_default_currency||0}
                                        currencyCode={taxReturnPage.taxReturn.tax_collected.default_currency_code}
                                        nativeAmount={taxReturnPage.taxReturn.tax_collected.amount_in_filing_currency||0}
                                        nativeCurrencyCode={taxReturnPage.taxReturn.tax_collected.filing_currency_code}
                                    />

                                    {(taxReturnPage.taxReturn.additional_taxes||[]).map((at, idx) => (
                                        <Box key={idx}>
                                            <TwoColumnInfoAmountSection
                                                label={at.name}
                                                amount={at.amount_in_default_currency||0}
                                                currencyCode={at.default_currency_code}
                                                nativeAmount={at.amount_in_filing_currency||0}
                                                nativeCurrencyCode={at.filing_currency_code}
                                            />
                                        </Box>
                                    ))}

                                    {(taxReturnPage.taxReturn.discounts||[]).map((at, idx) => (
                                        <Box key={idx}>
                                            <TwoColumnInfoAmountSection
                                                label={at.name}
                                                amount={at.amount_in_default_currency||0}
                                                currencyCode={at.default_currency_code}
                                                nativeAmount={at.amount_in_filing_currency||0}
                                                nativeCurrencyCode={at.filing_currency_code}
                                            />
                                        </Box>
                                    ))}

                                    <TwoColumnInfoAmountSection
                                        label="TAX DUE"
                                        amount={taxReturnPage.taxReturn.tax_due.amount_in_default_currency||0}
                                        currencyCode={taxReturnPage.taxReturn.tax_due.default_currency_code}
                                        nativeAmount={taxReturnPage.taxReturn.tax_due.amount_in_filing_currency||0}
                                        nativeCurrencyCode={taxReturnPage.taxReturn.tax_due.filing_currency_code}
                                    />

                                    <Box css={{marginTop: 'small'}}>
                                        <Banner
                                            type="default"
                                            title="Note about remittence currencies"
                                            description={`Be sure to remit payment to local tax authorities in ${taxReturnPage.taxReturn.tax_due.filing_currency_code}`}
                                        />
                                    </Box>
                                </>
                            )}

                            {taxReturnPage.taxReturn.status === TaxReturnStatus.FILED && (
                                <>
                                    <Divider />

                                    <Box css={{marginTop: 'medium'}}></Box>

                                    {taxReturnPage.taxReturn.notes && taxReturnPage.taxReturn.notes.length > 0 && (
                                        <NotesSection
                                            date={moment(taxReturnPage.taxReturn.notes[0].created_date, apiDateFormat).format('MMM D, YYYY')}
                                            content={taxReturnPage.taxReturn.notes[0].content}
                                        />
                                    )}

                                    <TwoColumnInfoAmountSection
                                        label="TAX COLLECTED"
                                        amount={taxReturnPage.taxReturn.tax_collected.amount_in_default_currency||0}
                                        currencyCode={taxReturnPage.taxReturn.tax_collected.default_currency_code}
                                        nativeAmount={taxReturnPage.taxReturn.tax_collected.amount_in_filing_currency||0}
                                        nativeCurrencyCode={taxReturnPage.taxReturn.tax_collected.filing_currency_code}
                                    />

                                    {(taxReturnPage.taxReturn.additional_taxes||[]).map((at, idx) => (
                                        <Box key={idx}>
                                            <TwoColumnInfoAmountSection
                                                label={at.name}
                                                amount={at.amount_in_default_currency||0}
                                                currencyCode={at.default_currency_code}
                                                nativeAmount={at.amount_in_filing_currency||0}
                                                nativeCurrencyCode={at.filing_currency_code}
                                            />
                                        </Box>
                                    ))}

                                    {(taxReturnPage.taxReturn.discounts||[]).map((at, idx) => (
                                        <Box key={idx}>
                                            <TwoColumnInfoAmountSection
                                                label={at.name}
                                                amount={at.amount_in_default_currency||0}
                                                currencyCode={at.default_currency_code}
                                                nativeAmount={at.amount_in_filing_currency||0}
                                                nativeCurrencyCode={at.filing_currency_code}
                                            />
                                        </Box>
                                    ))}

                                    <TwoColumnInfoAmountSection
                                        label="TAX DUE"
                                        amount={taxReturnPage.taxReturn.tax_due.amount_in_default_currency||0}
                                        currencyCode={taxReturnPage.taxReturn.tax_due.default_currency_code}
                                        nativeAmount={taxReturnPage.taxReturn.tax_due.amount_in_filing_currency||0}
                                        nativeCurrencyCode={taxReturnPage.taxReturn.tax_due.filing_currency_code}
                                    />

                                    <Box css={{marginTop: 'small', marginBottom: 'small'}}>
                                        <Banner
                                            type="default"
                                            title="Note about remittence currencies"
                                            description={`Be sure to remit payment to local tax authorities in ${taxReturnPage.taxReturn.tax_due.filing_currency_code}`}
                                        />
                                    </Box>

                                    <Divider />

                                    <Box css={{marginTop: 'medium'}}></Box>

                                    {taxReturnPage.taxReturn.filed_date && (
                                        <InfoSection label="DATE FILED"
                                                     value={moment(taxReturnPage.taxReturn.filed_date, apiDateFormat).format('MMM D, YYYY')} />
                                    )}

                                    {/*
                                    <InfoSection label="DOCUMENTATION / PROOF OF FILING AND PAYMENTS"
                                                 value={
                                        <Box>

                                            {!taxReturnPage.taxReturn.has_file && (
                                                <>
                                                    <Box css={{ font: 'bodyEmphasized' }}>
                                                        No documents to display
                                                    </Box>
                                                </>
                                            )}

                                            {taxReturnPage.taxReturn.has_file && (
                                                <>
                                                    {taxReturnPage.isDownloadError && (
                                                        <Box css={{
                                                            marginTop: 'medium',
                                                            marginBottom: 'medium',
                                                            textAlign: 'center',
                                                            font: 'caption',
                                                            color: 'critical'}}>
                                                            There was an error downloading the documentation. Please try again or contact us if the problem persists.
                                                        </Box>
                                                    )}

                                                    <Link onPress={() => handleDownloadZipFile()} type="secondary">
                                                        <Box css={{
                                                            marginTop: 'small',
                                                            stack: 'x',
                                                            gap: 'small',
                                                            alignX: 'start',
                                                            alignY: 'center',
                                                            color: 'primary'
                                                        }}>
                                                            <Icon name="document" size="xsmall"/>
                                                            Download .zip file
                                                        </Box>
                                                    </Link>
                                                </>
                                            )}

                                        </Box>

                                    } />
                                    */}

                                </>
                            )}

                        </>
                    )}
                </>
            )}

        </ContextView>
    );
};

export default TaxReturn;
