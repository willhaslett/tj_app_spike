import React from 'react';
import { Box } from "@stripe/ui-extension-sdk/ui";

interface TwoColumnInfoSectionProps {
    label: string;
    value: React.ReactNode;
}

export const TwoColumnInfoSection: React.FC<TwoColumnInfoSectionProps> = ({ label, value }) => {
    return (
        <Box css={{ marginBottom: 'medium' }}>
            <Box css={{ stack: 'x', gap: 'medium' }}>
                <Box css={{ width: '1/2' }}>
                    <Box css={{ color: 'secondary', font: 'subheading' }}>{label}</Box>
                </Box>
                <Box css={{ width: '1/2', textAlign: 'right' }}>
                    <Box css={{ font: 'bodyEmphasized' }}>{value}</Box>
                </Box>
            </Box>
        </Box>
    );
}
