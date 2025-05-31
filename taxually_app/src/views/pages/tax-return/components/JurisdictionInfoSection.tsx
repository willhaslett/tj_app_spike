import React from 'react';
import {Box, Img} from "@stripe/ui-extension-sdk/ui";
import {InfoSection} from "./InfoSection";

interface JurisdictionInfoSectionProps {
    jurisdictionName: string;
    flagSrc: string;
}

export const JurisdictionInfoSection: React.FC<JurisdictionInfoSectionProps> = ({
                                                                                    jurisdictionName,
                                                                                    flagSrc }) => (
    <InfoSection
        label="JURISDICTION"
        value={
            <Box css={{
                stack: 'x',
                gap: 'small',
                alignX: 'start',
                alignY: 'bottom',
            }}>
                <Img width="18" height="18" src={flagSrc} alt={jurisdictionName} />
                {jurisdictionName}
            </Box>
        }
    />
);
