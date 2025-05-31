import React from 'react';
import {Banner, Box, Divider, List, Spinner} from "@stripe/ui-extension-sdk/ui";
import AwaitingApprovalListItem from './AwaitingApprovalListItem';
import GenericListItem from './GenericListItem';
import {TaxReturnFilingSelection} from "../Filings";
import {groupTaxReturnsByStatus} from "../../../../utils/filing-utils";
import NotDueListItem from "./NotDueListItem";
import {TaxReturnFiling, TaxReturnStatus} from "../../../../interfaces/tax-return";
import moment from "moment/moment";

interface FilingListProps {
    isLoading: boolean;
    filings: TaxReturnFilingSelection[];
    futureFilings: TaxReturnFiling[];
    selectedDate: string;
    onViewTaxReturn: (taxReturnId: string) => void;
    onTaxReturnSelect: (taxReturnId: string, isSelected: boolean) => void;
    automaticApprovalEnabled: boolean;
    contactUsUrl: string;
}

const FilingList: React.FC<FilingListProps> = ({
                                                   isLoading,
                                                   filings,
                                                   futureFilings,
                                                   selectedDate,
                                                   onViewTaxReturn,
                                                   onTaxReturnSelect,
                                                   automaticApprovalEnabled,
                                                   contactUsUrl }) => {

    const groupedTaxReturns: Record<TaxReturnStatus, TaxReturnFilingSelection[]> =
        groupTaxReturnsByStatus(filings);

    const error = groupedTaxReturns[TaxReturnStatus.ERROR];
    const awaitingApproval = groupedTaxReturns[TaxReturnStatus.AWAITING_APPROVAL];
    const fetchingData = groupedTaxReturns[TaxReturnStatus.FETCHING_DATA];
    const pendingFiling = groupedTaxReturns[TaxReturnStatus.PENDING_FILING];
    const filed = groupedTaxReturns[TaxReturnStatus.FILED];

    const approvedReturnsBy = moment(selectedDate, 'YYYY-MM')
        .date(8)
        .add(1, 'month')
        .format('D MMMM');

    // order of priority for list display
    // 1. Error 2. Awaiting Approval 3. Fetching Data 4. Pending Filing 5. Filed 6. Not Due

    return (
        <Box css={{ marginTop: 'medium' }}>

            {isLoading && (
                <Box css={{width: 'fill', textAlign: 'center', alignX: 'center', alignY: 'center'}}>
                    <Spinner size='large'/>
                </Box>
            )}

            {(filings.length === 0 && futureFilings.length === 0 && !isLoading) && (
                <Box css={{textAlign: 'center', font: 'bodyEmphasized'}}>
                    No filings found
                </Box>
            )}

            {error.length > 0 && (
                <Box css={{marginBottom: 'large'}}>
                    <Box css={{stack: 'x', alignY: 'bottom', marginTop: 'medium' }}>
                        <Box css={{width: '1/2'}}>
                            <Box css={{font: 'body', color: 'secondary', fontWeight: 'semibold'}}>Needs attention</Box>
                        </Box>
                        <Box css={{width: '1/2', textAlign: 'right'}}>
                            <Box css={{font: 'body', color: 'secondary', fontWeight: 'semibold'}}>Tax due</Box>
                            <Box css={{font: 'caption', color: 'secondary'}}>Due date</Box>
                            <Box css={{font: 'caption', color: 'disabled'}}>Filing frequency</Box>
                        </Box>
                    </Box>

                    <Divider />

                    <List aria-label="Filings List">
                        {error.map(filing =>
                            <GenericListItem
                                key={filing.tax_return_id}
                                filing={filing}
                                onViewTaxReturn={onViewTaxReturn}
                                contactUsUrl={contactUsUrl}
                            />
                        )}
                    </List>
                </Box>
            )}

            {awaitingApproval.length > 0 && (
                <Box css={{marginBottom: 'large'}}>
                    <Box css={{stack: 'x', alignY: 'bottom', marginTop: 'medium' }}>
                        <Box css={{width: '1/2'}}>
                            <Box css={{font: 'body', color: 'secondary', fontWeight: 'semibold'}}>Awaiting approval</Box>
                        </Box>
                        <Box css={{width: '1/2', textAlign: 'right'}}>
                            <Box css={{font: 'body', color: 'secondary', fontWeight: 'semibold'}}>Tax due</Box>
                            <Box css={{font: 'caption', color: 'secondary'}}>Due date</Box>
                            <Box css={{font: 'caption', color: 'disabled'}}>Filing frequency</Box>
                        </Box>
                    </Box>

                    <Divider />

                    <Box css={{marginTop: 'small'}}>
                        <Banner
                            type="caution"
                            title={`Approve by 11pm (your local time) on ${approvedReturnsBy}`}
                            description="Taxually will automatically file return(s) due this month if not approved by the specified date."
                        />
                    </Box>

                    <List aria-label="Filings List">
                        {awaitingApproval.map(filing =>
                            <AwaitingApprovalListItem
                                selectedDate={selectedDate}
                                key={filing.tax_return_id}
                                filing={filing}
                                onTaxReturnSelect={onTaxReturnSelect}
                                onViewTaxReturn={onViewTaxReturn}
                            />
                        )}
                    </List>
                </Box>
            )}

            {fetchingData.length > 0 && (
                <Box css={{marginBottom: 'large'}}>
                    <Box css={{stack: 'x', alignY: 'bottom', marginTop: 'medium' }}>
                        <Box css={{width: '1/2'}}>
                            <Box css={{font: 'body', color: 'secondary', fontWeight: 'semibold'}}>Fetching data</Box>
                        </Box>
                        <Box css={{width: '1/2', textAlign: 'right'}}>
                            <Box css={{font: 'body', color: 'secondary', fontWeight: 'semibold'}}>Tax due</Box>
                            <Box css={{font: 'caption', color: 'secondary'}}>Due date</Box>
                            <Box css={{font: 'caption', color: 'disabled'}}>Filing frequency</Box>
                        </Box>
                    </Box>

                    <Divider />

                    <List aria-label="Filings List">
                        {fetchingData.map(filing =>
                            <GenericListItem key={filing.tax_return_id}
                                             filing={filing}
                                             onViewTaxReturn={onViewTaxReturn}
                                             contactUsUrl={contactUsUrl}
                            />
                        )}
                    </List>
                </Box>
            )}

            {pendingFiling.length > 0 && (
                <Box css={{marginBottom: 'large'}}>
                    <Box css={{stack: 'x', alignY: 'bottom', marginTop: 'medium' }}>
                        <Box css={{width: '1/2'}}>
                            <Box css={{font: 'body', color: 'secondary', fontWeight: 'semibold'}}>Pending filing</Box>
                        </Box>
                        <Box css={{width: '1/2', textAlign: 'right'}}>
                            <Box css={{font: 'body', color: 'secondary', fontWeight: 'semibold'}}>Tax due</Box>
                            <Box css={{font: 'caption', color: 'secondary'}}>Due date</Box>
                            <Box css={{font: 'caption', color: 'disabled'}}>Filing frequency</Box>
                        </Box>
                    </Box>

                    <Divider />

                    {automaticApprovalEnabled && (
                        <Box css={{marginTop: 'small'}}>
                            <Banner
                                type="default"
                                title="Automatic approval enabled"
                                description="Returns will be filed as soon as they are prepared"
                            />
                        </Box>
                    )}

                    <List aria-label="Filings List">
                        {pendingFiling.map(filing =>
                            <GenericListItem key={filing.tax_return_id}
                                             filing={filing}
                                             onViewTaxReturn={onViewTaxReturn}
                                             contactUsUrl={contactUsUrl}
                            />
                        )}
                    </List>
                </Box>
            )}

            {filed.length > 0 && (
                <Box css={{marginBottom: 'large'}}>
                    <Box css={{stack: 'x', alignY: 'bottom', marginTop: 'medium' }}>
                        <Box css={{width: '1/2'}}>
                            <Box css={{font: 'body', color: 'secondary', fontWeight: 'semibold'}}>Filed</Box>
                        </Box>
                        <Box css={{width: '1/2', textAlign: 'right'}}>
                            <Box css={{font: 'body', color: 'secondary', fontWeight: 'semibold'}}>Tax due</Box>
                            <Box css={{font: 'caption', color: 'secondary'}}>Due date</Box>
                            <Box css={{font: 'caption', color: 'disabled'}}>Filing frequency</Box>
                        </Box>
                    </Box>

                    <Divider />

                    <Box css={{marginTop: 'small'}}>
                        <Banner
                            type="default"
                            title="Payment information"
                            description="Funds must be remitted to the appropriate tax authority in each
                            jurisdictions local currency by the listed due date. You are responsible for this payment."
                        />
                    </Box>


                    <List aria-label="Filings List">
                        {filed.map(filing =>
                            <GenericListItem key={filing.tax_return_id}
                                             filing={filing}
                                             onViewTaxReturn={onViewTaxReturn}
                                             contactUsUrl={contactUsUrl}
                            />
                        )}
                    </List>
                </Box>
            )}

            {futureFilings.length > 0 && (
                <Box css={{marginBottom: 'large'}}>
                    <Box css={{stack: 'x', alignY: 'bottom', marginTop: 'medium' }}>
                        <Box css={{width: 'fill'}}>
                            <Box css={{font: 'body', color: 'secondary', fontWeight: 'semibold'}}>Not due for selected period</Box>
                        </Box>
                    </Box>

                    <Divider />

                    <List aria-label="Filings List">
                        {futureFilings.map(futureFiling =>
                            <NotDueListItem key={futureFiling.tax_return_id} filing={futureFiling} />
                        )}
                    </List>
                </Box>
            )}

        </Box>
    );
}

export default FilingList;
