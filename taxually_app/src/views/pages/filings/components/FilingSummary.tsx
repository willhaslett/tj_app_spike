import React from 'react';
import {Box, Icon, Inline, Tooltip} from "@stripe/ui-extension-sdk/ui";
import {formatCurrencyWithCode} from "../../../../utils/global-utils";
import moment from "moment/moment";

interface FilingSummaryProps {
    selectedDate: string;
    awaitingCount: number;
    pendingCount: number;
    filedCount: number;
    errorCount: number;
    estimatedTaxDue: number|null;
    currency: string;
}

const FilingSummary: React.FC<FilingSummaryProps> = ({
                                                         selectedDate,
                                                         awaitingCount,
                                                         pendingCount,
                                                         filedCount,
                                                         errorCount,
                                                         estimatedTaxDue,
                                                         currency }) => {
    return (
        <Box css={{
            marginTop: 'medium',
            padding: 'medium',
            backgroundColor: 'container',
            borderRadius: 'small',
            keyline: 'neutral'
        }}>
            <Box css={{stack: 'x', textAlign: 'center'}}>
                <Box css={{width: '1/3'}}>
                    <Box css={{ fontWeight: 'bold', font: 'heading' }}>
                        Summary
                    </Box>
                </Box>
                <Box css={{width: '2/3', textAlign: 'right'}}>
                    <Box css={{
                        stack: 'x',
                        alignY: 'bottom',
                        font: 'subheading'
                    }}>
                        <Inline>ESTIMATED TAX DUE</Inline>
                        <Tooltip type="description"
                                 delay={0}
                                 trigger={<Icon name="help" size="xsmall" css={{fill: 'secondary'}}/>}>
                            Based on average exchange rates for {moment(selectedDate, 'YYYY-MM').format('MMM YYYY')}. Actual amount due will differ.
                        </Tooltip>
                    </Box>
                    {estimatedTaxDue !== null && (
                        <Box css={{marginTop: 'xxsmall', font: 'heading'}}>
                            {formatCurrencyWithCode(estimatedTaxDue, currency, true)} {currency}
                        </Box>
                    )}
                    {estimatedTaxDue === null && (
                        <Box css={{marginTop: 'xxsmall', font: 'bodyEmphasized'}}>
                            Preparing Data
                        </Box>
                    )}

                </Box>
            </Box>

            <Box css={{stack: 'x', gap: 'xxsmall', marginTop: 'medium'}}>
                <Box css={{width: '1/4',  textAlign: 'center'}}>
                    <Box css={{font: 'subheading'}}>
                        AWAITING
                    </Box>
                    <Box css={{marginTop: 'xxsmall', font: 'subheading'}}>
                        {awaitingCount}
                    </Box>
                </Box>
                <Box css={{width: '1/4',  textAlign: 'center'}}>
                    <Box css={{font: 'subheading'}}>
                        PENDING
                    </Box>
                    <Box css={{marginTop: 'xxsmall', font: 'subheading'}}>
                        {pendingCount}
                    </Box>
                </Box>
                <Box css={{width: '1/4',  textAlign: 'center'}}>
                    <Box css={{font: 'subheading'}}>
                        FILED
                    </Box>
                    <Box css={{marginTop: 'xxsmall', font: 'subheading'}}>
                        {filedCount}
                    </Box>
                </Box>
                <Box css={{width: '1/4',  textAlign: 'center'}}>
                    <Box css={{font: 'subheading'}}>
                        ERROR
                    </Box>
                    <Box css={{marginTop: 'xxsmall', font: 'subheading'}}>
                        {errorCount}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default FilingSummary;
