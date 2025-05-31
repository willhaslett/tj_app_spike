export interface TaxReturnFilings {
    estimated_tax_due: number|null;
    estimated_tax_currency_code: string;
    filings?: TaxReturnFiling[];
    future_filings?: TaxReturnFiling[];
}

export interface TaxReturnFiling {
    tax_return_id: string;
    country_code: string;
    jurisdiction_code: string;
    jurisdiction_name: string;
    tax_period_start_date: string;
    tax_period_end_date: string;
    due_date: string;
    frequency: string;
    frequency_display_name: string;
    status: TaxReturnStatus;
    tax_collected: Amount;
    tax_due: Amount;
    additional_taxes?: Amount[];
    discounts?: Amount[];
    notes?: Note[];
    confirmation_number: string|null;
    filed_date: string|null;
    payment_date: string|null;
    payment_portal_url: string;
    knowledge_base_url: string|null;
    has_file: boolean;
}

export enum TaxReturnStatus {
    FETCHING_DATA = 'FETCHING_DATA',
    AWAITING_APPROVAL = 'AWAITING_APPROVAL',
    PENDING_FILING = 'PENDING_FILING',
    FILED = 'FILED',
    ERROR = 'ERROR'
}

export interface Note {
    created_date: string;
    content: string;
}

export interface Amount {
    name: string;
    amount_in_default_currency?: number;
    amount_in_filing_currency?: number;
    default_currency_code: string;
    filing_currency_code: string;
}

export interface TaxReturnFilingApprovalUpdateParam {
    tax_return_id: string;
    country_code: string;
}
