import type {ExtensionContextValue} from "@stripe/ui-extension-sdk/context";
import React, {useEffect, useMemo, useRef, useState} from "react";
import Reconnect from "../reconnect/Reconnect";
import Loader from "./Loader";
import GenericError from "../error/GenericError";
import {Route, Routes, useNavigate} from "react-router-dom";
import Jurisdiction from "../jurisdiction/Jurisdiction";
import Jurisdictions from "../jurisdictions/Jurisdictions";
import TaxReturn from "../tax-return/TaxReturn";
import Filings from "../filings/Filings";
import Settings from "../settings/Settings";
import Support from "../support/Support";
import UnlinkAccount from "../unlink-account/UnlinkAccount";
import {ApiError, createApiClient} from "../../../api/api-client";
import {Account, AccountOnboardingStatus, AccountStatus, AccountUpdateParam} from "../../../interfaces/account";
import AccountCreation from "../account-creation/AccountCreation";

/**
 * Interface for the account details state
 */
interface LayoutPage {
    isLoading: boolean;
    isError: boolean;
    errorMessage: string;
    account: Account | null;
    isAccountCreating: boolean;
}

/**
 * Layout component that handles routing and account management
 * @param {ExtensionContextValue} props - The context values from the Stripe UI Extension SDK
 */
const Layout = ({ userContext, environment }: ExtensionContextValue) => {
    const timeoutRef = useRef<number>();
    const navigate = useNavigate();
    const [layoutPage, setLayoutPage] = useState<LayoutPage>({
        isLoading: true,
        isError: false,
        errorMessage: '',
        account: null,
        isAccountCreating: false
    });

    const apiClient = useMemo(() =>
        createApiClient(userContext, environment), [userContext]);

    /**
     * Fetches account information from the API
     */
    const getAccount = async (userContext: ExtensionContextValue["userContext"],
                              retryDelay = 3000,
                              timeoutRef: React.MutableRefObject<number | undefined>,
                              isInitialLoad: boolean) => {
        let page: LayoutPage = {...layoutPage};
        let awaitingAccountCreation = false;
        let createAccount = false;
        let accountFound = false;
        let continueFetchingRegistrations = false;

        const retryAccountFetch = async (retryDelay: number, isInitialLoad: boolean) => {
            timeoutRef.current = window.setTimeout(async () => {
                await getAccount(userContext, retryDelay, timeoutRef, isInitialLoad);
            }, retryDelay);
        };

        try {
            // show loader and clear out any error messages
            page = {...page, isLoading: isInitialLoad, isError: false, errorMessage: ''};
            setLayoutPage(page);

            let account: Account|null = null;

            if (isInitialLoad) {
                // initial load
                try {
                    // get account, and create if not found
                    account = await apiClient.get(`/accounts/${userContext.account.id}`);
                } catch (error: unknown) {
                    if (error instanceof ApiError) {
                        if (error.status === 404) {
                            // account hasn't been created yet
                            page = {...page, account: null};
                            createAccount = true; // set flag to create account from marketplace app
                        } else {
                            // unexpected error for fetch account
                            throw error;
                        }
                    } else {
                        // unexpected error for fetch account
                        throw error;
                    }
                }

                if (createAccount) {
                    // account not found, and first time load, so try creating an account
                    try {
                        account = await apiClient.post(`/accounts/${userContext.account.id}`, {});
                    } catch (error: unknown) {
                        if (error instanceof ApiError) {
                            if (error.status === 405) {
                                // post call not available. this would happen during transition between app review
                                // and release. In this scenario, rely on webhook, so do nothing here
                            } else if (error.status === 409) {
                                // account already exist, so go to fetch, post got called twice or race condition
                                // issue, so do nothing here
                            }
                        } else {
                            throw error;
                        }
                    }
                }
            }

            isInitialLoad = false;

            if (!account) {
                account = await apiClient.get(`/accounts/${userContext.account.id}`);
            }

            if (account) {
                // Check if onboarding status is FETCHING_REGISTRATIONS
                if (account.onboarding_status === AccountOnboardingStatus.FETCHING_REGISTRATIONS) {
                    continueFetchingRegistrations = true;
                } else {
                    page = {...page, account: account};
                    accountFound = true; // Account found
                }
            } else {
                // this shouldn't get hit, as if account is null, then it would've gone to catch block here.

            }
        } catch (error: unknown) {
            if (error instanceof ApiError) {
                if (error.status === 404) {
                    // account hasn't been created yet, retry fetching account
                    page = {...page, account: null};
                    awaitingAccountCreation = true; // Continue retrying

                } else if (error.status >= 500 && error.status < 600) {
                    // unknown error for server errors (e.g., 500, 503)
                    page = {...page, isError: true, errorMessage: 'There was an error fetching your account information. Please try again.'};
                } else {
                    // For other known API errors (e.g., 403 Forbidden), break out
                    page = {...page, isError: true, errorMessage: 'There was an error reaching our server. Please try again.'};
                }
            } else {
                // This is an unknown error
                page = {...page, isError: true, errorMessage: 'There was an error reaching our server. Please try again.'};
            }
        } finally {
            setLayoutPage({...page, isLoading: false});

            // Retry if account not found or if account onboarding status is FETCHING_REGISTRATIONS
            if ((awaitingAccountCreation || continueFetchingRegistrations) && !accountFound) {
                void retryAccountFetch(retryDelay, isInitialLoad);
            }
        }
    };

    /**
     * Resyncs the account jurisdictions
     */
    const reSyncJurisdictions = async () => {
        let page: LayoutPage = {...layoutPage};
        try {
            // show loader and clear out any error messages
            page = {...page, isLoading: true, isError: false, errorMessage: ''}
            setLayoutPage(page)

            let account: Account = await apiClient.get(`/accounts/${userContext.account.id}`);

            const request: AccountUpdateParam = {
                auto_approve_tax_returns: account.auto_approve_tax_returns,
                status: account.status,
                onboarding_status: AccountOnboardingStatus.FETCHING_REGISTRATIONS
            }
            account = await apiClient.patch(`/accounts/${userContext.account.id}`, request);

            page = {...page, isLoading: false, account: account}
            setLayoutPage(page)

            let continueFetchingRegistrations = true;

            while (continueFetchingRegistrations) {
                // this prevents a glitch if it's really fast
                await new Promise(resolve => setTimeout(resolve, 2000));

                account = await apiClient.get(`/accounts/${userContext.account.id}`);

                if (account.onboarding_status !== AccountOnboardingStatus.FETCHING_REGISTRATIONS) {
                    continueFetchingRegistrations = false;
                    page = {...page, account: account}
                }
            }

        } catch (error: unknown) {
            if (error instanceof ApiError) {
                // This is a known API error
                page = {...page,
                    isLoading: false,
                    isError: true,
                    errorMessage: 'There was an error reaching our server. Please try again.'}
            } else {
                // This is an unknown error
                page = {...page,
                    isLoading: false,
                    isError: true,
                    errorMessage: 'There was an error reaching our server. Please try again.'}
            }
        } finally {
            setLayoutPage(page)
        }
    }

    /**
     * Resets the account by deactivating it
     */
    const resetAccount = async () => {
        let page: LayoutPage = {...layoutPage};
        try {
            // show loader and clear out any error messages
            page = {...page, isLoading: true, isError: false, errorMessage: ''}
            setLayoutPage(page)

            await apiClient.delete(`/accounts/${userContext.account.id}`);
            const account: Account = await apiClient.get(`/accounts/${userContext.account.id}`);

            page = {...page, account: account}
            navigate("/");

        } catch (error: unknown) {
            if (error instanceof ApiError) {
                // This is a known API error
                page = {...page, isError: true, errorMessage: 'There was an error reaching our server. Please try again.'}
            } else {
                // This is an unknown error
                page = {...page, isError: true, errorMessage: 'There was an error reaching our server. Please try again.'}
            }
        } finally {
            setLayoutPage({...page, isLoading: false})
        }
    };

    /**
     * Reconnect the account and making it active
     */
    const reconnectAccount = async () => {
        let page: LayoutPage = {...layoutPage};
        try {
            // show loader and clear out any error messages
            page = {...page, isLoading: true, isError: false, errorMessage: ''}
            setLayoutPage(page)
            const request: AccountUpdateParam = {status: AccountStatus.ACTIVE}
            const account: Account = await apiClient.patch(`/accounts/${userContext.account.id}`, request);

            page = {...page, account: account}
            navigate("/");
            setLayoutPage(page)

        } catch (error: unknown) {
            if (error instanceof ApiError) {
                // This is a known API error
                page = {...page, isError: true, errorMessage: 'There was an error reaching our server. Please try again.'}
            } else {
                // This is an unknown error
                page = {...page, isError: true, errorMessage: 'There was an error reaching our server. Please try again.'}
            }
        } finally {
            setLayoutPage({...page, isLoading: false})
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await getAccount(userContext, 3000, timeoutRef, true);
        };

        void fetchData();

        // Clear the timeout if the component unmounts to prevent memory leaks
        return () => {
            if (timeoutRef.current) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                clearTimeout(timeoutRef.current);
            }
        };
    }, [userContext]);

    /**
     * Determines the initial view based on account details
     * @param {LayoutPage} layoutPage - The current account details
     * @returns {JSX.Element} The component to render
     */
    const getInitialView = (layoutPage: LayoutPage): JSX.Element => {
        if (layoutPage.isError) {
            return <GenericError />;
        } else if (!layoutPage.account ||
            (layoutPage.account &&
                layoutPage.account.onboarding_status === AccountOnboardingStatus.FETCHING_REGISTRATIONS)) {
            return <AccountCreation />;
        } else if (layoutPage.account.status !== AccountStatus.ACTIVE) {
            return <Reconnect userContext={userContext}
                              environment={environment}
                              reconnectAccount={reconnectAccount} />;
        } else {
            // default to jurisdictions
            return <Jurisdictions reSyncJurisdictions={reSyncJurisdictions}
                                  userContext={userContext}
                                  environment={environment} />;
        }
    };

    if (layoutPage.isLoading) {
        return <Loader />;
    } else {
        return (
            <Routes>
                <Route path="/"
                       element={getInitialView(layoutPage)} />
                <Route path="/jurisdictions"
                       element={<Jurisdictions reSyncJurisdictions={reSyncJurisdictions}
                                               userContext={userContext}
                                               environment={environment} />} />
                <Route path="/jurisdictions/:jurisdictionId"
                       element={<Jurisdiction userContext={userContext} environment={environment} />} />
                <Route path="/filings"
                       element={<Filings userContext={userContext} environment={environment} />} />
                <Route path="/tax-return/:taxReturnId"
                       element={<TaxReturn userContext={userContext} environment={environment} />} />
                <Route path="/settings"
                       element={<Settings userContext={userContext} environment={environment} />} />
                <Route path="/support"
                       element={<Support userContext={userContext} environment={environment} />} />
                <Route path="/unlink-account"
                       element={<UnlinkAccount resetAccount={resetAccount}
                                               userContext={userContext}
                                               environment={environment} />} />
            </Routes>
        );
    }
};

export default Layout;
