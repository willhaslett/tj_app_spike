import React from 'react';
import {Box, Select} from "@stripe/ui-extension-sdk/ui";
import moment from "moment";

interface FilingHeaderProps {
    selectedDate: string;
    onDateChange: (date: string) => void;
}

const FilingHeader: React.FC<FilingHeaderProps> = ({ selectedDate, onDateChange }) => {

    const getMonthsOptions = () => {
        const options = [];
        const currentDate = moment().startOf('month'); // Get the start of the current month
        const startYear = 2024;
        const startDate = moment(`${startYear}-08-01`);

        // Loop from the current month back to the start date
        while (currentDate.isSameOrAfter(startDate, 'month')) {
            const monthName = currentDate.format('MMMM');
            const monthValue = currentDate.format('YYYY-MM');
            options.push(<option key={monthValue} value={monthValue}>{`${monthName} ${currentDate.year()}`}</option>);
            currentDate.subtract(1, 'month');
        }

        return options;
    };

    return (
        <Box css={{marginTop: 'medium'}}>
            <Select
                name="filing-date"
                label="Reporting period ending:"
                value={selectedDate}
                onChange={(e) => onDateChange(e.target.value)}
            >
                {getMonthsOptions()}
            </Select>
        </Box>
    );
}

export default FilingHeader;
