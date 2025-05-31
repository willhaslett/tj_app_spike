import {Box, Button, ContextView, Icon, Link} from "@stripe/ui-extension-sdk/ui";
import TaxuallyIcon from "../../../assets/branding/taxually-icon-light.svg";
import {BackButton} from "../../components/BackButton";
import React, {useEffect, useMemo, useState} from "react";
import {ExtensionContextValue} from "@stripe/ui-extension-sdk/context";
import {createApiClient} from "../../../api/api-client";
import {HelpData} from "../../../interfaces/help";
import {MenuList} from "../../components/MenuList";

type Props = {
    userContext: ExtensionContextValue["userContext"],
    environment: ExtensionContextValue["environment"]
}

type SupportPage = {
    isLoading: boolean,
    isRequesting: boolean,
    isError: boolean,
    errorMessage: string,
    contact_us_url: string;
    knowledge_base_url: string;
}

const Support = (props: Props) => {
    const {userContext, environment} = props;
    const [supportPage, setSupportPage] =
        useState<SupportPage>({
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
        let page: SupportPage = {...supportPage};
        try {
            // show loader and clear out any error messages
            page = {...page, isLoading: true, isError: false, errorMessage: ''}
            setSupportPage(page)

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
            setSupportPage({...page, isLoading: false})
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
            title="Support"
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
                                <MenuList currentRoute="/support" />
                            </Box>
                        </Box>
                    </Box>
                </>
            }
        >

            <Box css={{stack: 'y', alignY: 'center', height: 'fill', gapY: 'medium'}}>
                <Box>
                    <Link href={supportPage.knowledge_base_url} target="_blank" css={{width: 'fill'}}>
                        <Button type="secondary" css={{ width: 'fill' }}>
                            <Icon name="guide" size="xsmall"/>
                            Knowledge base
                            <Icon name="external" size="xsmall"/>
                        </Button>
                    </Link>
                </Box>

                <Box>
                    <Link href={supportPage.contact_us_url} target="_blank" css={{width: 'fill'}}>
                        <Button type="secondary" css={{ width: 'fill' }}>
                            <Icon name="email" size="xsmall"/>
                            Contact us
                            <Icon name="external" size="xsmall"/>
                        </Button>
                    </Link>
                </Box>
            </Box>


        </ContextView>
    );
};

export default Support;
