import {Box, Button, Checkbox, ContextView, Select, Spinner} from "@stripe/ui-extension-sdk/ui";
import TaxuallyIcon from "../../../assets/branding/taxually-icon-light.svg";
import React, {useEffect, useMemo, useState} from "react";
import {BackButton} from "../../components/BackButton";
import {useNavigate} from "react-router-dom";
import {ExtensionContextValue} from "@stripe/ui-extension-sdk/context";
import {createApiClient} from "../../../api/api-client";
import {Account, AccountStatus, AccountUpdateParam} from "../../../interfaces/account";
import {MenuList} from "../../components/MenuList";
import {showToast} from "@stripe/ui-extension-sdk/utils";

type Props = {
    userContext: ExtensionContextValue["userContext"],
    environment: ExtensionContextValue["environment"]
}

type SettingsPage = {
    isLoading: boolean,
    isRequesting: boolean,
    isError: boolean,
    errorMessage: string,
    defaultCurrency: string,
    autoApproveEnabled: boolean
}

const Settings = (props: Props) => {
    const {userContext, environment} = props;
    const navigate = useNavigate();
    const [settingsPage, setSettingsPage] =
        useState<SettingsPage>({
            isLoading: true,
            isRequesting: false,
            isError: false,
            errorMessage: '',
            defaultCurrency: '',
            autoApproveEnabled: false
        });

    const apiClient = useMemo(() =>
        createApiClient(userContext, environment), [userContext]);

    /**
     * Fetches account settings from the API
     */
    const getAccountSettings = async (userContext: ExtensionContextValue["userContext"]) => {
        let page: SettingsPage = {...settingsPage};
        try {
            // show loader and clear out any error messages
            page = {...page, isLoading: true, isError: false, errorMessage: ''}
            setSettingsPage(page)

            const account: Account =
                await apiClient.get(`/accounts/${userContext.account.id}`);

            page = {...page,
                defaultCurrency: account.default_currency,
                autoApproveEnabled: account.auto_approve_tax_returns
            }
        } catch (error: unknown) {
            page = {...page,
                isError: true,
                errorMessage: "There was an error fetching your account settings. Please refresh and try again."
            }
        } finally {
            setSettingsPage({...page, isLoading: false})
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await getAccountSettings(userContext);
        };
        void fetchData();
    }, [userContext]);

    const handleAutoApproveChange = async (isChecked: boolean) => {
        let page: SettingsPage = {...settingsPage};
        try {
            // show loader and clear out any error messages
            page = {...page,
                isRequesting: true,
                isError: false,
                errorMessage: ''
            }
            setSettingsPage(page)

            const request: AccountUpdateParam = {
                auto_approve_tax_returns: isChecked,
                status: AccountStatus.ACTIVE
            }

            await apiClient.patch(`/accounts/${userContext.account.id}`, request);

            page = {...page,
                autoApproveEnabled: isChecked
            }

            void showToast("Settings saved.", {type: "success"})
        } catch (error: unknown) {
            page = {...page,
                isError: true,
                errorMessage: "There was an error updating your account settings. Please refresh and try again."
            }
        } finally {
            setSettingsPage({...page, isLoading: false})
        }
    }

    return (
        <ContextView
            title="Settings"
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
                                <MenuList currentRoute="/settings" />
                            </Box>
                        </Box>
                    </Box>
                </>
            }
        >

            {settingsPage.isLoading && (
                <Box css={{width: 'fill', textAlign: 'center', alignX: 'center', alignY: 'center'}}>
                    <Spinner size='large'/>
                </Box>
            )}

            {!settingsPage.isLoading && (
                <>

                    <Box css={{stack: 'y', height: 'fill'}}>

                        <Box css={{stack: 'y', alignY: 'top', width: 'fill',
                            paddingLeft: 'small', paddingRight: 'small'
                        }}>

                            {settingsPage.isError && (
                                <Box css={{marginBottom: 'medium', textAlign: 'center', color: 'critical'}}>
                                    {settingsPage.errorMessage}
                                </Box>
                            )}

                            <Box css={{
                                padding: 'medium',
                                backgroundColor: 'container',
                                borderRadius: 'small',
                                keyline: 'neutral',
                                width: 'fill',
                                stack: 'x',
                            }}>
                                <Box css={{width: '1/12'}}>
                                    <Box css={{marginTop: 'xxsmall'}}>
                                        <Checkbox
                                            checked={settingsPage.autoApproveEnabled}
                                            onChange={(e) => handleAutoApproveChange(e.target.checked)}
                                        />
                                    </Box>
                                </Box>
                                <Box css={{width: '11/12', marginLeft: 'small'}}>
                                    <Box css={{fontWeight: 'bold', marginBottom: 'xsmall', font: 'bodyEmphasized'}}>
                                        Auto-approve all filings
                                    </Box>
                                    <Box css={{font: 'body', color: 'secondary'}}>
                                        When enabled, all returns will be automatically filed as soon as they are prepared, eliminating the need for manual approval.
                                    </Box>
                                </Box>
                            </Box>
                        </Box>

                        <Box css={{stack: 'y', alignY: 'center', width: 'fill' }}>
                            <Select
                                disabled={true}
                                name="default-currency-setting"
                                label="Default currency"
                                defaultValue={settingsPage.defaultCurrency}
                            >
                                <option value={settingsPage.defaultCurrency}>{settingsPage.defaultCurrency}</option>
                            </Select>
                            <Box css={{font: 'caption', color: 'disabled', textAlign: 'center', marginTop: 'small'}}>
                                Configured in Stripe
                            </Box>
                        </Box>

                        <Box css={{stack: 'x', alignY: 'bottom', width: 'fill'}}>
                            <Button type="secondary" css={{ width: 'fill' }}
                                    onPress={() => navigate('/unlink-account')}>
                                Unlink account
                            </Button>
                        </Box>
                    </Box>
                </>
            )}



        </ContextView>
    );
};

export default Settings;
