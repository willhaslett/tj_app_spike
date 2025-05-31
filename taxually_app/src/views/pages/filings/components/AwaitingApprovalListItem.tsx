import React from 'react';
import {Badge, Box, Checkbox, Icon, Img, Inline, Link, ListItem, Tooltip} from "@stripe/ui-extension-sdk/ui";
import moment from "moment/moment";
import {getReadableTaxReturnStatus} from "../../../../utils/filing-utils";
import {TaxReturnFilingSelection} from "../Filings";
import {flagSvgImages} from "../../../../assets/flags";
import {formatCurrencyWithCode, truncateStringWithEllipsis} from "../../../../utils/global-utils";
import {TaxReturnStatus} from "../../../../interfaces/tax-return";
import {apiDateFormat} from "../../../../configs/config";

interface AwaitingApprovalListItemProps {
    selectedDate: string;
    filing: TaxReturnFilingSelection;
    onViewTaxReturn: (taxReturnId: string) => void;
    onTaxReturnSelect: (taxReturnId: string, isSelected: boolean) => void;
}

const AwaitingApprovalListItem: React.FC<AwaitingApprovalListItemProps> = ({
                                                                               selectedDate,
                                                                               filing,
                                                                               onViewTaxReturn,
                                                                               onTaxReturnSelect }) => {

    const getBadgeType = (status: TaxReturnStatus) => {
        switch (status) {
            case TaxReturnStatus.FETCHING_DATA:
                return "warning";
            case TaxReturnStatus.PENDING_FILING:
                return "info";
            case TaxReturnStatus.FILED:
                return "positive";
            case TaxReturnStatus.ERROR:
                return "negative";
            default:
                return "neutral";
        }
    }

    const renderBadge = (status: TaxReturnStatus) => {
        const approvedReturnsBy = moment(selectedDate, 'YYYY-MM')
            .date(8)
            .add(1, 'month')
            .format('MMM D, YYYY');
        if (status === TaxReturnStatus.AWAITING_APPROVAL) {
            return (
                <Tooltip type="description"
                         delay={0}
                         trigger={
                             <Link onPress={undefined}>
                                 <Badge type={getBadgeType(status)}>
                                     {getReadableTaxReturnStatus(status)}
                                 </Badge>
                             </Link>
                         }>
                    Approve by {approvedReturnsBy}, or it will be auto-approved
                </Tooltip>
            );
        } else {
            return (
                <Badge type={getBadgeType(status)}>
                    {getReadableTaxReturnStatus(status)}
                </Badge>
            );
        }
    }

    return (
        <ListItem
            id={filing.tax_return_id}
            image={
                <Box css={{marginLeft: 'xxsmall'}}>
                    <Checkbox
                        checked={filing.isSelected} // You might want to manage this state
                        onChange={(e) => onTaxReturnSelect(filing.tax_return_id, e.target.checked)}
                    />
                </Box>
            }
            title={
                <Box css={{display: 'grid'}}>
                    <Box css={{ fontWeight: 'bold', font: 'bodyEmphasized' }}>
                        <Box css={{
                            stack: 'x',
                            gap: 'small',
                            alignX: 'start',
                            alignY: 'center',
                        }}>
                            <Img width="16" height="12" src={flagSvgImages[filing.country_code]} alt={filing.country_code} />
                            <Link onPress={() => onViewTaxReturn(filing.tax_return_id)}>
                                <Inline css={{color: 'brand'}}>
                                    {truncateStringWithEllipsis(filing.jurisdiction_name, 15)}
                                </Inline>
                            </Link>
                        </Box>
                    </Box>

                    <Box css={{ font: 'caption', marginTop: 'xsmall'}}>
                        {renderBadge(filing.status)}
                    </Box>
                </Box>
            }
            value={
                <Box css={{display: 'grid', textAlign: 'right'}}>
                    <Box css={{font: 'bodyEmphasized'}}>
                        {formatCurrencyWithCode(filing.tax_due.amount_in_filing_currency, filing.tax_due.filing_currency_code, true)}
                    </Box>
                    <Box css={{ font: 'caption', color: 'secondary' }}>
                        {moment(filing.due_date, apiDateFormat).format('MMM D, YYYY')}
                    </Box>
                    <Inline css={{
                        stack: 'x',
                        gap: 'xsmall',
                        alignY: 'center',
                        alignX: 'end',
                        color: 'disabled',
                        font: 'caption'
                    }}>
                        <Icon name="change" size="xsmall" />
                        <Inline>
                            {filing.frequency_display_name}
                        </Inline>
                    </Inline>
                </Box>
            }
        />
    );
}

export default AwaitingApprovalListItem;
