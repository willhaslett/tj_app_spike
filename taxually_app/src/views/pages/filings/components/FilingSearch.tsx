import React from 'react';
import { Box, TextField } from "@stripe/ui-extension-sdk/ui";

interface FilingSearchProps {
    searchTerm: string;
    onSearch: (term: string) => void;
}

const FilingSearch: React.FC<FilingSearchProps> = ({ searchTerm, onSearch }) => {
    return (
        <Box>
            <Box css={{marginTop: 'medium', font: 'caption'}}>
                <Box>
                    Select returns to file or click into a jurisdiction for details.
                </Box>
            </Box>
            <Box css={{ marginTop: 'medium' }}>

                <TextField
                    placeholder="Filings Search"
                    value={searchTerm}
                    onChange={(e) => onSearch(e.target.value)}
                />
            </Box>
        </Box>
    );
}

export default FilingSearch;
