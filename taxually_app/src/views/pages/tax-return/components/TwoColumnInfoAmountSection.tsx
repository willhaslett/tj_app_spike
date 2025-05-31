import React from 'react';
import {Box} from "@stripe/ui-extension-sdk/ui";
import {formatCurrencyWithCode} from "../../../../utils/global-utils";

interface TwoColumnInfoAmountSectionProps {
    label: string;
    amount: number;
    currencyCode: string;
    nativeAmount: number;
    nativeCurrencyCode: string;
}

export const TwoColumnInfoAmountSection: React.FC<TwoColumnInfoAmountSectionProps> = ({
                                                                                          label,
                                                                                          amount,
                                                                                          currencyCode,
                                                                                          nativeAmount,
                                                                                          nativeCurrencyCode}) => {
    return (
        <Box css={{ marginBottom: 'medium' }}>
            <Box css={{ stack: 'x', gap: 'medium' }}>
                <Box css={{ width: '1/2' }}>
                    <Box css={{ color: 'secondary', font: 'subheading' }}>{label}</Box>
                </Box>
                <Box css={{ width: '1/2', textAlign: 'right' }}>
                    <Box css={{ font: 'bodyEmphasized' }}>
                        {formatCurrencyWithCode(nativeAmount, nativeCurrencyCode, false)} {nativeCurrencyCode}
                    </Box>
                    {currencyCode !== nativeCurrencyCode && (
                        <Box css={{ font: 'body', color: 'secondary' }}>
                            {formatCurrencyWithCode(amount, currencyCode, false)} {currencyCode}
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
}
