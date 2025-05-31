import React from "react";
import {Box} from "@stripe/ui-extension-sdk/ui";

type Props = {
    title: string;
    children: React.ReactNode;
}
export const DescriptionContainer = (props: Props) => {
    const {title, children} = props;

    return (
        <Box
            css={{
                marginTop: "medium",
                background: "container",
                borderRadius: "small",
            }}
        >
            <Box css={{ font: "heading", padding: "small", paddingBottom: 0 }}>
                {title}
            </Box>
            <Box css={{ padding: "small" }}>{children}</Box>
        </Box>
    );
};
