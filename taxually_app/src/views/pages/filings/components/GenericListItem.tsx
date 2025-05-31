import React from 'react';
import {Badge, Box, Icon, Img, Inline, Link, ListItem, Tooltip} from "@stripe/ui-extension-sdk/ui";
import moment from "moment";
import {getReadableTaxReturnStatus} from "../../../../utils/filing-utils";
import {TaxReturnFilingSelection} from "../Filings";
import {flagSvgImages} from "../../../../assets/flags";
import {formatCurrencyWithCode, truncateStringWithEllipsis} from "../../../../utils/global-utils";
import {TaxReturnStatus} from "../../../../interfaces/tax-return";
import {apiDateFormat} from "../../../../configs/config";

interface GenericListItemProps {
    filing: TaxReturnFilingSelection;
    onViewTaxReturn: (taxReturnId: string) => void;
    contactUsUrl: string;
}

const GenericListItem: React.FC<GenericListItemProps> = ({
                                                             filing,
                                                             onViewTaxReturn,
                                                             contactUsUrl }) => {

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

    const renderBadge = (status: TaxReturnStatus, dueDate: string, paymentDate: string|null) => {
        if (status === TaxReturnStatus.PENDING_FILING) {
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
                    We are currently working on this filing
                </Tooltip>
            );
        } else if (status === TaxReturnStatus.ERROR) {
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
                    There is an issue with this filing. Please contact us as soon as possible
                </Tooltip>
            );
        } else if (status === TaxReturnStatus.FILED) {
            return (
                <>
                    <Tooltip type="description"
                             delay={0}
                             trigger={
                                 <Link onPress={undefined}>
                                     <Badge type={getBadgeType(status)}>
                                         {getReadableTaxReturnStatus(status)}
                                     </Badge>
                                 </Link>
                             }>
                        Tax authorities have accepted this return.
                    </Tooltip>
                    <Tooltip type="description"
                             delay={0}
                             trigger={
                                 <Link onPress={undefined}>
                                     <Inline css={{marginLeft: 'small'}}>
                                         {!paymentDate && (
                                             <>
                                                 <Badge type="warning">
                                                     Not paid
                                                 </Badge>
                                             </>
                                         )}

                                         {paymentDate && (
                                             <>
                                                 <Badge type="positive">
                                                     Paid
                                                 </Badge>
                                             </>
                                         )}
                                     </Inline>
                                 </Link>
                             }>
                        {paymentDate  && (
                            <>
                                This return was paid on {moment(paymentDate, apiDateFormat).format('MMM D, YYYY')} using the payment method provided during onboarding.
                            </>
                        )}
                        {!paymentDate  && (
                            <>
                                Please remit payment by {moment(dueDate, apiDateFormat).format('MMM D, YYYY')}.
                            </>
                        )}

                    </Tooltip>
                </>
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
            title={
                <Box css={{display: 'grid'}}>
                    <Box css={{ fontWeight: 'bold', font: 'bodyEmphasized' }}>
                        <Box css={{
                            stack: 'x',
                            gap: 'small',
                            alignX: 'start',
                            alignY: 'center',
                        }}>
                            <Img width="16"
                                 height="12"
                                 src={flagSvgImages[filing.country_code]}
                                 alt={filing.country_code} />
                            <Link onPress={() => onViewTaxReturn(filing.tax_return_id)}>
                                <Inline css={{color: 'brand'}}>
                                    {truncateStringWithEllipsis(filing.jurisdiction_name, 15)}
                                </Inline>
                            </Link>
                        </Box>
                    </Box>
                    <Box css={{ font: 'caption', marginTop: 'xsmall', marginBottom: 'xsmall'}}>
                        {renderBadge(filing.status, filing.due_date, filing.payment_date)}
                    </Box>

                    {filing.status === TaxReturnStatus.ERROR && (
                        <Link href={contactUsUrl} type="secondary" target="_blank">
                            <Box css={{font: 'caption'}}>
                                <Inline css={{marginRight: 'xsmall'}}>
                                    Contact Taxually
                                </Inline>
                                <Icon name="external" size="xsmall"/>
                            </Box>
                        </Link>
                    )}

                    {(filing.status === TaxReturnStatus.PENDING_FILING || filing.status === TaxReturnStatus.FILED) && (
                        <>
                            {filing.payment_portal_url && (
                                <Link href={filing.payment_portal_url}
                                      type="secondary"
                                      target="_blank">
                                    <Box css={{font: 'caption'}}>
                                        <Inline css={{marginRight: 'xsmall'}}>
                                            Payment portal
                                        </Inline>
                                        <Icon name="external" size="xsmall"/>
                                    </Box>
                                </Link>
                            )}
                        </>
                    )}
                </Box>
            }
            value={
                <Box css={{display: 'grid', textAlign: 'right'}}>
                    {filing.status === TaxReturnStatus.FETCHING_DATA && (
                        <Box css={{font: 'bodyEmphasized'}}>
                            Preparing
                        </Box>
                    )}

                    {filing.status !== TaxReturnStatus.FETCHING_DATA && (
                        <Box css={{font: 'bodyEmphasized'}}>
                            {formatCurrencyWithCode(filing.tax_due.amount_in_filing_currency, filing.tax_due.filing_currency_code, true)}
                        </Box>
                    )}

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

export default GenericListItem;
