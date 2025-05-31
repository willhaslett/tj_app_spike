import React from 'react';
import {Box, Button} from "@stripe/ui-extension-sdk/ui";
import moment from "moment";

interface FilingFooterProps {
    selectedCount: number;
    selectedDate: string;
    isRequesting: boolean;
    isError: boolean;
    errorMessage: string;
    onApprove: () => Promise<void>;
}

const FilingFooter: React.FC<FilingFooterProps> = ({
                                                       selectedCount,
                                                       selectedDate,
                                                       isRequesting,
                                                       isError,
                                                       errorMessage,
                                                       onApprove }) => {
    return (
        <Box>
            <Button
                type="primary"
                css={{ width: 'fill', alignX: 'center' }}
                onPress={onApprove}
                disabled={isRequesting}
            >
                Approve {selectedCount} return{selectedCount !== 1 ? 's' : ''} for {moment(selectedDate, 'YYYY-MM').format('MMM YYYY')}
            </Button>

            {isError && (
                <Box css={{marginTop: 'medium', textAlign: 'left', color: 'critical'}}>
                    {errorMessage}
                </Box>
            )}

            <Box css={{marginTop: 'small', textAlign: 'left', font: 'caption'}}>
                By clicking the button, you authorize Taxually to file selected returns on your organizations behalf.
            </Box>

        </Box>
    );
}

export default FilingFooter;
