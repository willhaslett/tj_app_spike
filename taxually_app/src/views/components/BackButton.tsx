import {useNavigate} from "react-router-dom";
import React from "react";
import {Box, Icon, Inline, Link} from "@stripe/ui-extension-sdk/ui";

type Props = {
    navigationLabel: string
}
export const BackButton = (props: Props) => {
    const {navigationLabel} = props;
    const navigate = useNavigate();

    return (
        <Box>
            <Link onPress={() => navigate(-1)}>
                <Box css={{
                    stack: 'x',
                    gap: 'xsmall',
                    alignX: 'start',
                    alignY: 'center',
                }}>
                    <Icon name="chevronLeft" size="xsmall" />
                    <Inline> {navigationLabel}</Inline>
                </Box>
            </Link>
        </Box>
    );
};
