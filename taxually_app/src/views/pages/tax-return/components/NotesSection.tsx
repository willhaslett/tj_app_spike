import React from 'react';
import {Box, Inline} from "@stripe/ui-extension-sdk/ui";

interface NotesSectionProps {
    date: string;
    content: string;
}

export const NotesSection: React.FC<NotesSectionProps> = ({ date, content }) => {
    return (
        <Box css={{
            marginBottom: 'medium',
            padding: 'medium',
            backgroundColor: 'container',
            borderRadius: 'small',
            keyline: 'neutral'
        }}>
            <Box css={{fontWeight: 'bold', marginBottom: 'medium', font: 'subheading'}}>
                NOTES
            </Box>
            <Box css={{color: 'secondary', marginTop: 'medium', font: 'body'}}>
                <Inline>{date}</Inline>
            </Box>
            <Box css={{marginTop: 'xsmall', font: 'body'}}>{content}</Box>
        </Box>
    );
}
