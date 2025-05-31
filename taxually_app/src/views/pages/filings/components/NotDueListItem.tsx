import React from 'react';
import {Box, Icon, Img, Inline, ListItem} from "@stripe/ui-extension-sdk/ui";
import moment from "moment";
import {truncateStringWithEllipsis} from "../../../../utils/global-utils";
import {TaxReturnFiling} from "../../../../interfaces/tax-return";
import {apiDateFormat} from "../../../../configs/config";
import {disabledFlagSvgImages} from "../../../../assets/flags-disabled";

interface NotDueListItemProps {
    filing: TaxReturnFiling;
}

const NotDueListItem: React.FC<NotDueListItemProps> = ({ filing }) => {

    return (
        <ListItem
            id={filing.tax_return_id}
            image={
                <Img
                    height="12"
                    src={disabledFlagSvgImages[filing.country_code]}
                    alt={filing.country_code}
                />
            }
            title={
                <Box>
                    <Box css={{color: 'disabled', font: 'bodyEmphasized'}}>
                        {truncateStringWithEllipsis(filing.jurisdiction_name, 18)}
                    </Box>
                </Box>
            }
            value={
                <Box css={{display: 'grid', textAlign: 'right'}}>
                    <Box css={{ font: 'caption', color: 'disabled' }}>
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

export default NotDueListItem;
