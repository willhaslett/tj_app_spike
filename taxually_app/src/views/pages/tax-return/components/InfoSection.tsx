import React from 'react';
import {Box} from "@stripe/ui-extension-sdk/ui";

interface InfoSectionProps {
    label: string;
    value: React.ReactNode;
}

export const InfoSection: React.FC<InfoSectionProps> = ({ label, value }) => {
    return (
        <Box css={{ marginBottom: 'medium' }}>
            <Box css={{ font: 'subheading', color: 'secondary' }}>{label}</Box>
            <Box css={{ font: 'bodyEmphasized' }}>{value}</Box>
        </Box>
    );
}
