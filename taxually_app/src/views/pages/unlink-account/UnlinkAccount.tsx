import {Box, ContextView, Icon, Inline, Link} from "@stripe/ui-extension-sdk/ui";
import TaxuallyIcon from "../../../assets/branding/taxually-icon-light.svg";
import React, {useEffect, useMemo, useState} from "react";
import {BackButton} from "../../components/BackButton";
import {ExtensionContextValue} from "@stripe/ui-extension-sdk/context";
import {createApiClient} from "../../../api/api-client";
import {HelpData} from "../../../interfaces/help";

type Props = {
    resetAccount: () => void,
    userContext: ExtensionContextValue["userContext"],
    environment: ExtensionContextValue["environment"]
}

type UnlinkAccountPage = {
    isLoading: boolean,
    isRequesting: boolean,
    isError: boolean,
    errorMessage: string,
    contact_us_url: string;
    knowledge_base_url: string;
}

const UnlinkAccount = (props: Props) => {
    // const {resetAccount} = props;

    const {userContext, environment} = props;
    const [unlinkAccountPage, setUnlinkAccountPage] =
        useState<UnlinkAccountPage>({
            isLoading: true,
            isRequesting: false,
            isError: false,
            errorMessage: '',
            contact_us_url: '',
            knowledge_base_url: ''
        });

    const apiClient = useMemo(() =>
        createApiClient(userContext, environment), [userContext]);

    const getHelpData = async () => {
        let page: UnlinkAccountPage = {...unlinkAccountPage};
        try {
            // show loader and clear out any error messages
            page = {...page, isLoading: true, isError: false, errorMessage: ''}
            setUnlinkAccountPage(page)

            const helpData: HelpData =
                await apiClient.get(`/help`);

            page = {...page,
                contact_us_url: helpData.contact_us_url,
                knowledge_base_url: helpData.knowledge_base_url
            }
        } catch (error: unknown) {
            page = {...page,
                isError: true,
                errorMessage: "There was an error loading the page. Please refresh and try again."
            }
        } finally {
            setUnlinkAccountPage({...page, isLoading: false})
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await getHelpData();
        };
        void fetchData();
    }, []);


    return (
        <ContextView
            title="Unlink account"
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

            <Box>
                Unlinking your account will stop all filings and services.
                Please contact us if you wish to proceed with unlinking your account.
            </Box>

            <Box css={{marginTop: 'medium', textAlign: 'center'}}>

                <Link href={unlinkAccountPage.contact_us_url} type="secondary" target="_blank">
                    <Box css={{
                        stack: 'x',
                        gap: 'xsmall',
                        alignX: 'start',
                        alignY: 'center',
                    }}>
                        <Inline>Contact Customer Care </Inline>
                        <Icon name="external" size="xsmall"/>
                    </Box>
                </Link>

                {/*
                // Keep this here in case we need to provide a way to unlink the account from the app itself.
                <Button type="destructive" css={{ width: 'fill' }}
                        onPress={() => resetAccount()}>
                    Unlink account
                </Button>
                */}
            </Box>

        </ContextView>
    );
};

export default UnlinkAccount;
